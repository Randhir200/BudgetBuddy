import axios from "axios";
import { budgetBuddyApiUrl } from "./apiURLs";

export const getAuthToken = () => localStorage.getItem("auth-token");

export const apiClient = axios.create({
  baseURL: budgetBuddyApiUrl,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const startGoogleLogin = () => {
  window.location.href = `${budgetBuddyApiUrl}/auth/google/login`;
};

export const startGmailConnect = () => {
  const token = getAuthToken();
  if (!token) return;

  window.location.href = `${budgetBuddyApiUrl}/auth/google/connect?token=${encodeURIComponent(token)}`;
};
