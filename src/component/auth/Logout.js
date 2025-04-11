import { useEffect, useState } from "react";
import axiosInstance from "../../Axios";
import { useNavigate } from "react-router-dom";
import DefaultProgress from "../progress/Default";

export const Logout = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await axiosInstance.post("/users/logout/", {}, {
                    withCredentials: true
                });

                window.location.href = '/login';

            } catch (err) {
                navigate("/login", { replace: true });
            }
        };

        logoutUser();
    }, [navigate]);

    return (
        <div className="logout-container">
            {error ? (
                <div className="error-message">{error}</div>
            ) : (
                <DefaultProgress sx={{width:'100%', height:'100vh', display:'flex'}} />
            )}
        </div>
    );
};
