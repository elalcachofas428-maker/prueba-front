import { Outlet } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';

export default function AppLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <AppNavbar />
      <div style={{ paddingTop: '60px' }}>
        <Outlet />
      </div>
    </div>
  );
}
