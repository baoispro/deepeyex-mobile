import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../../../shared/stores';
import { useCart } from '../../../shared/hooks/useCart';
import {
  AddressApi,
  Province,
  District,
  Ward,
} from '../apis/address/addressApi';
import { calculateShippingFee } from '../configs/shippingConfig';
import { useCreateOrderMutation } from '../hooks/mutations/orders/use-order-drug.mutation';
import { useCreateVnpayPaymentMutation } from '../hooks/mutations/vnpay/use-vnpay-payment.mutation';
import { useSelector } from 'react-redux';
import {
  SendOrderConfirmationRequest,
  SendEmailApi,
} from '../apis/sendmail/sendMailApi';

// Import components
import ReceiverInfoComponent from '../components/ReceiverInfoComponent';
import DeliveryAddressComponent from '../components/DeliveryAddressComponent';
import PaymentMethodsComponent from '../components/PaymentMethodsComponent';
import OrderSummaryComponent from '../components/OrderSummaryComponent';
import VNPayWebView from '../components/VNPayWebView';
import { OrderApi } from '../apis/order/orderApi';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { items, totalAmount, clearCart } = useCart();
  const { patient, userId } = useSelector((state: RootState) => state.auth);

  // Form state
  const [fullName, setFullName] = useState(patient?.fullName || '');
  const [phone, setPhone] = useState(patient?.phone || '');
  const [email, setEmail] = useState(patient?.email || '');
  const [specificAddress, setSpecificAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Address state
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null,
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null,
  );
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  // Modal state
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showWardModal, setShowWardModal] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  // Shipping fee
  const [shippingFee, setShippingFee] = useState(0);

  // Email data for sending after successful order
  const [pendingEmailData, setPendingEmailData] =
    useState<SendOrderConfirmationRequest | null>(null);

  // VNPay WebView state
  const [showVNPayWebView, setShowVNPayWebView] = useState(false);
  const [vnpayPaymentUrl, setVnpayPaymentUrl] = useState('');

  const Colors = {
    primaryBlue: '#3366FF',
    lightBlue: '#E6EEFF',
    backgroundWhite: '#fff',
    textDark: '#1E1E1E',
    textGray: '#5C5C5C',
  };

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await AddressApi.getAllProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Error loading provinces:', error);
        Alert.alert('Lỗi', 'Không thể tải danh sách tỉnh/thành phố');
      } finally {
        setIsLoadingAddress(false);
      }
    };
    loadProvinces();
  }, []);

  // Calculate shipping fee when province changes
  useEffect(() => {
    if (selectedProvince) {
      const fee = calculateShippingFee(selectedProvince.name, totalAmount);
      setShippingFee(fee);
    }
  }, [selectedProvince, totalAmount]);

  // Handle province selection
  const handleSelectProvince = async (province: Province) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts(province.districts || []);
    setWards([]);
    setShowProvinceModal(false);
  };

  // Handle district selection
  const handleSelectDistrict = async (district: District) => {
    setSelectedDistrict(district);
    setSelectedWard(null);
    setShowDistrictModal(false);

    // Load wards for selected district
    try {
      const districtDetail = await AddressApi.getDistrictDetail(district.code);
      setWards(districtDetail.wards || []);
    } catch (error) {
      console.error('Error loading wards:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách phường/xã');
    }
  };

  // Handle ward selection
  const handleSelectWard = (ward: Ward) => {
    setSelectedWard(ward);
    setShowWardModal(false);
  };

  // VNPay mutation
  const { mutate: createVnpayPayment, isPending: isVnpayPending } =
    useCreateVnpayPaymentMutation({
      onSuccess: async response => {
        if (response.status === 200 && response.data?.paymentUrl) {
          // Open VNPay payment URL in WebView
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

  // Handle VNPay payment
  const handleVnpayPayment = async (orderId: string) => {
    try {
      createVnpayPayment({
        amount: totalAmount + shippingFee,
        orderId: orderId,
      });
    } catch (error) {
      console.error('Error preparing VNPay payment:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi chuẩn bị thanh toán VNPay');
    }
  };

  // Handle VNPay payment success - Logic giống Next.js
  const handleVNPaySuccess = async (orderId: string) => {
    setShowVNPayWebView(false);
    setIsLoading(true);

    try {
      // 2️⃣ Cập nhật trạng thái đơn hàng thành "PAID"
      try {
        await OrderApi.updateOrderStatus(orderId, 'PAID');
        console.log('✅ Order status updated to PAID');
      } catch (updateError) {
        console.error('Error updating order status:', updateError);
        // Không alert ở đây, chỉ log — vẫn cho phép tiếp tục gửi email
      }

      // 3️⃣ Gửi email xác nhận đơn hàng
      const pendingData = pendingEmailData;
      if (pendingData && orderId) {
        try {
          const emailData: SendOrderConfirmationRequest = {
            ...pendingData,
            order_code: orderId,
          };

          await SendEmailApi.sendOrderConfirmation(emailData);

          Alert.alert(
            'Thanh toán thành công',
            'Đơn hàng của bạn đã được thanh toán và xác nhận. Hóa đơn đã gửi tới email của bạn.',
            [
              {
                text: 'OK',
                onPress: () => {
                  clearCart();
                  setPendingEmailData(null);
                  navigation.navigate('Home' as never);
                },
              },
            ],
          );
        } catch (emailError) {
          console.error('❌ Error sending email:', emailError);
          Alert.alert(
            'Thanh toán thành công',
            'Thanh toán thành công nhưng có lỗi khi gửi hóa đơn qua email.',
            [
              {
                text: 'OK',
                onPress: () => {
                  clearCart();
                  setPendingEmailData(null);
                  navigation.navigate('Home' as never);
                },
              },
            ],
          );
        }
      } else {
        // 4️⃣ Nếu không có pendingEmailData thì chỉ thông báo thanh toán thành công
        Alert.alert(
          'Thanh toán thành công',
          'Đơn hàng của bạn đã được thanh toán thành công!',
          [
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                setPendingEmailData(null);
                navigation.navigate('Home' as never);
              },
            },
          ],
        );
      }
    } catch (error) {
      console.error('🔥 Error in handleVNPaySuccess:', error);
      Alert.alert(
        'Thanh toán thành công',
        'Đơn hàng đã được thanh toán nhưng xảy ra lỗi xử lý hậu kỳ.',
        [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              setPendingEmailData(null);
              navigation.navigate('Home' as never);
            },
          },
        ],
      );
    } finally {
      setIsLoading(false);
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

  const { mutate: createOrder, isPending: isOrderPending } =
    useCreateOrderMutation({
      onSuccess: async res => {
        setIsLoading(false);
        const newOrderId = res.data?.order_id || '';

        // Nếu thanh toán bằng ATM, chuyển đến VNPay
        if (paymentMethod === 'ATM') {
          handleVnpayPayment(newOrderId);
          return;
        }

        // Gửi email xác nhận đơn hàng nếu có thông tin pending
        if (pendingEmailData) {
          try {
            // Cập nhật order_code với ID vừa nhận được
            const emailData: SendOrderConfirmationRequest = {
              ...pendingEmailData,
              order_code: newOrderId,
            };
            await SendEmailApi.sendOrderConfirmation(emailData);
            Alert.alert(
              'Đặt hàng thành công',
              'Đơn hàng của bạn đã được đặt thành công! Hóa đơn đã được gửi tới email của bạn.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    clearCart();
                    navigation.navigate('Home' as never);
                  },
                },
              ],
            );
          } catch (error) {
            console.error('Error sending email:', error);
            Alert.alert(
              'Đặt hàng thành công',
              'Đơn hàng của bạn đã được đặt thành công! Tuy nhiên có lỗi xảy ra khi gửi hóa đơn.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    clearCart();
                    navigation.navigate('Home' as never);
                  },
                },
              ],
            );
          } finally {
            // Reset pending email data
            setPendingEmailData(null);
          }
        } else {
          Alert.alert(
            'Đặt hàng thành công',
            'Đơn hàng của bạn đã được đặt thành công!',
            [
              {
                text: 'OK',
                onPress: () => {
                  clearCart();
                  navigation.navigate('Home' as never);
                },
              },
            ],
          );
        }
      },
      onError: err => {
        setIsLoading(false);
        Alert.alert(
          'Đặt hàng thất bại',
          err.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.',
        );
        // Reset pending email data khi có lỗi
        setPendingEmailData(null);
      },
    });

  // Validate and place order
  const handlePlaceOrder = async () => {
    // Validation
    if (!fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    if (!selectedProvince) {
      Alert.alert('Lỗi', 'Vui lòng chọn tỉnh/thành phố');
      return;
    }

    if (!selectedDistrict) {
      Alert.alert('Lỗi', 'Vui lòng chọn quận/huyện');
      return;
    }

    if (!selectedWard) {
      Alert.alert('Lỗi', 'Vui lòng chọn phường/xã');
      return;
    }

    if (!specificAddress.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ cụ thể');
      return;
    }

    if (!patient?.patientId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin bệnh nhân');
      return;
    }

    setIsLoading(true);

    try {
      // Map cartItems sang order_items backend yêu cầu
      const order_items = items.map(item => ({
        drug_id: item.drug.drug_id,
        item_name: item.drug.name,
        quantity: item.quantity,
        price: item.drug.price * (1 - item.drug.discount_percent / 100),
        item_id: item.drug.drug_id ?? undefined,
      }));

      // Build full address for order
      const fullAddress = `${specificAddress}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`;

      const orderRequest = {
        patient_id: patient.patientId,
        book_user_id: userId || '', // Assuming same as patient_id
        items: order_items,
        delivery_info: {
          address: fullAddress,
          phone: phone,
          note: note,
          method: 'HOME_DELIVERY' as const,
          city: selectedProvince?.name,
          district: selectedDistrict?.name,
          ward: selectedWard?.name || undefined,
          fee: shippingFee,
          fullName: fullName,
          email: email,
        },
      };

      // Lưu dữ liệu email để gửi sau khi order thành công
      const emailData: SendOrderConfirmationRequest = {
        to_email: email,
        patient_name: fullName,
        order_code: '', // Sẽ được cập nhật trong onSuccess callback
        order_items: order_items,
        delivery_method: 'HOME_DELIVERY' as const,
        delivery_address: fullAddress,
        delivery_phone: phone,
        delivery_fullname: fullName,
        delivery_email: email,
        delivery_note: note,
        delivery_fee: shippingFee,
        delivery_city: selectedProvince?.name || '',
        delivery_district: selectedDistrict?.name || '',
        delivery_ward: selectedWard?.name || '',
      };

      // Set pending email data
      setPendingEmailData(emailData);

      createOrder(orderRequest);
    } catch (error) {
      console.error('Error preparing order:', error);
      Alert.alert(
        'Lỗi',
        'Đã xảy ra lỗi khi chuẩn bị đơn hàng. Vui lòng thử lại sau.',
      );
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.primaryBlue} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Thanh toán</Text>
      <View style={{ width: 24 }} />
    </View>
  );

  if (isLoadingAddress) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show VNPay WebView if needed
  if (showVNPayWebView) {
    console.log('vnpayPaymentUrl', vnpayPaymentUrl);
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
      {renderHeader()}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Thông tin người nhận */}
        <ReceiverInfoComponent
          fullName={fullName}
          phone={phone}
          email={email}
          onFullNameChange={setFullName}
          onPhoneChange={setPhone}
          onEmailChange={setEmail}
          colors={Colors}
        />

        {/* Địa chỉ giao hàng */}
        <DeliveryAddressComponent
          provinces={provinces}
          districts={districts}
          wards={wards}
          selectedProvince={selectedProvince}
          selectedDistrict={selectedDistrict}
          selectedWard={selectedWard}
          specificAddress={specificAddress}
          note={note}
          showProvinceModal={showProvinceModal}
          showDistrictModal={showDistrictModal}
          showWardModal={showWardModal}
          onProvinceSelect={handleSelectProvince}
          onDistrictSelect={handleSelectDistrict}
          onWardSelect={handleSelectWard}
          onSpecificAddressChange={setSpecificAddress}
          onNoteChange={setNote}
          onShowProvinceModal={setShowProvinceModal}
          onShowDistrictModal={setShowDistrictModal}
          onShowWardModal={setShowWardModal}
          colors={Colors}
        />

        {/* Phương thức thanh toán */}
        <PaymentMethodsComponent
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          colors={Colors}
        />

        {/* Thông tin đơn hàng */}
        <OrderSummaryComponent
          items={items}
          totalAmount={totalAmount}
          shippingFee={shippingFee}
          colors={Colors}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomSummary}>
          <Text style={styles.bottomLabel}>Tổng thanh toán</Text>
          <Text style={styles.bottomTotal}>
            {(totalAmount + shippingFee).toLocaleString('vi-VN')}đ
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            (isLoading || isOrderPending || isVnpayPending) &&
              styles.buttonDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={isLoading || isOrderPending || isVnpayPending}
        >
          {isLoading || isOrderPending || isVnpayPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
              <Text style={styles.placeOrderButtonText}>
                {paymentMethod === 'ATM' ? 'Thanh toán VNPay' : 'Đặt hàng'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  // Base Container
  container: { flex: 1, backgroundColor: '#f5f7fa' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#3366FF' },

  // Scroll View
  scrollView: { flex: 1 },

  // Bottom Container
  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bottomSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bottomLabel: {
    fontSize: 15,
    color: '#5C5C5C',
  },
  bottomTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1250DC',
  },
  placeOrderButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
    shadowOpacity: 0,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#5C5C5C',
  },
});
