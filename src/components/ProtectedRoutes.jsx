import { useEffect, useState } from 'react';
import {RotatingTriangles} from "react-loader-spinner";
import { Navigate } from 'react-router';
import useMessage from '../hooks/useMessage';
import { adminApi } from '../service/api';
function ProtectedRoutes({children}){
    const [isAuth, setIsAuth] = useState(false);
    const [loading,setLoading] = useState(true);
    const {showError} = useMessage();
    useEffect(()=>{
        const checkLogin = async()=>{
        try {
            await adminApi.post(`/api/user/check`);
            setIsAuth(true);
        } catch (error) {
            showError(error.response?.data.message)
            setIsAuth(false);
        }finally{
            setLoading(false);
        }
    }
    checkLogin();
    },[showError]);
    if(loading) {
        return(
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 9999
        }}>
            <RotatingTriangles/>
        </div>)
    }
    if (!isAuth) return <Navigate to="/login" />;
    return children
}
export default ProtectedRoutes;