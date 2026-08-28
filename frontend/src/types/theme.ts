import type { ReactNode } from 'react';
import type { ThemeTokens } from '../theme/tokens';

export type ThemeMode = 'dark' | 'light' | 'cinematic';

export interface Theme3DConfig {
  bgColor: string;
  gridPrimary: string;
  gridSecondary: string;
  ambientColor: string;
  ambientIntensity: number;
  keyLightColor: string;
  keyLightIntensity: number;
  rimLightColor: string;
  rimLightIntensity: number;
  nodeEmissiveMultiplier: number;
  particleOpacity: number;
  fogColor: string;
  fogNear: number;
  fogFar: number;
}

export interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  is3DEnabled: boolean;
  setIs3DEnabled: (enabled: boolean) => void;
  performanceMode: boolean;
  setPerformanceMode: (perf: boolean) => void;
  cameraParallax: boolean;
  setCameraParallax: (parallax: boolean) => void;
  tokens: ThemeTokens;
  theme3D: Theme3DConfig;
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}
