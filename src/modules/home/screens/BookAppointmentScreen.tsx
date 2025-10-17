import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetAllHospitalsQuery } from '../../hospital/hooks/queries/hospitals/use-get-list-hospital.query';
import { useGetAllCitiesQuery } from '../../hospital/hooks/queries/hospitals/use-get-list-cities.query';
import { useGetWardsbyCityQuery } from '../../hospital/hooks/queries/hospitals/use-get-list-wards-by-city.query';
import { useGetHospitalbyAddressQuery } from '../../hospital/hooks/queries/hospitals/use-get-hospital-by address.query';
import { Hospital } from '../../hospital/types/hospital';
import { Doctor } from '../../hospital/types/doctor';
import { useGetAllServicesByDoctorIdQuery } from '../../hospital/hooks/queries/services/use-get-list-service.query';
import { useGetTimeSlotsByDoctorIdQuery } from '../../hospital/hooks/queries/timeslots/use-get-time-slots-by-doctor-id.query';
import { useSelector } from 'react-redux';
import { RootState } from '../../../shared/stores';
import { useCreateBookingMutation } from '../../hospital/hooks/mutations/booking/use-create-booking.mutation';
import { BookingRequest } from '../../hospital/apis/booking/bookingApi';
import {
  SendAppointmentConfirmationRequest,
  SendEmailApi,
} from '../../hospital/apis/sendmail/sendMailApi';
import { useCreateVnpayPaymentMutation } from '../../hospital/hooks/mutations/vnpay/use-vnpay-payment.mutation';
import VNPayWebView from '../../hospital/components/VNPayWebView';
import PaymentConfirmationComponent from '../components/PaymentConfirmationComponent';
import BookingSummaryComponent from '../components/BookingSummaryComponent';

const { width } = Dimensions.get('window');

const Colors = {
  primaryBlue: '#3366FF',
  lightBlue: '#E6EEFF',
  textDark: '#1E1E1E',
  textGray: '#5C5C5C',
  backgroundWhite: '#FFFFFF',
};

export type TimeSlot = {
  slot_id: string;
  doctor_id: string;
  start_time: string;
  end_time: string;
  capacity: number;
  created_at: string;
  updated_at: string;
  appointment_id?: string;
};

export type Patient = {
  patient_id: string;
  user_id: string;
  full_name: string;
  dob: string;
  gender: 'male' | 'female';
  address: string;
  phone: string;
  email: string;
  image: string;
  created_at: string;
  updated_at: string;
};

enum Specialty {
  Ophthalmology = 'ophthalmology',
  InternalMedicine = 'internal_medicine',
  Neurology = 'neurology',
  Endocrinology = 'endocrinology',
  Pediatrics = 'pediatrics',
}

const SpecialtyLabel: Record<Specialty, string> = {
  [Specialty.Ophthalmology]: 'Nhãn khoa',
  [Specialty.InternalMedicine]: 'Nội khoa',
  [Specialty.Neurology]: 'Thần kinh',
  [Specialty.Endocrinology]: 'Nội tiết',
  [Specialty.Pediatrics]: 'Nhi khoa',
};

// Dữ liệu mẫu

type PatientInfo = {
  patientId: string | null;
  fullName: string | null;
  dob: string | null;
  gender: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  image: string | null;
};

type Step =
  | 'hospital'
  | 'doctor'
  | 'service'
  | 'schedule'
  | 'confirmation'
  | 'patient';

