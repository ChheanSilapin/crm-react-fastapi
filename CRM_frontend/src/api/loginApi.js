import { LoginResponse, MeResponse } from "@/types/login";
import api from "./api";

export const LoginApi = {
  login: async (data) => {
    const response = await api.post("/api/v1/login", data);
    return LoginResponse.parse(response.data);
  },
  getMe: async () => {
    const response = await api.get("/api/v1/me");
    return MeResponse.parse(response.data);
  }
};