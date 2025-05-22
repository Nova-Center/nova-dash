import axios from "axios";
import { getSession } from "next-auth/react";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  console.log("🚀 Requête API:", {
    url: `${config.baseURL || ""}${config.url || ""}`,
    method: config.method,
    data: config.data,
  });

  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Log des réponses
api.interceptors.response.use(
  (response) => {
    console.log("✅ Réponse API:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ Erreur API:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default api;
