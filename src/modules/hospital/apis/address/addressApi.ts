import axios from 'axios';

const ADDRESS_API_URL = 'https://provinces.open-api.vn/api';

export type Ward = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  district_code: number;
};

export type District = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
  wards: Ward[];
};

export type Province = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  districts: District[];
};

class AddressClient {
  // Lấy tất cả tỉnh/thành phố (depth=2 để có cả quận/huyện)
  async getAllProvinces(): Promise<Province[]> {
    const response = await axios.get<Province[]>(`${ADDRESS_API_URL}/?depth=2`);
    return response.data;
  }

  // Lấy chi tiết tỉnh/thành phố với đầy đủ phường/xã (depth=3)
  async getProvinceDetail(provinceCode: number): Promise<Province> {
    const response = await axios.get<Province>(
      `${ADDRESS_API_URL}/p/${provinceCode}?depth=3`,
    );
    return response.data;
  }

  // Lấy chi tiết quận/huyện với phường/xã
  async getDistrictDetail(districtCode: number): Promise<District> {
    const response = await axios.get<District>(
      `${ADDRESS_API_URL}/d/${districtCode}?depth=2`,
    );
    return response.data;
  }
}

const AddressApi = new AddressClient();
export { AddressApi };
