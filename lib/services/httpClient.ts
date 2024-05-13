import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 5000, // Set a timeout of 5 seconds
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
    baseURL?: string
  ): Promise<T> {
    const axiosInstance = baseURL
      ? axios.create({ baseURL })
      : this.axiosInstance;
    const response: AxiosResponse<T> = await axiosInstance.get(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    baseURL?: string
  ): Promise<T> {
    const axiosInstance = baseURL
      ? axios.create({ baseURL })
      : this.axiosInstance;
    const response: AxiosResponse<T> = await axiosInstance.post(
      url,
      data,
      config
    );
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    baseURL?: string
  ): Promise<T> {
    const axiosInstance = baseURL
      ? axios.create({ baseURL })
      : this.axiosInstance;
    const response: AxiosResponse<T> = await axiosInstance.put(
      url,
      data,
      config
    );
    return response.data;
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
    baseURL?: string
  ): Promise<T> {
    const axiosInstance = baseURL
      ? axios.create({ baseURL })
      : this.axiosInstance;
    const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
    return response.data;
  }
}

const httpClient = new HttpClient(process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "");

export { httpClient };
