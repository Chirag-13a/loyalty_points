import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => { if (!localStorage.getItem('loyalty_token')) navigate('/login'); }, [navigate]);
  return localStorage.getItem('loyalty_token') ? children : null;
}