import { createClient } from "@supabase/supabase-js";

/*
  Lấy thông tin kết nối từ biến môi trường.
  - Khi chạy ở máy: đặt trong file .env (xem .env.example)
  - Khi deploy Netlify: đặt trong mục Environment variables
  Nếu CHƯA cấu hình, app vẫn chạy được và tự lưu vào localStorage
  của trình duyệt (xem src/lib/storage.js).
*/
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null;
