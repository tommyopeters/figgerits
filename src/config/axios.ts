import axios from "axios";
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();

// Create an Axios instance
const axiosInstance = axios.create({
  //   baseURL: 'https://figgerits-backend-git-main-tommyopeters-projects.vercel.app', // Replace with your API base URL
  baseURL: 'http://localhost:8000',
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from cookies
    const token = cookies.get('token');
    console.log(token)

    // If the token exists, set it in the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log(error);

    // Check if the error is due to an expired token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Make a request to refresh the token
        const refreshToken = cookies.get('refreshToken'); // Assuming you have a refresh token stored
        const response = await axios.post('/refreshToken', { refreshToken });

        // Update the token in cookies
        const newToken = response.data.idToken;
        cookies.set('idToken', newToken);

        // Update the Authorization header with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle the error if the token refresh fails
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;