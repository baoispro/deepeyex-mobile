// Cấu hình phí vận chuyển theo địa chỉ
export const SHIPPING_CONFIG = {
  innerCity: {
    provinces: ['Thành phố Hà Nội', 'Thành phố Hồ Chí Minh'],
    fee: 15000,
  },
  nearby: {
    provinces: [
      'Thành phố Hải Phòng',
      'Thành phố Đà Nẵng',
      'Thành phố Cần Thơ',
      'Tỉnh Bắc Ninh',
      'Tỉnh Hải Dương',
      'Tỉnh Vĩnh Phúc',
      'Tỉnh Thái Nguyên',
      'Tỉnh Quảng Ninh',
      'Tỉnh Bình Dương',
      'Tỉnh Đồng Nai',
      'Tỉnh Long An',
    ],
    fee: 30000,
  },
  faraway: {
    fee: 50000,
  },
  freeShippingThreshold: 500000, // Miễn phí ship cho đơn hàng trên 500k
};

// Hàm tính phí vận chuyển
export const calculateShippingFee = (
  provinceName: string,
  orderTotal: number,
): number => {
  // Nếu đơn hàng >= 500k thì miễn phí ship
  if (orderTotal >= SHIPPING_CONFIG.freeShippingThreshold) {
    return 0;
  }

  // Kiểm tra nội thành
  if (SHIPPING_CONFIG.innerCity.provinces.includes(provinceName)) {
    return SHIPPING_CONFIG.innerCity.fee;
  }

  // Kiểm tra lân cận
  if (SHIPPING_CONFIG.nearby.provinces.includes(provinceName)) {
    return SHIPPING_CONFIG.nearby.fee;
  }

  // Các tỉnh xa
  return SHIPPING_CONFIG.faraway.fee;
};
