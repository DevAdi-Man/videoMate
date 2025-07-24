// src/services/rapidApi.js
import axios from "axios";

export const rapidApi = axios.create({
  baseURL: "https://youtube138.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
    "X-RapidAPI-Host": "youtube138.p.rapidapi.com",
  },
});
