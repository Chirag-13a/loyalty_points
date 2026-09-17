import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function ProtectedMemberRoute({ children }) { const navigate = useNavigate(); useEffect(() => { if (!localStorage.getItem('member_token')) navigate('/member/login'); }, [navigate]); return localStorage.getItem('member_token') ? children : null; }