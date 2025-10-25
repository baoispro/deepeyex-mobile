import { AxiosInstance } from "axios";
import api from "../../../../shared/configs/axios";
import { ApiResponse } from "../../../../shared/types/response";

// ---------------- Types ----------------
export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  targetUrl: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateNotificationBody = {
  userId: string;
  title: string;
  message: string;
  targetUrl?: string;
};

// ---------------- Client ----------------
class NotificationClient {
  private readonly client: AxiosInstance;
  private readonly endpoint = "/hospital/notifications";

  constructor() {
    this.client = api;
  }

  // ---------------- Create Notification ----------------
  async create(data: CreateNotificationBody): Promise<ApiResponse<Notification>> {
    const response = await this.client.post<ApiResponse<Notification>>(this.endpoint, data);
    return response.data;
  }

  // ---------------- Get All Notifications ----------------
  async getAll(userId: string): Promise<ApiResponse<Notification[]>> {
    const response = await this.client.get<ApiResponse<Notification[]>>(this.endpoint, {
      params: { userID: userId },
    });
    return response.data;
  }

  // ---------------- Mark Notification Read ----------------
  async markRead(id: string): Promise<void> {
    await this.client.put(`${this.endpoint}/${id}/read`);
  }

  async markAllRead(userId: string): Promise<void> {
    await this.client.put(`${this.endpoint}/user/${userId}/read-all`);
  }

  // ---------------- Delete Notification ----------------
  async delete(id: string): Promise<void> {
    await this.client.delete(`${this.endpoint}/${id}`);
  }

  // ---------------- Delete All Notifications ----------------
  async deleteAll(userId: string): Promise<void> {
    await this.client.delete(`${this.endpoint}/all`, {
      params: { userId },
    });
  }

  // ---------------- Count Unread Notifications ----------------
  async countUnread(userId: string): Promise<{ unread: number }> {
    const response = await this.client.get<{ unread: number }>(`${this.endpoint}/unread`, {
      params: { userId },
    });
    return response.data;
  }
}

const NotificationApi = new NotificationClient();
export { NotificationApi, NotificationClient };
