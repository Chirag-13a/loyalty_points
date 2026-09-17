import React from 'react';
import { Coffee, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function StaffProfile() { const navigate = useNavigate(); const user = JSON.parse(localStorage.getItem('loyalty_user') || '{}'); function logout() { localStorage.clear(); navigate('/login'); } return <div className="page-width app-page staff-profile"><Link to="/dashboard" className="back-link">← Back to dashboard</Link><div className="staff-card"><div className="staff-avatar">{user.name?.slice(0, 1) || 'S'}</div><span className="eyebrow">STAFF PROFILE</span><h1>{user.name || 'Staff member'}</h1><p>{user.email || 'No email saved'}</p><div className="staff-role">{user.role || 'staff'} account</div><button className="button dark" onClick={logout}><LogOut size={16} /> Sign out of the desk</button></div><div className="staff-note"><Coffee size={20} /><span>Thanks for keeping the regulars close.</span></div></div>; }
