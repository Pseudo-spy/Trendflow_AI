import React, { createContext, useState, useEffect } from 'react';
import { themeTokens } from './tokens';
import type { ThemeContextType, ThemeMode, ThemeProviderProps } from '../types/theme';

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'cinematic',
  setMode: () => {},
  toggleTheme: () => {},
  is3DEnabled: true,
  setIs3DEnabled: () => {},
  performanceMode: false,
  setPerformanceMode: () => {},
  cameraParallax: true,
  setCameraParallax: () => {},
  tokens: themeTokens,
  theme3D: themeTokens.scene3D.cinematic,
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'cinematic',
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('tw_theme_mode');
    return (saved as ThemeMode) || defaultMode;
  });

  const [is3DEnabled, setIs3DEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('tw_3d_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [performanceMode, setPerformanceMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('tw_perf_mode');
    return saved !== null ? saved === 'true' : false;
  });

  const [cameraParallax, setCameraParallax] = useState<boolean>(() => {
    const saved = localStorage.getItem('tw_cam_parallax');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('tw_theme_mode', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('tw_3d_enabled', String(is3DEnabled));
  }, [is3DEnabled]);

  useEffect(() => {
    localStorage.setItem('tw_perf_mode', String(performanceMode));
  }, [performanceMode]);

  useEffect(() => {
    localStorage.setItem('tw_cam_parallax', String(cameraParallax));
  }, [cameraParallax]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'cinematic' : prev === 'cinematic' ? 'dark' : 'light'));
  };

  const current3D = themeTokens.scene3D[mode] || themeTokens.scene3D.cinematic;

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        toggleTheme,
        is3DEnabled,
        setIs3DEnabled,
        performanceMode,
        setPerformanceMode,
        cameraParallax,
        setCameraParallax,
        tokens: themeTokens,
        theme3D: current3D,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
