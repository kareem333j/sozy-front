import React, { useContext, useEffect, useState } from 'react'
import { DashboardPageUser } from './DashboardPageUser'
import { AuthContext } from '../../context/AuthContext';
import { DashboardPageAdmin } from './DashboardPageAdmin';


export const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const userData = user.user;

  if(userData.is_superuser || userData.is_staff) {
    return (
      <DashboardPageAdmin />
    )
  }
  return (
    <DashboardPageUser />
  )
}