import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import MemberProfile from './pages/MemberProfile';
import Rewards from './pages/Rewards';
import Redeem from './pages/Redeem';
import NotFound from './pages/NotFound';
import Catalog from './pages/Catalog';
import StaffProfile from './pages/StaffProfile';
import Logout from './pages/Logout';
import { ToastProvider } from './components/ToastContext';
import MemberLayout from './components/MemberLayout';
import ProtectedMemberRoute from './components/ProtectedMemberRoute';
import MemberLogin from './pages/MemberLogin';
import MemberRegister from './pages/MemberRegister';
import MemberHome from './pages/MemberHome';
import MemberRedeem from './pages/MemberRedeem';
import MemberOffers from './pages/MemberOffers';
import MemberAbout from './pages/MemberAbout';
import MemberVisits from './pages/MemberVisits';
import MemberMenu from './pages/MemberMenu';
import MemberAccountProfile from './pages/MemberAccountProfile';
import StaffLogin from './pages/StaffLogin';
import StaffRegister from './pages/StaffRegister';

function StaffPortal() { return <Layout><Routes><Route path="login" element={<StaffLogin />} /><Route path="register" element={<StaffRegister />} /><Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /><Route path="members" element={<ProtectedRoute><Members /></ProtectedRoute>} /><Route path="members/:id" element={<ProtectedRoute><MemberProfile /></ProtectedRoute>} /><Route path="redeem" element={<ProtectedRoute><Redeem /></ProtectedRoute>} /><Route path="menu-manage" element={<ProtectedRoute><Catalog /></ProtectedRoute>} /><Route path="rewards-manage" element={<ProtectedRoute><Catalog /></ProtectedRoute>} /><Route path="profile" element={<ProtectedRoute><StaffProfile /></ProtectedRoute>} /><Route path="logout" element={<Logout />} /><Route path="*" element={<StaffLogin />} /></Routes></Layout>; }

function MemberPortal() { return <MemberLayout><Routes><Route path="login" element={<MemberLogin />} /><Route path="register" element={<MemberRegister />} /><Route path="home" element={<ProtectedMemberRoute><MemberHome /></ProtectedMemberRoute>} /><Route path="redeem" element={<ProtectedMemberRoute><MemberRedeem /></ProtectedMemberRoute>} /><Route path="rewards" element={<ProtectedMemberRoute><MemberRedeem /></ProtectedMemberRoute>} /><Route path="visits" element={<ProtectedMemberRoute><MemberVisits /></ProtectedMemberRoute>} /><Route path="menu" element={<ProtectedMemberRoute><MemberMenu /></ProtectedMemberRoute>} /><Route path="offers" element={<ProtectedMemberRoute><MemberOffers /></ProtectedMemberRoute>} /><Route path="about" element={<ProtectedMemberRoute><MemberAbout /></ProtectedMemberRoute>} /><Route path="profile" element={<ProtectedMemberRoute><MemberAccountProfile /></ProtectedMemberRoute>} /><Route path="*" element={<MemberLogin />} /></Routes></MemberLayout>; }

export default function App() {
  return <BrowserRouter><ToastProvider><Routes><Route path="/staff/*" element={<StaffPortal />} /><Route path="/member/*" element={<MemberPortal />} /><Route path="*" element={<Layout><Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/rewards" element={<Rewards />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/redeem" element={<ProtectedRoute><Redeem /></ProtectedRoute>} />
    <Route path="/catalog" element={<ProtectedRoute><Catalog /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><StaffProfile /></ProtectedRoute>} />
    <Route path="/logout" element={<Logout />} />
    <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
    <Route path="/members/:id" element={<ProtectedRoute><MemberProfile /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes></Layout>} /></Routes></ToastProvider></BrowserRouter>;
}