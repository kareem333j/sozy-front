import axios from 'axios';
import { createBrowserHistory } from 'history';

// export const baseURL = "https://engineeringsozy.vercel.app";
export const baseURL = "https://api.engineeringsozy.com";
const history = createBrowserHistory();
const publicPaths = ["/", "/login", "/register"];

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
    },
    withCredentials: true,
});


// Request interceptor
// axiosInstance.interceptors.request.use(
//     (config) => {
//         let fullUrl = config.url.startsWith('http') ? config.url : config.baseURL + config.url;
//         const path = new URL(fullUrl).pathname;

//         config.withCredentials = !publicPaths.includes(path);
//         return config;
//     },
//     (error) => {
//         console.error('Request error:', error);
//         return Promise.reject(error);
//     }
// );
axiosInstance.interceptors.request.use(
    (config) => {
        config.withCredentials = true;

        const csrfToken = getCookie("csrftoken");
        if (csrfToken) {
            config.headers["X-CSRFToken"] = csrfToken;
        }

        return config;
    },
    (error) => Promise.reject(error)
);



// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response || originalRequest.url.includes('/users/token/refresh/')) {
            if (!publicPaths.includes(window.location.pathname)) {
                window.location.href = '/login?session_expired=true';
            }
            return Promise.reject(error);
        }

        // حالة 401 Unauthorized
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axiosInstance.post(
                    '/users/token/refresh/',
                    {},
                    { withCredentials: true }
                );

                if (refreshResponse.status === 200) {
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error('Refresh token error:', refreshError);

                if (!publicPaths.includes(window.location.pathname)) {
                    window.location.href = '/login?session_expired=true';
                }
                return Promise.reject(refreshError);
            }
        }

        // معالجة أخطاء أخرى
        // if (error.response.status === 403) {
        //     console.error('Forbidden access:', error);
        //     if (!publicPaths.includes(window.location.pathname)) {
        //         window.location.href = '/login?unauthorized=true';
        //     }
        // }

        return Promise.reject(error);
    }
);

export default axiosInstance;