export const environment = {
  // ✅ برای json-server (بدون /api)
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  
  // ❌ اگر از ASP.NET Core استفاده می‌کنید
  // apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  appName: import.meta.env.VITE_APP_NAME || 'ERP System',
  isProduction: import.meta.env.VITE_NODE_ENV === 'production',
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableDebugTools: import.meta.env.VITE_ENABLE_DEBUG_TOOLS !== 'false',
} as const;