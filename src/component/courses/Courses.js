import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const Courses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(()=>{
    if(location.pathname === '/courses') {
      navigate('/dashboard');
    }
  },[])
  return (
    <div className='text-danger'>Courses</div>
  )
}
