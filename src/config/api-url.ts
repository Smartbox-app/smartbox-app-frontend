export const getApiBaseUrl = () =>
  typeof import.meta.env.VITE_APP_API_URL === 'string'
    ? `${import.meta.env.VITE_APP_API_URL.trim()}/`
    : 'http://localhost:3001/';
