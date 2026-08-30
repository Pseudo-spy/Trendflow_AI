import React, { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  TrendingUp,
  Boxes,
  PackageSearch,
  Cpu,
  Truck,
  ShieldAlert,
  GitFork,
  Layers,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { name: 'Demand Planning', path: '/demand-planning', icon: <TrendingUp size={18} /> },
  { name: 'S&OP Planning', path: '/sop', icon: <Boxes size={18} /> },
  { name: 'Inventory View', path: '/inventory', icon: <PackageSearch size={18} /> },
  { name: 'Procurement', path: '/procurement', icon: <Cpu size={18} /> },
  { name: 'Suppliers', path: '/suppliers', icon: <Truck size={18} /> },
  { name: 'Risk Analysis', path: '/risk', icon: <ShieldAlert size={18} /> },
  { name: 'Scenarios', path: '/scenarios', icon: <GitFork size={18} /> },
];

const SidebarItem: React.FC<{ item: NavItem; isLight: boolean; onClick?: () => void; isExpanded: boolean }> = ({ item, isLight, onClick, isExpanded }) => {
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
        padding: '10px 12px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: isActive ? 700 : 500,
        color: isActive ? '#FFFFFF' : isLight ? '#475569' : '#86A795',
        background: isExpanded
          ? (isActive
            ? (isHovered ? 'linear-gradient(135deg, #14532D 0%, #064E3B 100%)' : 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)')
            : (isHovered ? (isLight ? '#F1F5F9' : '#1A241E') : 'transparent'))
          : 'transparent',
        border: (isExpanded && isActive)
          ? (isHovered ? '1px solid #14532D' : '1px solid #22C55E')
          : '1px solid transparent',
        boxShadow: (isExpanded && isActive) ? (isHovered ? 'none' : '0 0 10px rgba(22, 163, 74, 0.25)') : 'none',
        position: 'relative',
        transition: 'all 0.2s ease',
        justifyContent: isExpanded ? 'flex-start' : 'center',
      })}
    >
      {({ isActive }) => (
        <>
          {/* Active indicator for collapsed state */}
          {!isExpanded && isActive && (
            <div style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '4px',
              height: '24px',
              backgroundColor: '#22C55E',
              borderRadius: '0 4px 4px 0',
              boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)'
            }} />
          )}
          {/* Active indicator for expanded state */}
          {isExpanded && isActive && (
            <div style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '3px',
              height: '16px',
              backgroundColor: '#4ADE80',
              borderRadius: '0 4px 4px 0',
            }} />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: isExpanded ? 'flex-start' : 'center' }}>
            <span
              style={{
                color: isActive ? (isExpanded ? '#FFFFFF' : '#22C55E') : isLight ? '#64748B' : (isHovered ? '#22C55E' : '#86A795'),
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                transform: isHovered && isExpanded ? 'translateX(3px)' : 'translateX(0)',
                filter: isHovered ? 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))' : 'none',
              }}
            >
              {item.icon}
            </span>
            <span style={{
              opacity: isExpanded ? 1 : 0,
              width: isExpanded ? 'auto' : 0,
              transform: isExpanded ? 'translateX(0)' : 'translateX(-10px)',
              transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}>
              {item.name}
            </span>
          </div>
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

  const [isHoveredDesktop, setIsHoveredDesktop] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isExpanded = !!(isTablet ? true : (isHoveredDesktop || (isOpen && isTablet))); // On desktop tablet fallback isn't needed, but keep logic sane
  const sidebarWidth = isTablet ? '270px' : (isExpanded ? '270px' : '74px');

  const handleMouseEnter = () => {
    if (isTablet) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHoveredDesktop(true);
  };

  const handleMouseLeave = () => {
    if (isTablet) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoveredDesktop(false);
    }, 200);
  };

  const handleFocus = () => {
    if (isTablet) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHoveredDesktop(true);
  };

  const handleBlur = () => {
    if (isTablet) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoveredDesktop(false);
    }, 200);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside
      className="glass-sidebar"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{
        width: sidebarWidth,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        backgroundColor: isLight ? '#FFFFFF' : '#0F1511',
        borderRight: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
        transform: isTablet ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        transition: 'width 0.3s cubic-bezier(0.22, 1, 0.36, 1), transform 0.3s ease-in-out',
        overflow: 'hidden',
      }}
    >
      {/* Product Brand Header */}
      <NavLink
        to="/dashboard"
        style={{
          height: '68px',
          boxSizing: 'border-box',
          padding: isExpanded ? '0 20px' : '0 18px',
          borderBottom: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
          transition: 'padding 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
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
        <div style={{
            opacity: isExpanded ? 1 : 0,
            width: isExpanded ? 'auto' : 0,
            transform: isExpanded ? 'translateX(0)' : 'translateX(-10px)',
            transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
        }}>
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
      <div style={{ flex: 1, padding: isExpanded ? '16px 12px' : '16px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: isLight ? '#15803D' : '#4E6E5C',
            padding: '0 8px 8px 8px',
            opacity: isExpanded ? 1 : 0,
            height: isExpanded ? 'auto' : 0,
            overflow: 'hidden',
            transition: 'opacity 0.25s',
            whiteSpace: 'nowrap'
          }}
        >
          Planning Suite
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <SidebarItem key={item.path} item={item} isLight={isLight} onClick={isTablet ? onClose : undefined} isExpanded={isExpanded} />
          ))}
        </nav>
      </div>

      {/* Footer System Status & Logout */}
      <div
        style={{
          padding: isExpanded ? '16px' : '16px 8px',
          borderTop: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
          background: isLight ? '#F0FDF4' : '#0A0E0C',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          transition: 'padding 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          style={{
            padding: isExpanded ? '10px 12px' : '10px',
            borderRadius: '10px',
            background: isLight ? '#FFFFFF' : '#07120C',
            border: isLight ? '1px solid #A7F3D0' : '1px solid #162E20',
            display: 'flex',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
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
                flexShrink: 0,
              }}
            />
            <div style={{
                display: isExpanded ? 'block' : 'none',
                whiteSpace: 'nowrap'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: isLight ? '#064E3B' : '#F0FDF4' }}>
                Spatial Engine Live
              </span>
              <p style={{ fontSize: '10px', color: isLight ? '#15803D' : '#86A795', marginTop: '2px' }}>
                WebGL 2.0 • 60 FPS • 9 Nodes
              </p>
            </div>
          </div>
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
            padding: isExpanded ? '8px 12px' : '8px 0',
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
          <span style={{
            opacity: isExpanded ? 1 : 0,
            width: isExpanded ? 'auto' : 0,
            overflow: 'hidden',
            transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
            whiteSpace: 'nowrap'
          }}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
