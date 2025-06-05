import { APIResponse, LoginResponse } from "../types/apiTypes";
import apiClient from "./apiClient";

export const apiLogin = async (
  username: string,
  encodedPassword: string
): Promise<APIResponse<LoginResponse>> => {
  try {
    const response = await apiClient.post("/login", {
      email: username,
      password: encodedPassword
    });
    return { success: true, results: response.data };
  } catch (error) {
    return { success: false, errorMessage: String(error) };
  }
};
