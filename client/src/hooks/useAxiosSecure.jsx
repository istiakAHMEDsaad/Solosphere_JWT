import axios from 'axios';
import useAuth from './useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export const axioSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const navigate = useNavigate()  
  const { logOut } = useAuth();
  useEffect(()=>{
    axioSecure.interceptors.response.use(
      (res)=>{
        return res;
      },
      async(error)=>{
        if(error.response.status === 401 || error.response.status === 403){
          //logout
          logOut();
          //navigate
          navigate('/login')
        }
      }
    )
  },[logOut, navigate])

  return axioSecure
};

export default useAxiosSecure;
