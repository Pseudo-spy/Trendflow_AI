import type { Theme3DConfig } from '../types/theme';

export const themeTokens = {
  // Dark / Cinematic Mode
  dark: {
    bg: {
      void: '#030712',
      canvas: '#070C18',
      base: '#0B1120',
      surface: '#111A2E',
      surfaceRaised: '#17223B',
      surfaceElevated: '#1E2C4A',
      overlay: 'rgba(7, 12, 24, 0.85)',
      glass: 'rgba(17, 26, 46, 0.65)',
      glassHighlight: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      tertiary: '#64748B',
      muted: '#475569',
      highlight: '#38BDF8',
      inverse: '#0F172A',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.14)',
      strong: 'rgba(255, 255, 255, 0.24)',
      glowCyan: 'rgba(6, 182, 212, 0.45)',
      glowIndigo: 'rgba(99, 102, 241, 0.45)',
      glowEmerald: 'rgba(16, 185, 129, 0.45)',
      glowRose: 'rgba(244, 63, 94, 0.45)',
    },
    gradients: {
      cyanIndigo: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
      emeraldCyan: 'linear-gradient(135deg, #16A34A 0%, #06B6D4 100%)',
      indigoPurple: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
      amberRose: 'linear-gradient(135deg, #F59E0B 0%, #F43F5E 100%)',
      cardGlass: 'linear-gradient(145deg, rgba(23, 34, 59, 0.7) 0%, rgba(13, 19, 34, 0.5) 100%)',
      cardGlassHover: 'linear-gradient(145deg, rgba(30, 44, 74, 0.85) 0%, rgba(17, 26, 46, 0.65) 100%)',
    },
  },

  // Executive Light Mode
  light: {
    bg: {
      void: '#E2E8F0',
      canvas: '#F8FAFC',
      base: '#FFFFFF',
      surface: '#F1F5F9',
      surfaceRaised: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      overlay: 'rgba(248, 250, 252, 0.88)',
      glass: 'rgba(255, 255, 255, 0.75)',
      glassHighlight: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      tertiary: '#64748B',
      muted: '#94A3B8',
      highlight: '#0284C7',
      inverse: '#F8FAFC',
    },
    border: {
      subtle: 'rgba(15, 23, 42, 0.08)',
      medium: 'rgba(15, 23, 42, 0.14)',
      strong: 'rgba(15, 23, 42, 0.22)',
      glowCyan: 'rgba(6, 182, 212, 0.35)',
      glowIndigo: 'rgba(99, 102, 241, 0.35)',
      glowEmerald: 'rgba(16, 185, 129, 0.35)',
      glowRose: 'rgba(244, 63, 94, 0.35)',
    },
    gradients: {
      cyanIndigo: 'linear-gradient(135deg, #0284C7 0%, #4F46E5 100%)',
      emeraldCyan: 'linear-gradient(135deg, #15803D 0%, #0284C7 100%)',
      indigoPurple: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
      amberRose: 'linear-gradient(135deg, #D97706 0%, #E11D48 100%)',
      cardGlass: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%)',
      cardGlassHover: 'linear-gradient(145deg, rgba(255, 255, 255, 1.0) 0%, rgba(248, 250, 252, 0.95) 100%)',
    },
  },

  // Brand Accents
  brand: {
    cyan: '#06B6D4',
    cyanGlow: 'rgba(6, 182, 212, 0.45)',
    indigo: '#6366F1',
    indigoGlow: 'rgba(99, 102, 241, 0.45)',
    emerald: '#16A34A',
    emeraldGlow: 'rgba(16, 185, 129, 0.45)',
    amber: '#F59E0B',
    amberGlow: 'rgba(245, 158, 11, 0.45)',
    rose: '#F43F5E',
    roseGlow: 'rgba(244, 63, 94, 0.45)',
    purple: '#A855F7',
    purpleGlow: 'rgba(168, 85, 247, 0.45)',
  },

  // 3D Scene Configs for Dark vs Light
  scene3D: {
    dark: {
      bgColor: '#070C18',
      gridPrimary: '#06B6D4',
      gridSecondary: '#1E293B',
      ambientColor: '#0B1120',
      ambientIntensity: 0.6,
      keyLightColor: '#F8FAFC',
      keyLightIntensity: 1.2,
      rimLightColor: '#6366F1',
      rimLightIntensity: 2.2,
      nodeEmissiveMultiplier: 1.0,
      particleOpacity: 0.7,
      fogColor: '#070C18',
      fogNear: 15,
      fogFar: 45,
    } as Theme3DConfig,

    light: {
      bgColor: '#F1F5F9',
      gridPrimary: '#0284C7',
      gridSecondary: '#CBD5E1',
      ambientColor: '#E2E8F0',
      ambientIntensity: 1.1,
      keyLightColor: '#FFFFFF',
      keyLightIntensity: 1.6,
      rimLightColor: '#4F46E5',
      rimLightIntensity: 1.0,
      nodeEmissiveMultiplier: 0.45,
      particleOpacity: 0.45,
      fogColor: '#F1F5F9',
      fogNear: 18,
      fogFar: 50,
    } as Theme3DConfig,

    cinematic: {
      bgColor: '#050914',
      gridPrimary: '#06B6D4',
      gridSecondary: '#111827',
      ambientColor: '#030712',
      ambientIntensity: 0.4,
      keyLightColor: '#38BDF8',
      keyLightIntensity: 1.5,
      rimLightColor: '#A855F7',
      rimLightIntensity: 2.8,
      nodeEmissiveMultiplier: 1.3,
      particleOpacity: 0.85,
      fogColor: '#050914',
      fogNear: 12,
      fogFar: 40,
    } as Theme3DConfig,
  },

  typography: {
    fontSans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'JetBrains Mono', 'Fira Code', monospace",
  },
} as const;

export type ThemeTokens = typeof themeTokens;
