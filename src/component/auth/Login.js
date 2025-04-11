import React, { useState } from 'react';
import './auth.css';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logos/1.png';
import axiosInstance from '../../Axios';
import { useSnackbar } from "notistack";
import CustomLinearProgress from '../progress/LinerProgress';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import { Helmet } from 'react-helmet';

export const Login = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleClickVariant = (msg, variant) => {
    enqueueSnackbar(msg, {
      variant,
      anchorOrigin: { vertical: "top", horizontal: "right" }
    });
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return "البريد الإلكتروني مطلوب";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) return "البريد الإلكتروني غير صالح";
        return "";
      case 'password':
        if (!value.trim()) return "كلمة المرور مطلوبة";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    // فورًا نتحقق من صحة الحقل عند التغيير
    const errorMsg = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const isFormValid = () => {
    const errors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setFormErrors(errors);

    return !errors.email && !errors.password;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      sendForm();
    } else {
      handleClickVariant("يرجى تصحيح الأخطاء قبل المتابعة", "error");
    }
  };

  const sendForm = () => {
    setLoading(true);
    axiosInstance
      .post('/users/token/', formData)
      .then((res) => {
        handleClickVariant('تم تسجيل الدخول بنجاح', 'success');
        navigate('/dashboard');
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 400) {
          handleClickVariant('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
        } else if (err.response?.data?.error) {
          handleClickVariant(err.response.data.error, 'error');
        } else {
          handleClickVariant('حدث خطأ غير متوقع', 'error');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Helmet>
        <title>Engineering Sozy | تسجيل الدخول</title>
      </Helmet>

      <CustomLinearProgress loading={loading} />

      <div className='login-page d-flex flex-column gap-0'>
        <img className='p-0' src={Logo} alt="App Logo" style={{ width: 150, marginTop: 5 }} />
        <h3 className='mb-5 fw-bold'>تسجيل الدخول</h3>
        <form onSubmit={submitForm} className="auth-form">
          
          {/* البريد الإلكتروني */}
          <div className="flex-column mb-2">
            <label>البريد الإلكتروني</label>
          </div>
          <div className="inputForm mb-1">
            <AlternateEmailIcon />
            <input
              name="email"
              type="email"
              placeholder="ادخل البريد الإلكتروني"
              className="input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {formErrors.email && <p className='text-danger'>{formErrors.email}</p>}

          {/* كلمة المرور */}
          <div className="flex-column mb-2 mt-3">
            <label>كلمة المرور</label>
          </div>
          <div className="inputForm mb-1">
            <HttpsOutlinedIcon />
            <input
              name="password"
              type="password"
              placeholder="ادخل كلمة المرور"
              className="input"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {formErrors.password && <p className='text-danger'>{formErrors.password}</p>}

          <button className="button-submit" disabled={loading}>
            {loading ? "جارٍ تسجيل الدخول..." : "تسجيل"}
          </button>

          <p className="p">
            لا امتلك حساب؟ <span className="span"><Link to='/register'>تسجيل حساب جديد</Link></span>
          </p>
        </form>
      </div>
    </>
  );
};
