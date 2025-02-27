import api from "@/lib/api";
import { AxiosRequestConfig } from "axios";

/**
 * Reusable GET request function
 * @param url - The endpoint to make the GET request to
 * @param config
 * @returns The response data
 */
export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await api.get<T>(url, config); // Pass the config to axios
    return response.data;
  } catch (error) {
    console.error("Error making GET request:", error);
    throw error;
  }
};

/**
 * Reusable POST request function
 * @param url - The endpoint to make the POST request to
 * @param data - The data to send in the request body
 * @param config - Optional configuration object for the request
 * @returns The response data
 */
export const post = async <T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await api.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    console.error("Error making POST request:", error);
    throw error;
  }
};

/**
 * Reusable PUT request function
 * @param url - The endpoint to make the PUT request to
 * @param data - The data to send in the request body
 * @param config - Optional configuration object for the request
 * @returns The response data
 */
export const put = async <T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await api.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    console.error("Error making PUT request:", error);
    throw error;
  }
};

/**
 * Reusable DELETE request function
 * @param url - The endpoint to make the DELETE request to
 * @param config - Optional configuration object for the request
 * @returns The response data
 */
export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await api.delete<T>(url, config);
    return response.data;
  } catch (error) {
    console.error("Error making DELETE request:", error);
    throw error;
  }
};
