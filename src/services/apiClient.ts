import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: `http://localhost:5000/api`,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export const apiRequest = async (
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
