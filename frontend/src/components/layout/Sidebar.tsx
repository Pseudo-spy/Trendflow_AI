import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  TrendingUp,
  Boxes,
  Cpu,
  Truck,
  ShieldAlert,
  GitFork,
  Layers,
  Compass,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { name: 'Demand Planning', path: '/demand-planning', icon: <TrendingUp size={18} />, badge: 'AI' },
  { name: 'S&OP Planning', path: '/sop', icon: <Boxes size={18} /> },
  { name: 'Procurement', path: '/procurement', icon: <Cpu size={18} />, badge: 'MILP' },
  { name: 'Suppliers', path: '/suppliers', icon: <Truck size={18} /> },
  { name: 'Risk Analysis', path: '/risk', icon: <ShieldAlert size={18} />, badge: 'Radar' },
  { name: 'Scenarios', path: '/scenarios', icon: <GitFork size={18} /> },
  { name: 'Platform Overview', path: '/home', icon: <Compass size={18} /> },
];

const SidebarItem: React.FC<{ item: NavItem; isLight: boolean; onClick?: () => void }> = ({ item, isLight, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: isActive ? 700 : 500,
        color: isActive ? '#FFFFFF' : isLight ? '#475569' : '#86A795',
        background: isActive
          ? '#16A34A'
          : (isHovered ? (isLight ? '#F1F5F9' : '#1A241E') : 'transparent'),
        border: isActive
          ? '1px solid #15803D'
          : '1px solid transparent',
        boxShadow: isActive ? '0 1px 3px rgba(22, 163, 74, 0.4)' : 'none',
        position: 'relative',
        transition: 'all 0.2s ease',
      })}
    >
      {({ isActive }) => (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                color: isActive ? '#FFFFFF' : isLight ? '#64748B' : (isHovered ? '#22C55E' : '#86A795'),
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s',
              }}
            >
              {item.icon}
            </span>
            <span>{item.name}</span>
          </div>

          {item.badge && (
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                background: isLight ? '#F0FDF4' : '#07150E',
                color: item.badge === 'AI' ? '#16A34A' : item.badge === 'MILP' ? '#06B6D4' : '#F59E0B',
                border: isLight ? '1px solid #BBF7D0' : '1px solid #1B3B2B',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isTablet?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isTablet }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className="glass-sidebar"
      style={{
        width: '270px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: isTablet ? 'fixed' : 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        backgroundColor: isLight ? '#FFFFFF' : '#0F1511',
        borderRight: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
        transform: isTablet ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      {/* Product Brand Header */}
      <NavLink
        to="/dashboard"
        style={{
          padding: '22px 20px',
          borderBottom: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(16, 185, 129, 0.45)',
            flexShrink: 0,
          }}
        >
          <Layers size={21} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 900,
                color: isLight ? '#064E3B' : '#F0FDF4',
                letterSpacing: '-0.02em',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              TRENDFLOW AI
            </span>
          </div>
          <p
            style={{
              fontSize: '10px',
              color: isLight ? '#15803D' : '#86A795',
              marginTop: '1px',
              fontWeight: 600,
              lineHeight: '1.2',
            }}
          >
            Integrated S&OP + Procurement
          </p>
        </div>
      </NavLink>

      {/* Navigation Links */}
      <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: isLight ? '#15803D' : '#4E6E5C',
            padding: '0 8px 8px 8px',
          }}
        >
          Planning Suite
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <SidebarItem key={item.path} item={item} isLight={isLight} onClick={isTablet ? onClose : undefined} />
          ))}
        </nav>
      </div>

      {/* Footer System Status & Logout */}
      <div
        style={{
          padding: '16px',
          borderTop: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
          background: isLight ? '#F0FDF4' : '#0A0E0C',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '10px',
            background: isLight ? '#FFFFFF' : '#07120C',
            border: isLight ? '1px solid #A7F3D0' : '1px solid #162E20',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                boxShadow: '0 0 8px #16A34A',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 700, color: isLight ? '#064E3B' : '#F0FDF4' }}>
              Spatial Engine Live
            </span>
          </div>
          <p style={{ fontSize: '10px', color: isLight ? '#15803D' : '#86A795', marginTop: '2px' }}>
            WebGL 2.0 • 60 FPS • 9 Nodes
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            background: isLight ? '#FEE2E2' : '#140608',
            border: isLight ? '1px solid #FECACA' : '1px solid #4D161E',
            color: '#F87171',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
