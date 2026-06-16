import { useMutation } from '@tanstack/react-query';
import { LoginApi } from '@/api/loginApi';
import { toast } from "sonner"
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: LoginApi.login,
    onSuccess: (data) => {
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }

      toast.success("Successfully logged in!");
      navigate('/');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || error.message || "Login failed";
      toast.error(message);
    },
  });
};
