import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Logout() { const navigate = useNavigate(); useEffect(() => { localStorage.clear(); navigate('/login', { replace: true }); }, [navigate]); return <div className="loading">Signing you out...</div>; }
