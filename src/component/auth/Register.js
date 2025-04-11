import React, { useState } from 'react';
import './auth.css';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logos/1.png';
import { useSnackbar } from 'notistack';
import CustomLinearProgress from '../progress/LinerProgress';
import axiosInstance from '../../Axios';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import { Helmet } from 'react-helmet';

export const Register = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [formErrors, setFormErrors] = useState({
    full_name: "",
    email: "",
    password: "",
    password2: "",
  });

  const handleClickVariant = (msg, variant) => {
    enqueueSnackbar(msg, {
      variant,
      anchorOrigin: { vertical: "top", horizontal: "right" }
    });
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'full_name':
        return value.trim().length < 3 ? "الاسم بالكامل يجب أن يكون 3 أحرف على الأقل" : "";
      case 'email':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return !emailRegex.test(value) ? "البريد الإلكتروني غير صالح" : "";
      case 'password':
        return value.length < 8 ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" : "";
      case 'password2':
        return value !== formData.password ? "كلمات المرور غير متطابقة" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
      ...(name === 'password' && {
        password2: validateField('password2', formData.password2),
      }),
    }));
  };

  const isFormValid = () => {
    const newErrors = {};
    for (let key in formData) {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) newErrors[key] = errorMsg;
    }

    setFormErrors({
      full_name: newErrors.full_name || "",
      email: newErrors.email || "",
      password: newErrors.password || "",
      password2: newErrors.password2 || "",
    });

    return Object.keys(newErrors).length === 0;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      sendForm();
    } else {
      handleClickVariant('من فضلك صحح الأخطاء في النموذج', 'error');
    }
  };

  const sendForm = () => {
    setLoading(true);
    axiosInstance.post('/users/register/', formData)
      .then(() => {
        handleClickVariant('تم إنشاء الحساب بنجاح', 'success');
        navigate('/login');
      })
      .catch((err) => {
        if (err.response?.data) {
          const serverErrors = err.response.data;
          const newErrors = { ...formErrors };

          for (let key in serverErrors) {
            if (newErrors[key] !== undefined) {
              newErrors[key] = serverErrors[key][0];
            }
          }

          setFormErrors(newErrors);

          if (serverErrors.non_field_errors) {
            handleClickVariant(serverErrors.non_field_errors[0], 'error');
          }
        }

        if (err.response?.status === 400 || err.response?.status === 401) {
          handleClickVariant('لم يتم إنشاء الحساب راجع بياناتك', 'error');
        } else {
          handleClickVariant('لقد حدث خطأ', 'error');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Helmet>
        <title>Engineering Sozy | تسجيل حساب جديد</title>
      </Helmet>
      <CustomLinearProgress loading={loading} />
      <div className='register-page d-flex flex-column gap-0'>
        <img className='p-0' src={Logo} alt="App Logo" style={{ width: 150, marginTop: 5 }} />
        <h3 className='mb-5 fw-bold'>تسجيل حساب جديد</h3>
        <form onSubmit={submitForm} className="auth-form">
          {['full_name', 'email', 'password', 'password2'].map((field, index) => (
            <div key={index}>
              <div className="flex-column mb-2">
                <label>
                  {field === 'full_name' ? 'الإسم بالكامل' :
                    field === 'email' ? 'البريد الإلكتروني' :
                      field === 'password' ? 'كلمة المرور' : 'تأكيد كلمة المرور'}
                </label>
              </div>
              <div className="inputForm mb-1">
                {
                  field === 'email' ? <AlternateEmailIcon /> :
                    (field === 'password' || field === 'password2') ? <HttpsOutlinedIcon /> :
                      <PersonOutlineOutlinedIcon />
                }
                <input
                  onChange={handleChange}
                  placeholder={
                    field === 'full_name' ? 'ادخل اسمك' :
                      field === 'email' ? 'ادخل البريد الإلكتروني' :
                        'ادخل كلمة المرور'
                  }
                  className="input"
                  type={field.includes('password') ? 'password' : 'text'}
                  name={field}
                  value={formData[field]}
                />
              </div>
              {formErrors[field] && <p className='text-danger'>{formErrors[field]}</p>}
            </div>
          ))}
          <button className="button-submit" disabled={loading}>
            {loading ? 'جارٍ التسجيل...' : 'إشتراك'}
          </button>
          <p className="p">
            امتلك حساب بالفعل؟ <span className="span"><Link to='/login'>تسجيل الدخول</Link></span>
          </p>
        </form>
      </div>
    </>
  );
};
