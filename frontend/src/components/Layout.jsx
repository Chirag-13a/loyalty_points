import { Link, NavLink, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/rewards', label: 'Rewards' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/members', label: 'Members' },
];

export function Layout({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('staffUser');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAF3E8] text-[#3E2723]">
      <header className="border-b border-[#e9dac6] bg-[#fffaf3]">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="text-xl font-bold">☕ Café Loyalty Points</Link>
          <div className="flex flex-wrap items-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium ${
                    isActive ? 'bg-[#C97B4A] text-white' : 'hover:bg-[#f3e3d2]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className="rounded-full px-4 py-2 text-sm font-medium hover:bg-[#f3e3d2]">Login</NavLink>
                <NavLink to="/register" className="rounded-full bg-[#C97B4A] px-4 py-2 text-sm font-medium text-white">Register</NavLink>
              </>
            ) : (
              <button type="button" onClick={logout} className="rounded-full bg-[#3E2723] px-4 py-2 text-sm font-medium text-white">Logout</button>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
