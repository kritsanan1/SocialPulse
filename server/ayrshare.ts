import axios, { AxiosResponse } from 'axios';

const AYRSHARE_BASE_URL = 'https://app.ayrshare.com/api';

export interface AyrsharePostRequest {
  post: string;
  platforms: string[];
  mediaUrls?: string[];
  scheduleDate?: string;
  profileKey?: string;
}

export interface AyrsharePostResponse {
  status: string;
  id?: string;
  refId?: string;
  posts?: Array<{
    platform: string;
    status: string;
    postId?: string;
    error?: string;
  }>;
  errors?: Array<{
    platform: string;
    error: string;
  }>;
}

export interface AyrshareHistoryResponse {
  status: string;
  history?: Array<{
    id: string;
    post: string;
    platforms: string[];
    scheduleDate: string;
    created: string;
    status: string;
    refId: string;
  }>;
}

export interface AyrshareUploadResponse {
  status: string;
  url?: string;
  error?: string;
}

class AyrshareClient {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseURL = AYRSHARE_BASE_URL;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private getMultipartHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'multipart/form-data',
    };
  }

  async post(data: AyrsharePostRequest): Promise<AyrsharePostResponse> {
    try {
      const response: AxiosResponse<AyrsharePostResponse> = await axios.post(
        `${this.baseURL}/post`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Ayrshare API Error: ${error.response?.data?.error || error.message}`);
    }
  }

  async getHistory(profileKey?: string): Promise<AyrshareHistoryResponse> {
    try {
      const params = profileKey ? { profileKey } : {};
      const response: AxiosResponse<AyrshareHistoryResponse> = await axios.get(
        `${this.baseURL}/history`,
        { 
          headers: this.getHeaders(),
          params
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Ayrshare API Error: ${error.response?.data?.error || error.message}`);
    }
  }

  async uploadMedia(file: Buffer, filename: string): Promise<AyrshareUploadResponse> {
    try {
      const formData = new FormData();
      const blob = new Blob([file]);
      formData.append('file', blob, filename);

      const response: AxiosResponse<AyrshareUploadResponse> = await axios.post(
        `${this.baseURL}/upload`,
        formData,
        { headers: this.getMultipartHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Ayrshare API Error: ${error.response?.data?.error || error.message}`);
    }
  }

  // Validate platforms
  static validatePlatforms(platforms: string[]): boolean {
    const validPlatforms = [
      'twitter', 'x', 'facebook', 'instagram', 'linkedin', 'tiktok', 
      'pinterest', 'snapchat', 'youtube', 'reddit', 'telegram', 
      'threads', 'bluesky', 'google'
    ];
    return platforms.every(platform => 
      validPlatforms.includes(platform.toLowerCase())
    );
  }

  // Validate media URLs
  static validateMediaUrls(urls: string[]): boolean {
    const httpsRegex = /^https:\/\/.+/;
    return urls.every(url => httpsRegex.test(url));
  }

  // Validate schedule date
  static validateScheduleDate(scheduleDate: string): boolean {
    const date = new Date(scheduleDate);
    const now = new Date();
    return date > now && !isNaN(date.getTime());
  }
}

// Initialize client with API key from environment
export const ayrshareClient = new AyrshareClient(process.env.AYRSHARE_API_KEY || '');
export { AyrshareClient };