const BookAppointmentScreen = () => {
  const navigation = useNavigation();
  const { patient, userId } = useSelector((state: RootState) => state.auth);
  const [currentStep, setCurrentStep] = useState<Step>('hospital');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null,
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Set ngày hiện tại làm mặc định
    return new Date().toLocaleDateString('vi-VN');
  });
  const [_selectedTime, _setSelectedTime] = useState<string>('');

  // States cho filter và tìm kiếm
  const [searchText, setSearchText] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [showProvinceModal, setShowProvinceModal] = useState<boolean>(false);
  const [showWardModal, setShowWardModal] = useState<boolean>(false);
  const [allHospitals, setAllHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // States cho filter bác sĩ
  const [doctorSearchText, setDoctorSearchText] = useState<string>('');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  // States cho time slots
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null,
  );

  // States cho patient - tự động chọn bệnh nhân đầu tiên
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(
    patient,
  );
  const [isEditingPatient, setIsEditingPatient] = useState<boolean>(false);
  const [tempPatientData, setTempPatientData] = useState<PatientInfo | null>(
    null,
  );
  const [patientErrors, setPatientErrors] = useState<Record<string, string>>(
    {},
  );

  // States cho phương thức thanh toán
  const [requestEInvoice, setRequestEInvoice] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('cash');

  // VNPay WebView states
  const [showVNPayWebView, setShowVNPayWebView] = useState(false);
  const [vnpayPaymentUrl, setVnpayPaymentUrl] = useState('');
  const [_pendingBookingId, setPendingBookingId] = useState<string>('');
  const [pendingEmailData, setPendingEmailData] =
    useState<SendAppointmentConfirmationRequest | null>(null);

  // Helper function để format time
  const formatTimeDisplay = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startHour = start.getHours().toString().padStart(2, '0');
    const startMinute = start.getMinutes().toString().padStart(2, '0');
    const endHour = end.getHours().toString().padStart(2, '0');
    const endMinute = end.getMinutes().toString().padStart(2, '0');
    return `${startHour}:${startMinute} - ${endHour}:${endMinute}`;
  };

  // Function để bắt đầu edit patient
  const handleStartEditPatient = () => {
    setTempPatientData(selectedPatient);
    setIsEditingPatient(true);
    setPatientErrors({});
  };

  // Function để cancel edit patient
  const handleCancelEditPatient = () => {
    setTempPatientData(null);
    setIsEditingPatient(false);
    setPatientErrors({});
  };

  // Function để save patient data
  const handleSavePatient = () => {
    if (!tempPatientData) return;

    // Validate form
    const errors: Record<string, string> = {};

    if (!tempPatientData?.fullName?.trim()) {
      errors.full_name = 'Họ tên không được để trống';
    }

    if (!tempPatientData?.phone?.trim()) {
      errors.phone = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(tempPatientData.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!tempPatientData?.email?.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempPatientData.email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (!tempPatientData?.address?.trim()) {
      errors.address = 'Địa chỉ không được để trống';
    }

    setPatientErrors(errors);

    if (Object.keys(errors).length === 0) {
      setSelectedPatient(tempPatientData);
      setIsEditingPatient(false);
      setTempPatientData(null);
      Alert.alert('Thành công', 'Thông tin bệnh nhân đã được cập nhật');
    }
  };

  // Function để handle input change
  const handlePatientInputChange = (field: keyof Patient, value: string) => {
    if (!tempPatientData) return;

    setTempPatientData({
      ...tempPatientData,
      [field]: value,
    });

    // Clear error when user starts typing
    if (patientErrors[field]) {
      setPatientErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Function để lấy vị trí người dùng
  const getUserLocation = () => {
    // Trong thực tế, bạn sẽ sử dụng thư viện như @react-native-community/geolocation
    // Đây là dữ liệu mẫu cho TP.HCM
    setUserLocation({
      latitude: 10.8231,
      longitude: 106.6297,
    });
  };

  // Function để tính khoảng cách giữa 2 điểm
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371; // Bán kính Trái Đất tính bằng km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Kết nối API để lấy danh sách bệnh viện
  const {
    data: hospitalsData,
    isLoading: isLoadingHospitals,
    isError: isErrorHospitals,
    error: hospitalsError,
    refetch: refetchHospitals,
  } = useGetAllHospitalsQuery();

  const { data: provinces } = useGetAllCitiesQuery();
  const { data: wards } = useGetWardsbyCityQuery(selectedProvince ?? '', {
    enabled: !!selectedProvince,
  });

  const { data: hospitalsByAddress } = useGetHospitalbyAddressQuery(
    searchText,
    {
      enabled: !!searchText,
    },
  );

  const { data: dataServices } = useGetAllServicesByDoctorIdQuery(
    selectedDoctor?.doctor_id || '',
  );

  const { data: dataTimeSlots } = useGetTimeSlotsByDoctorIdQuery(
    selectedDoctor?.doctor_id || '',
  );

  // VNPay mutation
  const { mutate: createVnpayPayment, isPending: isVnpayPending } =
    useCreateVnpayPaymentMutation({
      onSuccess: async response => {
        if (response.status === 200 && response.data?.paymentUrl) {
          setVnpayPaymentUrl(response.data.paymentUrl);
          setShowVNPayWebView(true);
        } else {
          Alert.alert('Lỗi', 'Không thể tạo URL thanh toán VNPay');
        }
      },
      onError: error => {
        console.error('Error creating VNPay payment:', error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi tạo thanh toán VNPay');
      },
    });

  // Handle VNPay payment success
  const handleVNPaySuccess = async (bookingId: string) => {
    setShowVNPayWebView(false);

    try {
      // Gửi email xác nhận sau khi thanh toán VNPay thành công
      if (pendingEmailData) {
        try {
          const emailData: SendAppointmentConfirmationRequest = {
            ...pendingEmailData,
            appointment_code: bookingId,
          };
          await SendEmailApi.sendAppointmentConfirmation(emailData);

          Alert.alert(
            'Thanh toán thành công',
            'Đặt lịch khám của bạn đã được thanh toán thành công! Thông tin đã được gửi tới email của bạn.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setPendingEmailData(null);
                  navigation.goBack();
                },
              },
            ],
          );
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          Alert.alert(
            'Thanh toán thành công',
            'Đặt lịch khám thành công nhưng có lỗi khi gửi email xác nhận.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setPendingEmailData(null);
                  navigation.goBack();
                },
              },
            ],
          );
        }
      } else {
        Alert.alert(
          'Thanh toán thành công',
          'Đặt lịch khám của bạn đã được thanh toán thành công!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      }
    } catch (error) {
      console.error('Error in handleVNPaySuccess:', error);
      Alert.alert(
        'Thanh toán thành công',
        'Đặt lịch khám đã được thanh toán nhưng xảy ra lỗi xử lý.',
        [
          {
            text: 'OK',
            onPress: () => {
              setPendingEmailData(null);
              navigation.goBack();
            },
          },
        ],
      );
    }
  };

  // Handle VNPay payment error
  const handleVNPayError = (error: string) => {
    setShowVNPayWebView(false);
    Alert.alert('Thanh toán thất bại', error);
  };

  // Handle close VNPay WebView
  const handleCloseVNPayWebView = () => {
    setShowVNPayWebView(false);
  };

  const { mutate: createBooking, isPending } = useCreateBookingMutation({
    onSuccess: async res => {
      const bookingId =
        res.appointment?.appointment_id ||
        res.order?.order_id ||
        Date.now().toString();
      setPendingBookingId(bookingId);

      // Nếu thanh toán bằng ATM/VNPay
      if (selectedPaymentMethod === 'bank') {
        try {
          // Tạo VNPay payment URL
          createVnpayPayment({
            amount: selectedService?.price || 0,
            orderId: bookingId,
          });
        } catch (error) {
          console.error('Error preparing VNPay payment:', error);
          Alert.alert('Lỗi', 'Có lỗi xảy ra khi chuẩn bị thanh toán VNPay');
        }
        return;
      }

      // Thanh toán COD - gửi email ngay
      if (pendingEmailData) {
        try {
          const emailData: SendAppointmentConfirmationRequest = {
            ...pendingEmailData,
            appointment_code: bookingId,
          };
          await SendEmailApi.sendAppointmentConfirmation(emailData);
        } catch (error) {
          console.error('Error sending email:', error);
        }
      }

      Alert.alert(
        'Đặt lịch thành công!',
        `Bạn đã đặt lịch khám với ${selectedDoctor?.full_name} tại ${
          selectedHospital?.name
        } vào ${selectedDate} lúc ${formatTimeDisplay(
          selectedTimeSlot?.start_time || '',
          selectedTimeSlot?.end_time || '',
        )}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setPendingEmailData(null);
              navigation.goBack();
            },
          },
        ],
      );
    },
    onError: (err: any) => {
      const errorMessage =
        err.response?.data?.message || err.message || 'Unknown error';
      Alert.alert(
        'Đặt lịch thất bại',
        `Lỗi: ${errorMessage}\n\nChi tiết: ${JSON.stringify(
          err.response?.data || {},
          null,
          2,
        )}`,
      );
      setPendingEmailData(null);
    },
  });

  // Update allHospitals và filteredHospitals khi nhận được data từ API
  useEffect(() => {
    if (hospitalsData?.data) {
      const hospitalsFromApi = hospitalsData.data as Hospital[];
      setAllHospitals(hospitalsFromApi);
      setFilteredHospitals(hospitalsFromApi);
    }
  }, [hospitalsData]);

  // Function để filter bệnh viện
  const filterHospitals = useCallback(() => {
    let filtered = allHospitals;
    // Filter theo tên bệnh viện
    if (searchText.trim() && hospitalsByAddress?.data) {
      filtered = hospitalsByAddress?.data || [];
    }

    // Filter theo tỉnh thành
    if (selectedProvince) {
      filtered = filtered.filter(
        hospital => hospital.city === selectedProvince,
      );
    }

    // Filter theo xã phường
    if (selectedWard) {
      filtered = filtered.filter(hospital => hospital.ward === selectedWard);
    }

    setFilteredHospitals(filtered);
  }, [
    allHospitals,
    searchText,
    selectedProvince,
    selectedWard,
    hospitalsByAddress,
  ]);

  // Function để tìm bệnh viện gần nhất
  const findNearbyHospitals = () => {
    if (!userLocation) {
      Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại của bạn');
      return;
    }

    const hospitalsWithDistance = allHospitals.map(hospital => ({
      ...hospital,
      distance:
        hospital.latitude && hospital.longitude
          ? calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              hospital.latitude,
              hospital.longitude,
            )
          : Infinity,
    }));

    const sortedHospitals = hospitalsWithDistance
      .filter(hospital => hospital.distance !== Infinity)
      .sort((a, b) => a.distance - b.distance);

    setFilteredHospitals(sortedHospitals);
    setSearchText('');
    setSelectedProvince(null);
    setSelectedWard(null);
  };

  // Function để filter bác sĩ
  const filterDoctors = useCallback(() => {
    let filtered = selectedHospital?.Doctors || [];

    // Filter theo bệnh viện đã chọn
    if (selectedHospital) {
      filtered = filtered.filter(
        doctor => doctor.hospital_id === selectedHospital.hospital_id,
      );
    }

    // Filter theo tên bác sĩ
    if (doctorSearchText.trim()) {
      filtered = filtered.filter(
        doctor =>
          doctor.full_name
            .toLowerCase()
            .includes(doctorSearchText.toLowerCase()) ||
          SpecialtyLabel[
            doctor.specialty as unknown as keyof typeof SpecialtyLabel
          ]
            ?.toLowerCase()
            .includes(doctorSearchText.toLowerCase()),
      );
    }

    setFilteredDoctors(filtered as Doctor[]);
  }, [selectedHospital, doctorSearchText]);

  // Effect để filter khi có thay đổi
  useEffect(() => {
    filterHospitals();
  }, [filterHospitals]);

  // Function để filter time slots theo ngày và bác sĩ
  const filterTimeSlots = useCallback(() => {
    if (!selectedDoctor || !selectedDate) {
      setAvailableTimeSlots([]);
      return;
    }

    // Parse selected date (format: DD/MM/YYYY)
    const [day, month, year] = selectedDate.split('/');
    const selectedDateObj = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
    );

    // Filter time slots theo doctor_id và ngày
    const filtered = dataTimeSlots?.data?.filter(slot => {
      const slotDate = new Date(slot.start_time);

      const isSameDate =
        slotDate.getDate() === selectedDateObj.getDate() &&
        slotDate.getMonth() === selectedDateObj.getMonth() &&
        slotDate.getFullYear() === selectedDateObj.getFullYear();

      const isAvailable = !slot.appointment_id; // Chưa có appointment

      return isSameDate && isAvailable;
    });

    // Sort theo thời gian
    filtered?.sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );

    setAvailableTimeSlots(filtered || []);
  }, [selectedDoctor, selectedDate, dataTimeSlots]);
  // Effect để filter bác sĩ khi có thay đổi
  useEffect(() => {
    filterDoctors();
  }, [filterDoctors]);

  // Effect để filter time slots khi có thay đổi
  useEffect(() => {
    filterTimeSlots();
  }, [filterTimeSlots]);

  const handleBack = () => {
    if (currentStep === 'hospital') {
      navigation.goBack();
    } else if (currentStep === 'doctor') {
      setCurrentStep('hospital');
    } else if (currentStep === 'service') {
      setCurrentStep('doctor');
    } else if (currentStep === 'schedule') {
      setCurrentStep('service');
    } else if (currentStep === 'patient') {
      setCurrentStep('schedule');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('patient');
    }
  };

  const handleNext = () => {
    if (currentStep === 'hospital' && selectedHospital) {
      setCurrentStep('doctor');
      // Reset doctor search khi chuyển sang step doctor
      setDoctorSearchText('');
    } else if (currentStep === 'doctor' && selectedDoctor) {
      setCurrentStep('service');
    } else if (currentStep === 'service' && selectedService) {
      setCurrentStep('schedule');
      // Reset time slot khi chuyển sang step schedule
      setSelectedTimeSlot(null);
    } else if (currentStep === 'schedule' && selectedDate && selectedTimeSlot) {
      setCurrentStep('patient');
    } else if (currentStep === 'patient') {
      setCurrentStep('confirmation');
    }
  };

  const handleBookAppointment = async () => {
    // Validate dữ liệu trước khi gửi
    if (!selectedPatient?.patientId) {
      Alert.alert('Lỗi', 'Vui lòng chọn bệnh nhân');
      return;
    }
    if (!selectedDoctor?.doctor_id) {
      Alert.alert('Lỗi', 'Vui lòng chọn bác sĩ');
      return;
    }
    if (!selectedHospital?.hospital_id) {
      Alert.alert('Lỗi', 'Vui lòng chọn bệnh viện');
      return;
    }
    if (!selectedTimeSlot?.slot_id) {
      Alert.alert('Lỗi', 'Vui lòng chọn giờ khám');
      return;
    }
    if (!selectedService) {
      Alert.alert('Lỗi', 'Vui lòng chọn dịch vụ khám');
      return;
    }
    if (!userId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      return;
    }

    // Tạo order_items từ service đã chọn
    const orderItems = [
      {
        service_id: selectedService.service_id,
        item_name: selectedService.name,
        quantity: 1,
        price: selectedService.price,
      },
    ];

    const request: BookingRequest = {
      patient_id: selectedPatient.patientId,
      doctor_id: selectedDoctor.doctor_id,
      hospital_id: selectedHospital.hospital_id,
      slot_ids: [selectedTimeSlot.slot_id],
      book_user_id: userId,
      notes: '',
      order_items: orderItems,
      payment_status: selectedPaymentMethod === 'cash' ? 'PENDING' : 'PAID',
      service_name: selectedService.name,
    };

    // Lưu email data để gửi sau
    const emailData: SendAppointmentConfirmationRequest = {
      to_email: selectedPatient.email || '',
      patient_name: selectedPatient.fullName || '',
      doctor_name: selectedDoctor.full_name,
      appointment_time: formatTimeDisplay(
        selectedTimeSlot.start_time || '',
        selectedTimeSlot.end_time || '',
      ),
      appointment_date: selectedDate,
      order_items: orderItems,
      appointment_code: '', // Sẽ được cập nhật trong onSuccess
    };

    setPendingEmailData(emailData);

    // Gọi mutation
    createBooking(request);
  };

  const renderStepIndicator = () => {
    const steps = [
      'Bệnh viện',
      'Bác sĩ',
      'Dịch vụ',
      'Lịch',
      'Thông tin',
      'Xác nhận',
    ];
    const currentStepIndex = steps.findIndex(
      step =>
        (currentStep === 'hospital' && step === 'Bệnh viện') ||
        (currentStep === 'doctor' && step === 'Bác sĩ') ||
        (currentStep === 'service' && step === 'Dịch vụ') ||
        (currentStep === 'schedule' && step === 'Lịch') ||
        (currentStep === 'patient' && step === 'Thông tin') ||
        (currentStep === 'confirmation' && step === 'Xác nhận'),
    );

    return (
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                index <= currentStepIndex && styles.stepCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  index <= currentStepIndex && styles.stepNumberActive,
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={[
                styles.stepText,
                index <= currentStepIndex && styles.stepTextActive,
              ]}
            >
              {step}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderHospitalSelection = () => (
    <View style={styles.content}>
      <Text style={styles.title}>Chọn bệnh viện</Text>

      {/* Search và Filter Section */}
      <View style={styles.searchFilterContainer}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={Colors.textGray}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm bệnh viện theo tên hoặc địa chỉ..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={Colors.textGray}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={Colors.textGray} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterButtonsContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowProvinceModal(true)}
          >
            <Ionicons
              name="location-outline"
              size={16}
              color={Colors.primaryBlue}
            />
            <Text style={styles.filterButtonText}>
              {selectedProvince ? selectedProvince : 'Tỉnh thành'}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={Colors.primaryBlue}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowWardModal(true)}
            disabled={!selectedProvince}
          >
            <Ionicons
              name="business-outline"
              size={16}
              color={selectedProvince ? Colors.primaryBlue : Colors.textGray}
            />
            <Text
              style={[
                styles.filterButtonText,
                !selectedProvince && styles.disabledText,
              ]}
            >
              {selectedWard ? selectedWard : 'Xã phường'}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={selectedProvince ? Colors.primaryBlue : Colors.textGray}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nearbyButton}
            onPress={() => {
              getUserLocation();
              findNearbyHospitals();
            }}
          >
            <Ionicons name="navigate-outline" size={16} color="#FFFFFF" />
            <Text style={styles.nearbyButtonText}>Gần tôi</Text>
          </TouchableOpacity>
        </View>

        {/* Clear Filters */}
        {(selectedProvince || selectedWard || searchText) && (
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => {
              setSearchText('');
              setSelectedProvince(null);
              setSelectedWard(null);
              setFilteredHospitals(allHospitals as Hospital[]);
            }}
          >
            <Ionicons
              name="refresh-outline"
              size={16}
              color={Colors.primaryBlue}
            />
            <Text style={styles.clearFiltersText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Hospital List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredHospitals.length > 0 ? (
          filteredHospitals.map(hospital => (
            <TouchableOpacity
              key={hospital.hospital_id}
              style={[
                styles.hospitalCard,
                selectedHospital?.hospital_id === hospital.hospital_id &&
                  styles.selectedCard,
              ]}
              onPress={() => setSelectedHospital(hospital)}
            >
              <View style={styles.hospitalInfo}>
                <Text style={styles.hospitalName}>{hospital.name}</Text>
                <View style={styles.flexRow}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={Colors.textGray}
                  />
                  <Text style={styles.hospitalAddress}>
                    {hospital.address}, {hospital.ward}, {hospital.city}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Ionicons
                    name="call-outline"
                    size={14}
                    color={Colors.textGray}
                  />
                  <Text style={styles.hospitalAddress}>{hospital.phone}</Text>
                </View>
                {/* Hiển thị khoảng cách nếu có */}
                {(hospital as any).distance && (
                  <View style={styles.flexRow}>
                    <Ionicons
                      name="navigate-outline"
                      size={14}
                      color={Colors.primaryBlue}
                    />
                    <Text style={styles.distanceText}>
                      {(hospital as any).distance.toFixed(1)} km
                    </Text>
                  </View>
                )}
              </View>
              {selectedHospital?.hospital_id === hospital.hospital_id && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={Colors.primaryBlue}
                />
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color={Colors.textGray} />
            <Text style={styles.noResultsText}>
              Không tìm thấy bệnh viện nào
            </Text>
            <Text style={styles.noResultsSubtext}>
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  const renderDoctorSelection = () => (
    <View style={styles.content}>
      <Text style={styles.title}>Chọn bác sĩ</Text>
      <Text style={styles.subtitle}>{selectedHospital?.name}</Text>

      {/* Search Input cho bác sĩ */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={Colors.textGray}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bác sĩ theo tên hoặc chuyên khoa..."
          value={doctorSearchText}
          onChangeText={setDoctorSearchText}
          placeholderTextColor={Colors.textGray}
        />
        {doctorSearchText.length > 0 && (
          <TouchableOpacity
            onPress={() => setDoctorSearchText('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color={Colors.textGray} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor: Doctor) => (
            <TouchableOpacity
              key={doctor.doctor_id}
              style={[
                styles.doctorCard,
                selectedDoctor?.doctor_id === doctor.doctor_id &&
                  styles.selectedCard,
              ]}
              onPress={() => setSelectedDoctor(doctor)}
            >
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.full_name}</Text>
                <Text style={styles.doctorSpecialty}>
                  {SpecialtyLabel?.[
                    doctor.specialty as unknown as keyof typeof SpecialtyLabel
                  ] ?? 'Chuyên khoa khác'}
                </Text>
                <View style={styles.doctorDetails}>
                  <Ionicons
                    name="call-outline"
                    size={14}
                    color={Colors.primaryBlue}
                  />
                  <Text style={styles.phoneNumber}>{doctor.phone}</Text>
                </View>
              </View>
              {selectedDoctor?.doctor_id === doctor.doctor_id && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={Colors.primaryBlue}
                />
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color={Colors.textGray} />
            <Text style={styles.noResultsText}>Không tìm thấy bác sĩ nào</Text>
            <Text style={styles.noResultsSubtext}>
              Thử thay đổi từ khóa tìm kiếm
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  const renderServiceSelection = () => (
    <View style={styles.content}>
      <Text style={styles.title}>Chọn dịch vụ khám</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {dataServices?.data?.length && dataServices?.data?.length > 0 ? (
          <>
            {dataServices?.data?.map((service, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.serviceCard,
                  selectedService?.service_id === service.service_id &&
                    styles.selectedCard,
                ]}
                onPress={() => setSelectedService(service)}
              >
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.servicePrice}>
                    {service.price.toLocaleString('vi-VN')} VNĐ -{' '}
                    {service.duration} phút
                  </Text>
                </View>
                {selectedService?.service_id === service.service_id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={Colors.primaryBlue}
                  />
                )}
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color={Colors.textGray} />
            <Text style={styles.noResultsText}>
              Không tìm thấy dịch vụ khám nào
            </Text>
            <Text style={styles.noResultsSubtext}>Thử thay đổi bác sĩ</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  const renderScheduleSelection = () => {
    // Tạo danh sách ngày từ hôm nay
    const generateDates = () => {
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push({
          date: date,
          dateString: date.toLocaleDateString('vi-VN'),
          isToday: i === 0,
        });
      }
      return dates;
    };

    const dates = generateDates();
    // Format time từ time slot
    const formatTimeSlot = (startTime: string, endTime: string) => {
      return formatTimeDisplay(startTime, endTime);
    };

    return (
      <View style={styles.content}>
        <Text style={styles.title}>Chọn lịch khám</Text>

        {/* Date Selection */}
        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Chọn ngày</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dates.map((dateInfo, index) => {
              const isSelected = selectedDate === dateInfo.dateString;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    isSelected && styles.selectedDateCard,
                  ]}
                  onPress={() => setSelectedDate(dateInfo.dateString)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      isSelected && styles.selectedDateText,
                    ]}
                  >
                    {dateInfo.date.toLocaleDateString('vi-VN', {
                      weekday: 'short',
                    })}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      isSelected && styles.selectedDateNumber,
                    ]}
                  >
                    {dateInfo.date.getDate()}/{dateInfo.date.getMonth() + 1}
                  </Text>
                  {dateInfo.isToday && (
                    <Text style={styles.todayLabel}>Hôm nay</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>
            Chọn giờ {selectedDate && `- ${selectedDate}`}
          </Text>
          {availableTimeSlots.length > 0 ? (
            <View style={styles.timeGrid}>
              {availableTimeSlots.map(slot => {
                const isSelected = selectedTimeSlot?.slot_id === slot.slot_id;
                const timeDisplay = formatTimeSlot(
                  slot.start_time,
                  slot.end_time,
                );

                return (
                  <TouchableOpacity
                    key={slot.slot_id}
                    style={[
                      styles.timeSlot,
                      isSelected && styles.selectedTimeSlot,
                    ]}
                    onPress={() => setSelectedTimeSlot(slot)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        isSelected && styles.selectedTimeText,
                      ]}
                    >
                      {timeDisplay}
                    </Text>
                    <Text style={styles.capacityText}>
                      Còn {slot.capacity} chỗ
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.noTimeSlotsContainer}>
              <Ionicons name="time-outline" size={48} color={Colors.textGray} />
              <Text style={styles.noTimeSlotsText}>
                {!selectedDate
                  ? 'Vui lòng chọn ngày'
                  : !selectedDoctor
                  ? 'Vui lòng chọn bác sĩ'
                  : 'Không có lịch trống trong ngày này'}
              </Text>
              <Text style={styles.noTimeSlotsSubtext}>
                Thử chọn ngày khác hoặc bác sĩ khác
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderPatientSelection = () => {
    // Format ngày sinh
    const formatDateOfBirth = (dob: string) => {
      const date = new Date(dob);
      return date.toLocaleDateString('vi-VN');
    };

    // Format giới tính
    const formatGender = (gender: 'male' | 'female') => {
      return gender === 'male' ? 'Nam' : 'Nữ';
    };

    const currentPatient = isEditingPatient ? tempPatientData : selectedPatient;

    return (
      <View style={styles.content}>
        <View style={styles.patientHeader}>
          <View>
            <Text style={styles.title}>Thông tin bệnh nhân</Text>
            <Text style={styles.subtitle}>
              Thông tin bệnh nhân cho cuộc hẹn
            </Text>
          </View>
          {!isEditingPatient && (
            <TouchableOpacity
              style={styles.editPatientButton}
              onPress={handleStartEditPatient}
            >
              <Ionicons
                name="create-outline"
                size={16}
                color={Colors.primaryBlue}
              />
              <Text style={styles.editPatientButtonText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hiển thị thông tin chi tiết của bệnh nhân */}
          <View style={styles.selectedPatientDetailContainer}>
            <View style={styles.selectedPatientDetailHeader}>
              <Ionicons
                name="person-circle"
                size={24}
                color={Colors.primaryBlue}
              />
              <Text style={styles.selectedPatientDetailTitle}>
                Thông tin người đặt
              </Text>
            </View>

            <View style={styles.selectedPatientDetailContent}>
              {/* Họ và tên */}
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color={Colors.primaryBlue}
                  />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Họ và tên *</Text>
                  {isEditingPatient ? (
                    <TextInput
                      style={[
                        styles.detailInput,
                        patientErrors.full_name && styles.errorInput,
                      ]}
                      value={currentPatient?.fullName || ''}
                      onChangeText={text =>
                        handlePatientInputChange('full_name', text)
                      }
                      placeholder="Nhập họ và tên"
                      placeholderTextColor={Colors.textGray}
                    />
                  ) : (
                    <Text style={styles.detailValue}>
                      {currentPatient?.fullName || ''}
                    </Text>
                  )}
                  {patientErrors.full_name && (
                    <Text style={styles.errorText}>
                      {patientErrors.full_name}
                    </Text>
                  )}
                </View>
              </View>

              {/* Giới tính */}
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Ionicons
                    name="people-outline"
                    size={16}
                    color={Colors.primaryBlue}
                  />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Giới tính</Text>
                  <Text style={styles.detailValue}>
                    {currentPatient
                      ? formatGender(currentPatient.gender as 'male' | 'female')
                      : ''}
                  </Text>
                </View>
              </View>

              {/* Ngày sinh */}
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={Colors.primaryBlue}
                  />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Ngày sinh</Text>
                  <Text style={styles.detailValue}>
                    {currentPatient
                      ? formatDateOfBirth(currentPatient.dob || '')
                      : ''}
                  </Text>
                </View>
              </View>

              {/* Số điện thoại */}
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Ionicons
                    name="call-outline"
                    size={16}
                    color={Colors.primaryBlue}
                  />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Số điện thoại *</Text>
                  {isEditingPatient ? (
                    <TextInput
                      style={[
                        styles.detailInput,
                        patientErrors.phone && styles.errorInput,
                      ]}
                      value={currentPatient?.phone || ''}
                      onChangeText={text =>
                        handlePatientInputChange('phone', text)
                      }
                      placeholder="Nhập số điện thoại"
                      placeholderTextColor={Colors.textGray}
                      keyboardType="phone-pad"
                    />
                  ) : (
                    <Text style={styles.detailValue}>
                      {currentPatient?.phone || ''}
                    </Text>
                  )}
                  {patientErrors.phone && (
                    <Text style={styles.errorText}>{patientErrors.phone}</Text>
                  )}
                </View>
              </View>

              {/* Email */}
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color={Colors.primaryBlue}
                  />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Email *</Text>
                  {isEditingPatient ? (
                    <TextInput
                      style={[
                        styles.detailInput,
                        patientErrors.email && styles.errorInput,
                      ]}
                      value={currentPatient?.email || ''}
                      onChangeText={text =>
                        handlePatientInputChange('email', text)
                      }
                      placeholder="Nhập email"
                      placeholderTextColor={Colors.textGray}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  ) : (
                    <Text style={styles.detailValue}>
                      {currentPatient?.email || ''}
                    </Text>
                  )}
                  {patientErrors.email && (
                    <Text style={styles.errorText}>{patientErrors.email}</Text>
                  )}
                </View>
              </View>

              {/* Địa chỉ */}
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={Colors.primaryBlue}
                  />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Địa chỉ *</Text>
                  {isEditingPatient ? (
                    <TextInput
                      style={[
                        styles.detailInput,
                        styles.multilineInput,
                        patientErrors.address && styles.errorInput,
                      ]}
                      value={currentPatient?.address || ''}
                      onChangeText={text =>
                        handlePatientInputChange('address', text)
                      }
                      placeholder="Nhập địa chỉ"
                      placeholderTextColor={Colors.textGray}
                      multiline
                      numberOfLines={3}
                    />
                  ) : (
                    <Text style={styles.detailValue}>
                      {currentPatient?.address || ''}
                    </Text>
                  )}
                  {patientErrors.address && (
                    <Text style={styles.errorText}>
                      {patientErrors.address}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons khi đang edit */}
          {isEditingPatient && (
            <View style={styles.patientActionContainer}>
              <TouchableOpacity
                style={styles.patientCancelButton}
                onPress={handleCancelEditPatient}
              >
                <Text style={styles.patientCancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.patientSaveButton}
                onPress={handleSavePatient}
              >
                <Text style={styles.patientSaveButtonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderConfirmation = () => {
    const summaryItems = [
      { label: 'Bệnh viện', value: selectedHospital?.name || '' },
      { label: 'Bác sĩ', value: selectedDoctor?.full_name || '' },
      { label: 'Dịch vụ', value: selectedService?.name || '' },
      { label: 'Ngày', value: selectedDate },
      {
        label: 'Giờ',
        value: selectedTimeSlot
          ? formatTimeDisplay(
              selectedTimeSlot.start_time,
              selectedTimeSlot.end_time,
            )
          : 'Chưa chọn giờ',
      },
      { label: 'Bệnh nhân', value: selectedPatient?.fullName || '' },
      { label: 'Số điện thoại', value: selectedPatient?.phone || '' },
      { label: 'Phí khám', value: selectedService?.price || 0 },
      {
        label: 'Phương thức thanh toán',
        value:
          selectedPaymentMethod === 'cash'
            ? 'Thanh toán tiền mặt khi nhận hàng'
            : 'Thanh toán bằng thẻ ATM nội địa và tài khoản ngân hàng',
      },
      {
        label: 'Xuất hóa đơn điện tử',
        value: requestEInvoice ? 'Có' : 'Không',
      },
    ];

    return (
      <View style={styles.content}>
        <Text style={styles.title}>Xác nhận đặt lịch</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.confirmationScrollView}
        >
          <BookingSummaryComponent items={summaryItems} colors={Colors} />

          <PaymentConfirmationComponent
            requestEInvoice={requestEInvoice}
            selectedPaymentMethod={selectedPaymentMethod}
            onToggleEInvoice={() => setRequestEInvoice(!requestEInvoice)}
            onSelectPaymentMethod={setSelectedPaymentMethod}
            colors={Colors}
          />
        </ScrollView>
      </View>
    );
  };

  // Modal chọn tỉnh thành
  const renderProvinceModal = () => (
    <Modal
      visible={showProvinceModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowProvinceModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chọn tỉnh thành</Text>
            <TouchableOpacity onPress={() => setShowProvinceModal(false)}>
              <Ionicons name="close" size={24} color={Colors.textGray} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {provinces?.data?.map((province, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalItem,
                  selectedProvince === province && styles.selectedModalItem,
                ]}
                onPress={() => {
                  setSelectedProvince(province);
                  setSelectedWard(null); // Reset ward khi chọn province mới
                  setShowProvinceModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    selectedProvince === province &&
                      styles.selectedModalItemText,
                  ]}
                >
                  {province}
                </Text>
                {selectedProvince === province && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={Colors.primaryBlue}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Modal chọn xã phường
  const renderWardModal = () => (
    <Modal
      visible={showWardModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowWardModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chọn xã phường</Text>
            <TouchableOpacity onPress={() => setShowWardModal(false)}>
              <Ionicons name="close" size={24} color={Colors.textGray} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {selectedProvince &&
              wards?.data?.map((ward, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalItem,
                    selectedWard === ward && styles.selectedModalItem,
                  ]}
                  onPress={() => {
                    setSelectedWard(ward);
                    setShowWardModal(false);
                  }}
                >
                  <View>
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedWard === ward && styles.selectedModalItemText,
                      ]}
                    >
                      {ward}
                    </Text>
                    <Text style={styles.modalItemSubtext}>{ward}</Text>
                  </View>
                  {selectedWard === ward && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={Colors.primaryBlue}
                    />
                  )}
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 'hospital':
        return renderHospitalSelection();
      case 'doctor':
        return renderDoctorSelection();
      case 'service':
        return renderServiceSelection();
      case 'schedule':
        return renderScheduleSelection();
      case 'patient':
        return renderPatientSelection();
      case 'confirmation':
        return renderConfirmation();
      default:
        return renderHospitalSelection();
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 'hospital':
        return !selectedHospital;
      case 'doctor':
        return !selectedDoctor;
      case 'service':
        return !selectedService;
      case 'patient':
        return false; // Không cần chọn bệnh nhân nữa vì đã có mặc định
      case 'schedule':
        return !selectedDate || !selectedTimeSlot;

      default:
        return true;
    }
  };

  // Render loading state
  if (isLoadingHospitals) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
          <Text style={styles.loadingText}>Đang tải dữ liệu bệnh viện...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (isErrorHospitals) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={64} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Lỗi tải dữ liệu</Text>
          <Text style={styles.errorMessage}>
            {hospitalsError?.message ||
              'Không thể tải danh sách bệnh viện. Vui lòng thử lại sau.'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetchHospitals()}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show VNPay WebView if needed
  if (showVNPayWebView) {
    return (
      <VNPayWebView
        paymentUrl={vnpayPaymentUrl}
        onPaymentSuccess={handleVNPaySuccess}
        onPaymentError={handleVNPayError}
        onClose={handleCloseVNPayWebView}
        colors={Colors}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryBlue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt lịch khám</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Content */}
      {renderContent()}

      {/* Modals */}
      {renderProvinceModal()}
      {renderWardModal()}

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        {currentStep === 'confirmation' ? (
          <TouchableOpacity
            style={[
              styles.bookButton,
              (isPending || isVnpayPending) && styles.nextButtonDisabled,
            ]}
            onPress={handleBookAppointment}
            disabled={isPending || isVnpayPending}
          >
            <Text style={styles.bookButtonText}>
              {isPending || isVnpayPending
                ? 'Đang xử lý...'
                : selectedPaymentMethod === 'bank'
                ? 'Thanh toán VNPay'
                : 'Đặt lịch ngay'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.nextButton,
              isNextDisabled() && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={isNextDisabled()}
          >
            <Text
              style={[
                styles.nextButtonText,
                isNextDisabled() && styles.nextButtonTextDisabled,
              ]}
            >
              Tiếp theo
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryBlue,
  },
  placeholder: {
    width: 34,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F8F9FA',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  stepCircleActive: {
    backgroundColor: Colors.primaryBlue,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  stepTextActive: {
    color: Colors.primaryBlue,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  hospitalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.lightBlue,
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#666',
  },
  //   ratingContainer: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //   },
  //   rating: {
  //     fontSize: 14,
  //     color: '#666',
  //     marginLeft: 4,
  //   },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: Colors.primaryBlue,
    marginBottom: 3,
  },

  doctorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    gap: 5,
  },
  phoneNumber: {
    fontSize: 14,
    color: Colors.primaryBlue,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryBlue,
  },
  dateSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  dateCard: {
    alignItems: 'center',
    padding: 15,
    marginRight: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 70,
  },
  selectedDateCard: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.lightBlue,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  selectedDateText: {
    color: Colors.primaryBlue,
    fontWeight: '600',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectedDateNumber: {
    color: Colors.primaryBlue,
  },
  timeSection: {
    marginBottom: 20,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 5,
  },
  timeSlot: {
    width: (width - 60) / 3,
    padding: 12,
    marginBottom: 5,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeSlotDisabled: {
    backgroundColor: '#E5E5E5',
  },
  selectedTimeSlot: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.lightBlue,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeTextDisabled: {
    color: '#999',
  },
  selectedTimeText: {
    color: Colors.primaryBlue,
  },
  confirmationCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
  },
  confirmationScrollView: {
    flex: 1,
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  confirmationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  confirmationLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  confirmationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  nextButton: {
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nextButtonTextDisabled: {
    color: '#999',
  },
  bookButton: {
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Search và Filter Styles
  searchFilterContainer: {
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textDark,
  },
  clearButton: {
    padding: 5,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    gap: 8,
  },
  filterButtonText: {
    fontSize: 12,
    color: Colors.primaryBlue,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  disabledText: {
    color: Colors.textGray,
  },
  nearbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1250DC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    gap: 8,
  },
  nearbyButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightBlue,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    color: Colors.primaryBlue,
    fontWeight: '500',
  },
  distanceText: {
    fontSize: 14,
    color: Colors.primaryBlue,
    fontWeight: '500',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textGray,
    marginTop: 15,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: Colors.textGray,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
  },
  modalContent: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedModalItem: {
    backgroundColor: Colors.lightBlue,
  },
  modalItemText: {
    fontSize: 16,
    color: Colors.textDark,
    flex: 1,
  },
  selectedModalItemText: {
    color: Colors.primaryBlue,
    fontWeight: '600',
  },
  modalItemSubtext: {
    fontSize: 14,
    color: Colors.textGray,
    marginTop: 2,
  },
  // Time Slot Styles
  todayLabel: {
    fontSize: 10,
    color: Colors.primaryBlue,
    fontWeight: '600',
    marginTop: 2,
  },
  capacityText: {
    fontSize: 12,
    color: Colors.textGray,
    marginTop: 2,
  },
  noTimeSlotsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noTimeSlotsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textGray,
    marginTop: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  noTimeSlotsSubtext: {
    fontSize: 14,
    color: Colors.textGray,
    textAlign: 'center',
  },
  // Patient Styles
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  patientInfo: {
    flex: 1,
  },
  patientInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  // Patient Edit Button Styles
  editPatientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightBlue,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 5,
  },
  editPatientButtonText: {
    fontSize: 14,
    color: Colors.primaryBlue,
    fontWeight: '500',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  patientGender: {
    fontSize: 14,
    color: Colors.primaryBlue,
    fontWeight: '500',
  },
  patientDetails: {
    gap: 4,
  },
  patientDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  // Selected Patient Detail Styles
  selectedPatientDetailContainer: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
  },
  selectedPatientDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  selectedPatientDetailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryBlue,
  },
  selectedPatientDetailContent: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textGray,
    marginBottom: 2,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '600',
    lineHeight: 20,
  },
  // Patient Edit Styles
  detailInput: {
    fontSize: 14,
    color: Colors.textDark,
    backgroundColor: Colors.backgroundWhite,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginTop: 2,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: '#DC3545',
  },
  errorText: {
    fontSize: 12,
    color: '#DC3545',
    marginTop: 4,
  },
  patientActionContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  patientCancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  patientCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textGray,
  },
  patientSaveButton: {
    flex: 1,
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  patientSaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.backgroundWhite,
  },
  // Payment Method Styles
  paymentMethodCard: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
  },
  paymentMethodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryBlue,
    marginBottom: 15,
  },
  invoiceSection: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primaryBlue,
  },
  checkboxLabel: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '500',
    flex: 1,
  },
  paymentMethodsSection: {
    gap: 12,
  },
  paymentMethodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 10,
  },
  paymentMethodOption: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodSelected: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.lightBlue,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 4,
  },
  paymentMethodNameSelected: {
    color: Colors.primaryBlue,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: Colors.textGray,
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: Colors.textGray,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookAppointmentScreen;
