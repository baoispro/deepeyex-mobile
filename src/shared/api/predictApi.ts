import { AxiosInstance } from 'axios';
import api from '../configs/axios';
import { DiagnosisResponse } from '../types/predict';

const endpoint = '/external-eye/predict';

class PredictClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  /**
   * Upload ảnh để AI chẩn đoán
   * @param formData - FormData chứa ảnh cần upload
   * @param topK - Số lượng kết quả dự đoán top K
   */
  async predict(formData: FormData, topK = 3): Promise<DiagnosisResponse> {
    const response = await this.client.post<DiagnosisResponse>(
      `${endpoint}?top_k=${topK}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  }
}

const PredictApi = new PredictClient();
export { PredictApi };
