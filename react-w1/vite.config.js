import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 直接寫入你的 Repository 名稱，前後加上斜線
  base: '/react-training-chapter-2025/react-w1/',
  plugins: [react()],
})