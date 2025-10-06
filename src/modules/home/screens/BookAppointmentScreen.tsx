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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const Colors = {
  primaryBlue: '#3366FF',
  lightBlue: '#E6EEFF',
  textDark: '#1E1E1E',
  textGray: '#5C5C5C',
  backgroundWhite: '#FFFFFF',
};

export type HospitalType = {
  hospital_id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  created_at: string;
  updated_at: string;
  //   Doctors?: Doctor[];
  slug: string;
  url_map: string;
  ward: string;
  city: string;
  latitude?: number;
  longitude?: number;
};

export type Doctor = {
  doctor_id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  image: string;
  specialty: Specialty;
  hospital_id: string;
  created_at: string;
  updated_at: string;
  slug: string;
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

export type Service = {
  service_id: string;
  name: string;
  duration: number;
  price: number;
  created_at: string;
  updated_at: string;
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
const hospitals = [
  {
    hospital_id: '11',
    name: 'Bệnh viện Quân Y 175',
    address: '786 Nguyễn Kiệm',
    phone: '1800 6928',
    email: 'banctxhbenhvienquany175@gmail.com',
    image:
      'https://deepeyex.s3.ap-southeast-1.amazonaws.com/hospitals/b%E1%BB%87nh%20vi%E1%BB%87n%20175.jpg',
    created_at: '2025-09-22T14:30:00+07:00',
    updated_at: '2025-09-22T14:30:00+07:00',
    Doctors: null,
    slug: 'benh-vien-quan-y-175',
    url_map:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.918941142445!2d106.67808657326465!3d10.817515158438107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e2324759b7%3A0x6c91974ff86f05e3!2zQuG7h25oIHZp4buHbiBRdcOibiBZIDE3NQ!5e0!3m2!1svi!2s!4v1757917057537!5m2!1svi!2s',
    ward: 'Phường Hạnh Thông',
    city: 'Thành phố Hồ Chí Minh',
    latitude: 10.81752392,
    longitude: 106.68066023,
  },
  {
    hospital_id: '1a7c3c63-8e4f-4c8a-9b9e-2a45b3ecfb2e',
    name: 'Bệnh viện Quân Y 175',
    address: '786 Nguyễn Kiệm',
    phone: '1800 6928',
    email: 'banctxhbenhvienquany175@gmail.com',
    image:
      'https://deepeyex.s3.ap-southeast-1.amazonaws.com/hospitals/b%E1%BB%87nh%20vi%E1%BB%87n%20175.jpg',
    created_at: '2025-09-22T14:30:00+07:00',
    updated_at: '2025-09-22T14:30:00+07:00',
    Doctors: null,
    slug: 'benh-vien-quan-y-175',
    url_map:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.918941142445!2d106.67808657326465!3d10.817515158438107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e2324759b7%3A0x6c91974ff86f05e3!2zQuG7h25oIHZp4buHbiBRdcOibiBZIDE3NQ!5e0!3m2!1svi!2s!4v1757917057537!5m2!1svi!2s',
    ward: 'Phường Hạnh Thông',
    city: 'Thành phố Hồ Chí Minh',
    latitude: 10.81752392,
    longitude: 106.68066023,
  },
];

// Dữ liệu mẫu cho tỉnh thành và xã phường
const provinces = [
  { id: '1', name: 'Thành phố Hồ Chí Minh' },
  { id: '2', name: 'Hà Nội' },
  { id: '3', name: 'Đà Nẵng' },
  { id: '4', name: 'Cần Thơ' },
  { id: '5', name: 'An Giang' },
  { id: '6', name: 'Bà Rịa - Vũng Tàu' },
  { id: '7', name: 'Bắc Giang' },
  { id: '8', name: 'Bắc Kạn' },
  { id: '9', name: 'Bạc Liêu' },
  { id: '10', name: 'Bắc Ninh' },
];

const wards = {
  '1': [
    // TP.HCM
    { id: '1', name: 'Phường Hạnh Thông', district: 'Quận Gò Vấp' },
    { id: '2', name: 'Phường 1', district: 'Quận 1' },
    { id: '3', name: 'Phường 2', district: 'Quận 1' },
    { id: '4', name: 'Phường 3', district: 'Quận 1' },
    { id: '5', name: 'Phường 4', district: 'Quận 1' },
    { id: '6', name: 'Phường 5', district: 'Quận 1' },
    { id: '7', name: 'Phường 6', district: 'Quận 1' },
    { id: '8', name: 'Phường 7', district: 'Quận 1' },
    { id: '9', name: 'Phường 8', district: 'Quận 1' },
    { id: '10', name: 'Phường 9', district: 'Quận 1' },
  ],
  '2': [
    // Hà Nội
    { id: '11', name: 'Phường Phúc Xá', district: 'Quận Ba Đình' },
    { id: '12', name: 'Phường Trúc Bạch', district: 'Quận Ba Đình' },
    { id: '13', name: 'Phường Vĩnh Phú', district: 'Quận Ba Đình' },
  ],
  '3': [
    // Đà Nẵng
    { id: '14', name: 'Phường Hải Châu 1', district: 'Quận Hải Châu' },
    { id: '15', name: 'Phường Hải Châu 2', district: 'Quận Hải Châu' },
  ],
};

const doctors: Doctor[] = [
  {
    doctor_id: '1',
    user_id: 'user1',
    full_name: 'BS. Nguyễn Văn A',
    phone: '0909090909',
    email: 'doctor1@example.com',
    image: 'https://via.placeholder.com/80x80',
    specialty: Specialty.Ophthalmology,
    hospital_id: '11',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    slug: 'bs-nguyen-van-a',
  },
  {
    doctor_id: '2',
    user_id: 'user2',
    full_name: 'BS. Trần Thị B',
    phone: '0909090909',
    email: 'doctor2@example.com',
    image: 'https://via.placeholder.com/80x80',
    specialty: Specialty.Ophthalmology,
    hospital_id: '11',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    slug: 'bs-tran-thi-b',
  },
  {
    doctor_id: '3',
    user_id: 'user3',
    full_name: 'BS. Lê Văn C',
    phone: '0909090909',
    email: 'doctor3@example.com',
    image: 'https://via.placeholder.com/80x80',
    specialty: Specialty.Ophthalmology,
    hospital_id: '1a7c3c63-8e4f-4c8a-9b9e-2a45b3ecfb2e',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    slug: 'bs-le-van-c',
  },
];

const services = [
  {
    service_id: 1,
    name: 'Khám tổng quát mắt',
    price: '200,000 VNĐ',
    duration: 30,
  },
  {
    service_id: 2,
    name: 'Khám chuyên sâu mắt',
    price: '500,000 VNĐ',
    duration: 30,
  },
  { service_id: 3, name: 'Đo thị lực', price: '100,000 VNĐ', duration: 30 },
  {
    service_id: 4,
    name: 'Khám mắt trẻ em',
    price: '300,000 VNĐ',
    duration: 30,
  },
];

const timeSlots = [
  {
    slot_id: '8e0df6df-b1c2-4abe-87b6-f69af38d1f6f',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-06T09:00:00+07:00',
    end_time: '2025-10-06T10:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379165+07:00',
    updated_at: '2025-10-03T11:17:35.379165+07:00',
  },
  {
    slot_id: '9f42a8a4-4eea-4283-9cd7-a37b77d272d4',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-06T10:00:00+07:00',
    end_time: '2025-10-06T11:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379167+07:00',
    updated_at: '2025-10-03T11:17:35.379167+07:00',
  },
  {
    slot_id: '9d780b5e-2880-43e8-b995-05d92f1bb6d7',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-06T11:00:00+07:00',
    end_time: '2025-10-06T12:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379179+07:00',
    updated_at: '2025-10-03T11:17:35.379179+07:00',
  },
  {
    slot_id: '700930df-1097-45cd-9aa5-45f43336a357',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-06T13:30:00+07:00',
    end_time: '2025-10-06T14:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379181+07:00',
    updated_at: '2025-10-03T11:17:35.379181+07:00',
  },
  {
    slot_id: '30da38a7-7d5a-479c-a8a3-c86a9c72e555',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-06T14:00:00+07:00',
    end_time: '2025-10-06T15:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379182+07:00',
    updated_at: '2025-10-03T11:17:35.379182+07:00',
  },
  {
    slot_id: 'e2f9059c-726b-4dbd-a923-175437392bb5',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-06T15:00:00+07:00',
    end_time: '2025-10-06T16:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379183+07:00',
    updated_at: '2025-10-03T11:17:35.379184+07:00',
  },
  {
    slot_id: 'eeac7040-5e1a-48bc-9b37-0125b29664de',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-06T16:00:00+07:00',
    end_time: '2025-10-06T17:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379185+07:00',
    updated_at: '2025-10-03T11:17:35.379185+07:00',
  },
  {
    slot_id: '56a934e4-9b41-4661-990f-9d03b67def71',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-06T18:00:00+07:00',
    end_time: '2025-10-06T19:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379186+07:00',
    updated_at: '2025-10-03T11:17:35.379186+07:00',
  },
  {
    slot_id: 'b4e0a2be-a90f-47f6-a27a-a2253c695f3d',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-06T19:00:00+07:00',
    end_time: '2025-10-06T20:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379189+07:00',
    updated_at: '2025-10-03T11:17:35.379189+07:00',
  },
  {
    slot_id: '85123a4f-47ea-42f9-9225-10332ce35327',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-06T20:00:00+07:00',
    end_time: '2025-10-06T21:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.37919+07:00',
    updated_at: '2025-10-03T11:17:35.37919+07:00',
  },
  {
    slot_id: 'e241c96b-a498-4984-bff0-6053ab9540ce',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-07T08:30:00+07:00',
    end_time: '2025-10-07T09:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379193+07:00',
    updated_at: '2025-10-03T11:17:35.379193+07:00',
  },
  {
    slot_id: '5575a9bf-3ea5-40e9-9993-13e17a22d40f',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-07T09:00:00+07:00',
    end_time: '2025-10-07T10:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379194+07:00',
    updated_at: '2025-10-03T11:17:35.379194+07:00',
  },
  {
    slot_id: 'ef7c8883-5f6f-4e43-b1e4-f6382944d206',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-07T10:00:00+07:00',
    end_time: '2025-10-07T11:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379195+07:00',
    updated_at: '2025-10-03T11:17:35.379195+07:00',
  },
  {
    slot_id: '218fe60d-8032-45f3-aabe-33b7d1c7f16c',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-07T11:00:00+07:00',
    end_time: '2025-10-07T12:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379196+07:00',
    updated_at: '2025-10-03T11:17:35.379196+07:00',
  },
  {
    slot_id: '12339964-bb49-46cc-8885-4c111f2ae7e5',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-07T13:30:00+07:00',
    end_time: '2025-10-07T14:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379197+07:00',
    updated_at: '2025-10-03T11:17:35.379197+07:00',
  },
  {
    slot_id: '5f0bcdda-2db7-4681-afe6-46a1b5015d9c',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-07T14:00:00+07:00',
    end_time: '2025-10-07T15:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379198+07:00',
    updated_at: '2025-10-03T11:17:35.379198+07:00',
  },
  {
    slot_id: 'f47ddd16-aeb5-493a-a4af-0e2c3961e9cf',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-07T15:00:00+07:00',
    end_time: '2025-10-07T16:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379208+07:00',
    updated_at: '2025-10-03T11:17:35.379208+07:00',
  },
  {
    slot_id: '19197f18-b9ed-49ec-b865-152636389f7f',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-07T16:00:00+07:00',
    end_time: '2025-10-07T17:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379209+07:00',
    updated_at: '2025-10-03T11:17:35.379209+07:00',
  },
  {
    slot_id: 'ad48c8f7-8142-4af2-b190-ff65a5c849f7',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-07T18:00:00+07:00',
    end_time: '2025-10-07T19:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.37921+07:00',
    updated_at: '2025-10-03T11:17:35.37921+07:00',
  },
  {
    slot_id: 'ced4d24e-5de3-49a2-af8a-c6fddbde0ebf',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-07T19:00:00+07:00',
    end_time: '2025-10-07T20:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379211+07:00',
    updated_at: '2025-10-03T11:17:35.379211+07:00',
  },
  {
    slot_id: '69e4b955-11a9-49cc-8485-e9680e906b35',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-07T20:00:00+07:00',
    end_time: '2025-10-07T21:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379212+07:00',
    updated_at: '2025-10-03T11:17:35.379212+07:00',
  },
  {
    slot_id: 'a7179974-1215-4598-9f02-256e5ee83f1d',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-08T08:30:00+07:00',
    end_time: '2025-10-08T09:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379214+07:00',
    updated_at: '2025-10-03T11:17:35.379214+07:00',
  },
  {
    slot_id: 'cafa3c9f-ae45-4697-a362-22f96ee3631b',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-08T09:00:00+07:00',
    end_time: '2025-10-08T10:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379215+07:00',
    updated_at: '2025-10-03T11:17:35.379215+07:00',
  },
  {
    slot_id: '29d2dea7-8f97-4c90-90c0-2c903e27a76d',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-08T10:00:00+07:00',
    end_time: '2025-10-08T11:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379216+07:00',
    updated_at: '2025-10-03T11:17:35.379216+07:00',
  },
  {
    slot_id: '5d1ca789-6456-46e4-ba06-ff5f5d738567',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-08T11:00:00+07:00',
    end_time: '2025-10-08T12:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379217+07:00',
    updated_at: '2025-10-03T11:17:35.379217+07:00',
  },
  {
    slot_id: '85809a24-3821-49e3-8aca-44563352325f',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-08T13:30:00+07:00',
    end_time: '2025-10-08T14:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379218+07:00',
    updated_at: '2025-10-03T11:17:35.379218+07:00',
  },
  {
    slot_id: '22bc455d-b322-4a7e-8ad0-0f92d8d24c81',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-08T14:00:00+07:00',
    end_time: '2025-10-08T15:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379219+07:00',
    updated_at: '2025-10-03T11:17:35.379219+07:00',
  },
  {
    slot_id: '2bd070e6-33af-4a7f-a7b3-6187a5939dae',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-08T15:00:00+07:00',
    end_time: '2025-10-08T16:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.37922+07:00',
    updated_at: '2025-10-03T11:17:35.37922+07:00',
  },
  {
    slot_id: '5a54620d-26a3-4115-90bf-454a39d63a10',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-08T16:00:00+07:00',
    end_time: '2025-10-08T17:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379221+07:00',
    updated_at: '2025-10-03T11:17:35.379221+07:00',
  },
  {
    slot_id: '365bf77a-32ba-4cfe-846c-328b11ecbe14',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-08T18:00:00+07:00',
    end_time: '2025-10-08T19:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379222+07:00',
    updated_at: '2025-10-03T11:17:35.379222+07:00',
  },
  {
    slot_id: '80932c06-ac2b-401b-bd79-ab9f9037f151',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-08T19:00:00+07:00',
    end_time: '2025-10-08T20:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379223+07:00',
    updated_at: '2025-10-03T11:17:35.379223+07:00',
  },
  {
    slot_id: 'a043f094-7869-4682-8aa7-1072312a609e',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-08T20:00:00+07:00',
    end_time: '2025-10-08T21:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379224+07:00',
    updated_at: '2025-10-03T11:17:35.379224+07:00',
  },
  {
    slot_id: '5b958cca-d6be-4dc3-bc30-4a586a8145ba',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-09T08:30:00+07:00',
    end_time: '2025-10-09T09:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379225+07:00',
    updated_at: '2025-10-03T11:17:35.379225+07:00',
  },
  {
    slot_id: 'a636286e-8b63-43ea-a4e1-bc5e7382bbb9',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-09T09:00:00+07:00',
    end_time: '2025-10-09T10:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379235+07:00',
    updated_at: '2025-10-03T11:17:35.379235+07:00',
  },
  {
    slot_id: '06c02322-e229-4d16-bc9c-a92a74647095',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-09T10:00:00+07:00',
    end_time: '2025-10-09T11:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379236+07:00',
    updated_at: '2025-10-03T11:17:35.379236+07:00',
  },
  {
    slot_id: '664a0b05-4619-49e0-8e36-d0c9644fee48',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-09T11:00:00+07:00',
    end_time: '2025-10-09T12:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379237+07:00',
    updated_at: '2025-10-03T11:17:35.379237+07:00',
  },
  {
    slot_id: '201c6178-7dd4-45a0-9c70-3ceb6dcb1ae7',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-09T13:30:00+07:00',
    end_time: '2025-10-09T14:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379238+07:00',
    updated_at: '2025-10-03T11:17:35.379238+07:00',
  },
  {
    slot_id: '6fa1ceb3-e034-45fc-9237-d0baaf030ae6',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-09T14:00:00+07:00',
    end_time: '2025-10-09T15:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379239+07:00',
    updated_at: '2025-10-03T11:17:35.37924+07:00',
  },
  {
    slot_id: '24bbd6be-482a-433f-ace4-4971c2f63ae3',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-09T15:00:00+07:00',
    end_time: '2025-10-09T16:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.37924+07:00',
    updated_at: '2025-10-03T11:17:35.379241+07:00',
  },
  {
    slot_id: '5e6731c1-f9cb-4173-9f3b-66c99a353808',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-09T16:00:00+07:00',
    end_time: '2025-10-09T17:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379241+07:00',
    updated_at: '2025-10-03T11:17:35.379242+07:00',
  },
  {
    slot_id: 'a7188211-c2c1-4efb-bdbd-1bbaf08185ef',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-09T18:00:00+07:00',
    end_time: '2025-10-09T19:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379243+07:00',
    updated_at: '2025-10-03T11:17:35.379243+07:00',
  },
  {
    slot_id: '8b2ff070-3ca6-4dd5-b6c2-a7cffa73920a',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-09T19:00:00+07:00',
    end_time: '2025-10-09T20:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379244+07:00',
    updated_at: '2025-10-03T11:17:35.379244+07:00',
  },
  {
    slot_id: '9980ecef-c80a-4698-9173-d5160b69743d',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-09T20:00:00+07:00',
    end_time: '2025-10-09T21:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379245+07:00',
    updated_at: '2025-10-03T11:17:35.379245+07:00',
  },
  {
    slot_id: '1268d460-d153-4e7b-8790-12c44a7942bb',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-10T08:30:00+07:00',
    end_time: '2025-10-10T09:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379246+07:00',
    updated_at: '2025-10-03T11:17:35.379246+07:00',
  },
  {
    slot_id: 'c077f74d-eae7-423d-a185-210fa84cabc8',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-10T09:00:00+07:00',
    end_time: '2025-10-10T10:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379247+07:00',
    updated_at: '2025-10-03T11:17:35.379247+07:00',
  },
  {
    slot_id: 'c8428660-7be5-417f-941d-af261b691e13',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-10T10:00:00+07:00',
    end_time: '2025-10-10T11:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379248+07:00',
    updated_at: '2025-10-03T11:17:35.379248+07:00',
  },
  {
    slot_id: 'adbf3167-b835-4c51-b8ab-0f1b23d65208',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-10T11:00:00+07:00',
    end_time: '2025-10-10T12:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379249+07:00',
    updated_at: '2025-10-03T11:17:35.379249+07:00',
  },
  {
    slot_id: '601b7b7c-3338-4c5b-b341-7fedb3b3df45',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-10T13:30:00+07:00',
    end_time: '2025-10-10T14:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.37925+07:00',
    updated_at: '2025-10-03T11:17:35.37925+07:00',
  },
  {
    slot_id: 'f9d51905-7a4a-4ba6-8c3a-9b32ede88501',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-10T14:00:00+07:00',
    end_time: '2025-10-10T15:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379251+07:00',
    updated_at: '2025-10-03T11:17:35.379251+07:00',
  },
  {
    slot_id: 'd34ce027-0669-4001-bfce-00c28e0f06da',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-10T15:00:00+07:00',
    end_time: '2025-10-10T16:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379252+07:00',
    updated_at: '2025-10-03T11:17:35.379252+07:00',
  },
  {
    slot_id: '3585d59e-4870-4d90-973b-1352fa8ee310',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-10T16:00:00+07:00',
    end_time: '2025-10-10T17:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379253+07:00',
    updated_at: '2025-10-03T11:17:35.379253+07:00',
  },
  {
    slot_id: 'c410e92f-04da-4f64-86a9-f9cad6baecb8',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-10T18:00:00+07:00',
    end_time: '2025-10-10T19:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379254+07:00',
    updated_at: '2025-10-03T11:17:35.379254+07:00',
  },
  {
    slot_id: 'b55b203f-6080-446c-9c95-272be8874762',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-10T19:00:00+07:00',
    end_time: '2025-10-10T20:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379255+07:00',
    updated_at: '2025-10-03T11:17:35.379255+07:00',
  },
  {
    slot_id: '67ccde14-ae02-4f87-a421-5c7fd8986ff7',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-10T20:00:00+07:00',
    end_time: '2025-10-10T21:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379256+07:00',
    updated_at: '2025-10-03T11:17:35.379256+07:00',
  },
  {
    slot_id: '003f64ad-70f0-426c-8d65-fa821af9c77e',
    doctor_id: 'ff6adc0a-5cd3-4aef-acf1-d9d0820e434d',
    start_time: '2025-10-06T08:30:00+07:00',
    end_time: '2025-10-06T09:00:00+07:00',
    capacity: 1,
    created_at: '2025-10-03T11:17:35.379104+07:00',
    updated_at: '2025-10-03T11:17:35.379104+07:00',
    appointment_id: '7bf9d5c1-807a-4072-b760-787aaf256236',
  },
];

// Dữ liệu mẫu cho patients
const patients: Patient[] = [
  {
    patient_id: '1',
    user_id: 'user1',
    full_name: 'Nguyễn Văn A',
    dob: '1990-01-15T00:00:00+07:00',
    gender: 'male',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '0901234567',
    email: 'nguyenvana@example.com',
    image: 'https://via.placeholder.com/80x80',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
];

type Step =
  | 'hospital'
  | 'doctor'
  | 'service'
  | 'schedule'
  | 'confirmation'
  | 'patient';

const BookAppointmentScreen = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState<Step>('hospital');
  const [selectedHospital, setSelectedHospital] = useState<HospitalType>();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Set ngày hiện tại làm mặc định
    return new Date().toLocaleDateString('vi-VN');
  });
  const [_selectedTime, _setSelectedTime] = useState<string>('');

  // States cho filter và tìm kiếm
  const [searchText, setSearchText] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [showProvinceModal, setShowProvinceModal] = useState<boolean>(false);
  const [showWardModal, setShowWardModal] = useState<boolean>(false);
  const [filteredHospitals, setFilteredHospitals] =
    useState<HospitalType[]>(hospitals);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // States cho filter bác sĩ
  const [doctorSearchText, setDoctorSearchText] = useState<string>('');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(doctors);

  // States cho time slots
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null,
  );

  // States cho patient - tự động chọn bệnh nhân đầu tiên
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    patients[0],
  );
  const [isEditingPatient, setIsEditingPatient] = useState<boolean>(false);
  const [tempPatientData, setTempPatientData] = useState<Patient | null>(null);
  const [patientErrors, setPatientErrors] = useState<Record<string, string>>(
    {},
  );

  // States cho phương thức thanh toán
  const [requestEInvoice, setRequestEInvoice] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('cash');

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

    if (!tempPatientData.full_name.trim()) {
      errors.full_name = 'Họ tên không được để trống';
    }

    if (!tempPatientData.phone.trim()) {
      errors.phone = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(tempPatientData.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!tempPatientData.email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempPatientData.email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (!tempPatientData.address.trim()) {
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

  // Function để filter bệnh viện
  const filterHospitals = useCallback(() => {
    let filtered = hospitals;

    // Filter theo tên bệnh viện
    if (searchText.trim()) {
      filtered = filtered.filter(
        hospital =>
          hospital.name.toLowerCase().includes(searchText.toLowerCase()) ||
          hospital.address.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // Filter theo tỉnh thành
    if (selectedProvince) {
      filtered = filtered.filter(
        hospital => hospital.city === selectedProvince.name,
      );
    }

    // Filter theo xã phường
    if (selectedWard) {
      filtered = filtered.filter(
        hospital => hospital.ward === selectedWard.name,
      );
    }

    setFilteredHospitals(filtered);
  }, [searchText, selectedProvince, selectedWard]);

  // Function để tìm bệnh viện gần nhất
  const findNearbyHospitals = () => {
    if (!userLocation) {
      Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại của bạn');
      return;
    }

    const hospitalsWithDistance = hospitals.map(hospital => ({
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
    let filtered = doctors;

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
          SpecialtyLabel[doctor.specialty as keyof typeof SpecialtyLabel]
            ?.toLowerCase()
            .includes(doctorSearchText.toLowerCase()),
      );
    }

    setFilteredDoctors(filtered);
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
    const filtered = timeSlots.filter(slot => {
      const slotDate = new Date(slot.start_time);
      const isSameDate =
        slotDate.getDate() === selectedDateObj.getDate() &&
        slotDate.getMonth() === selectedDateObj.getMonth() &&
        slotDate.getFullYear() === selectedDateObj.getFullYear();

      //   const isSameDoctor = slot.doctor_id === selectedDoctor.doctor_id;
      const isAvailable = !slot.appointment_id; // Chưa có appointment

      return isSameDate && isAvailable;
    });

    console.log(filtered);

    // Sort theo thời gian
    filtered.sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );

    setAvailableTimeSlots(filtered);
  }, [selectedDoctor, selectedDate]);

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

  const handleBookAppointment = () => {
    const timeDisplay = selectedTimeSlot
      ? formatTimeDisplay(
          selectedTimeSlot.start_time,
          selectedTimeSlot.end_time,
        )
      : 'Chưa chọn giờ';

    Alert.alert(
      'Đặt lịch thành công!',
      `Bạn đã đặt lịch khám với ${selectedDoctor?.full_name} tại ${selectedHospital?.name} vào ${selectedDate} lúc ${timeDisplay}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
    );
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
              {selectedProvince ? selectedProvince.name : 'Tỉnh thành'}
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
              {selectedWard ? selectedWard.name : 'Xã phường'}
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
              setFilteredHospitals(hospitals);
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
                    doctor.specialty as keyof typeof SpecialtyLabel
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
        {services.map(service => (
          <TouchableOpacity
            key={service.service_id}
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
                {service.price} - {service.duration} phút
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
                      value={currentPatient?.full_name || ''}
                      onChangeText={text =>
                        handlePatientInputChange('full_name', text)
                      }
                      placeholder="Nhập họ và tên"
                      placeholderTextColor={Colors.textGray}
                    />
                  ) : (
                    <Text style={styles.detailValue}>
                      {currentPatient?.full_name || ''}
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
                    {currentPatient ? formatGender(currentPatient.gender) : ''}
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
                      ? formatDateOfBirth(currentPatient.dob)
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

  const renderConfirmation = () => (
    <View style={styles.content}>
      <Text style={styles.title}>Xác nhận đặt lịch</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.confirmationScrollView}
      >
        <View style={styles.confirmationCard}>
          <Text style={styles.confirmationTitle}>Thông tin đặt lịch</Text>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>Bệnh viện:</Text>
            <Text style={styles.confirmationValue}>
              {selectedHospital?.name}
            </Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>Bác sĩ:</Text>
            <Text style={styles.confirmationValue}>
              {selectedDoctor?.full_name}
            </Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>Dịch vụ:</Text>
            <Text style={styles.confirmationValue}>
              {selectedService?.name}
            </Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>Ngày:</Text>
            <Text style={styles.confirmationValue}>{selectedDate}</Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>Giờ:</Text>
            <Text style={styles.confirmationValue}>
              {selectedTimeSlot
                ? formatTimeDisplay(
                    selectedTimeSlot.start_time,
                    selectedTimeSlot.end_time,
                  )
                : 'Chưa chọn giờ'}
            </Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>Bệnh nhân:</Text>
            <Text style={styles.confirmationValue}>
              {selectedPatient?.full_name}
            </Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>Số điện thoại:</Text>
            <Text style={styles.confirmationValue}>
              {selectedPatient?.phone}
            </Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>Phí khám:</Text>
            <Text style={styles.confirmationValue}>
              {selectedService?.price}
            </Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>
              Phương thức thanh toán:
            </Text>
            <Text style={styles.confirmationValue}>
              {selectedPaymentMethod === 'cash'
                ? 'Thanh toán tiền mặt khi nhận hàng'
                : 'Thanh toán bằng thẻ ATM nội địa và tài khoản ngân hàng'}
            </Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>Xuất hóa đơn điện tử:</Text>
            <Text style={styles.confirmationValue}>
              {requestEInvoice ? 'Có' : 'Không'}
            </Text>
          </View>
        </View>

        {/* Phương thức thanh toán */}
        <View style={styles.paymentMethodCard}>
          <Text style={styles.paymentMethodTitle}>Phương thức thanh toán</Text>

          {/* Xuất hóa đơn điện tử */}
          <View style={styles.invoiceSection}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRequestEInvoice(!requestEInvoice)}
            >
              <View
                style={[
                  styles.checkbox,
                  requestEInvoice && styles.checkboxChecked,
                ]}
              >
                {requestEInvoice && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                Yêu cầu xuất hóa đơn điện tử
              </Text>
            </TouchableOpacity>
          </View>

          {/* Chọn phương thức thanh toán */}
          <View style={styles.paymentMethodsSection}>
            <Text style={styles.paymentMethodsTitle}>
              Chọn phương thức thanh toán:
            </Text>

            <TouchableOpacity
              style={[
                styles.paymentMethodOption,
                selectedPaymentMethod === 'cash' &&
                  styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedPaymentMethod('cash')}
            >
              <View style={styles.paymentMethodContent}>
                <Ionicons
                  name="cash-outline"
                  size={24}
                  color={
                    selectedPaymentMethod === 'cash'
                      ? Colors.primaryBlue
                      : Colors.textGray
                  }
                />
                <View style={styles.paymentMethodInfo}>
                  <Text
                    style={[
                      styles.paymentMethodName,
                      selectedPaymentMethod === 'cash' &&
                        styles.paymentMethodNameSelected,
                    ]}
                  >
                    Thanh toán tiền mặt khi nhận hàng
                  </Text>
                  <Text style={styles.paymentMethodDescription}>
                    Thanh toán bằng tiền mặt khi đến khám
                  </Text>
                </View>
              </View>
              {selectedPaymentMethod === 'cash' && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={Colors.primaryBlue}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethodOption,
                selectedPaymentMethod === 'bank' &&
                  styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedPaymentMethod('bank')}
            >
              <View style={styles.paymentMethodContent}>
                <Ionicons
                  name="card-outline"
                  size={24}
                  color={
                    selectedPaymentMethod === 'bank'
                      ? Colors.primaryBlue
                      : Colors.textGray
                  }
                />
                <View style={styles.paymentMethodInfo}>
                  <Text
                    style={[
                      styles.paymentMethodName,
                      selectedPaymentMethod === 'bank' &&
                        styles.paymentMethodNameSelected,
                    ]}
                  >
                    Thanh toán bằng thẻ ATM nội địa và tài khoản ngân hàng
                  </Text>
                  <Text style={styles.paymentMethodDescription}>
                    Thanh toán trực tuyến qua thẻ ATM hoặc chuyển khoản ngân
                    hàng
                  </Text>
                </View>
              </View>
              {selectedPaymentMethod === 'bank' && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={Colors.primaryBlue}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );

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
            {provinces.map(province => (
              <TouchableOpacity
                key={province.id}
                style={[
                  styles.modalItem,
                  selectedProvince?.id === province.id &&
                    styles.selectedModalItem,
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
                    selectedProvince?.id === province.id &&
                      styles.selectedModalItemText,
                  ]}
                >
                  {province.name}
                </Text>
                {selectedProvince?.id === province.id && (
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
              wards[selectedProvince.id as keyof typeof wards]?.map(ward => (
                <TouchableOpacity
                  key={ward.id}
                  style={[
                    styles.modalItem,
                    selectedWard?.id === ward.id && styles.selectedModalItem,
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
                        selectedWard?.id === ward.id &&
                          styles.selectedModalItemText,
                      ]}
                    >
                      {ward.name}
                    </Text>
                    <Text style={styles.modalItemSubtext}>{ward.district}</Text>
                  </View>
                  {selectedWard?.id === ward.id && (
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
            style={styles.bookButton}
            onPress={handleBookAppointment}
          >
            <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
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
});

export default BookAppointmentScreen;
