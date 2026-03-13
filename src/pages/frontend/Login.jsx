import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { emailValidition } from '../../utils/validition';
import { useNavigate } from 'react-router';
import { loginApi } from '../../service/loginApi';
import useMessage from '../../hooks/useMessage';
import { useDispatch } from 'react-redux';
import { setLoginStatus } from '../../slices/authSlice';
function Login() {
  const dispatch = useDispatch();
  const { showError } = useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    const loginData = {
      username: data.email,
      password: data.password,
    };
    try {
      const res = await loginApi(loginData);
      const { token, expired } = res.data;
      document.cookie = `onion=${token}; expires=${new Date(expired)};path=/`;
      dispatch(setLoginStatus(true));
      navigate('/admin/adminProducts');
      reset();
    } catch {
      showError('登入失敗');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div
          className="p-4 p-md-5 shadow-sm bg-white rounded-4"
          style={{ maxWidth: '450px', width: '100%' }}
        >
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-dark">管理者登入</h1>
          </div>
          <form id="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
                autoFocus
                {...register('email', emailValidition)}
              />
              <label htmlFor="username">Email address</label>
              {errors.email && (
                <div className="text-danger">{errors.email.message}</div>
              )}
            </div>
            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="password"
                {...register('password', {
                  required: '請輸入密碼',
                  minLength: {
                    value: 6,
                    message: '密碼長度至少需 6 碼',
                  },
                })}
              />
              <label htmlFor="password">Password</label>
              {errors.password && (
                <div className="text-danger">{errors.password.message}</div>
              )}
            </div>
            <button
              className="btn login-btn btn-lg w-100 py-3 fw-bold shadow-sm transition-all"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  驗證中...
                </>
              ) : (
                '立即登入'
              )}
            </button>
          </form>
          <div className="mt-5 text-center text-muted small">
            &copy; 2026~∞ <span className="fw-bold">洋蔥</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
