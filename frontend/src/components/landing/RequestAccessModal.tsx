import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { GlowButton } from '../ui/GlowButton';
import { Building2, Mail, User } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestAccessModal: React.FC<RequestAccessModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const handleModalClose = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Request Enterprise Pilot Access"
      subtitle="Experience TrendFlow AI for your supply chain network"
      maxWidth="md"
    >
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC', marginBottom: '6px' }}>
            <User size={13} color="#06B6D4" /> Full Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Alex Morgan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: isLight ? '#FFFFFF' : 'rgba(11, 17, 32, 0.8)',
              border: isLight ? '1px solid rgba(15, 23, 42, 0.15)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: isLight ? '#0F172A' : '#F8FAFC',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC', marginBottom: '6px' }}>
            <Mail size={13} color="#06B6D4" /> Business Email
          </label>
          <input
            type="email"
            required
            placeholder="alex@enterprise-apparel.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: isLight ? '#FFFFFF' : 'rgba(11, 17, 32, 0.8)',
              border: isLight ? '1px solid rgba(15, 23, 42, 0.15)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: isLight ? '#0F172A' : '#F8FAFC',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC', marginBottom: '6px' }}>
            <Building2 size={13} color="#06B6D4" /> Company / SCM Organization
          </label>
          <input
            type="text"
            required
            placeholder="e.g. TrendFlow Global Retail Inc."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: isLight ? '#FFFFFF' : 'rgba(11, 17, 32, 0.8)',
              border: isLight ? '1px solid rgba(15, 23, 42, 0.15)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: isLight ? '#0F172A' : '#F8FAFC',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <GlowButton variant="ghost" size="md" type="button" onClick={handleModalClose}>
            Cancel
          </GlowButton>
          <GlowButton variant="ghost" size="md" type="button" disabled={true}>
            Backend Pending
          </GlowButton>
        </div>
      </form>
    </Modal>
  );
};
