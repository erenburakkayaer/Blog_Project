import { useCallback, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import SiteContext from "./siteContext";

const SITE_SETTINGS_STORAGE_KEY = "uslukilic_site_settings";

const defaultSettings = {
  siteName: "Uslukılıç Yazılım",
  slogan: "Bozok Teknopark Merkezli Yazılım & Teknoloji Çözümleri",
  email: "info@uslukilicyazilim.com",
  phone: "+90 (354) 000 00 00",
  copyright: "© 2026 Uslukılıç Yazılım. Tüm hakları saklıdır.",
};

const getStoredSettings = () => {
  try {
    const stored = localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultSettings;
  } catch {
    localStorage.removeItem(SITE_SETTINGS_STORAGE_KEY);
    return defaultSettings;
  }
};

const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(getStoredSettings);

  const updateSettings = useCallback(
    (newSettings) => {
      const updated = { ...settings, ...newSettings };
      localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      setSettings(updated);
      window.dispatchEvent(new Event("siteSettingsUpdated"));
    },
    [settings],
  );

  useEffect(() => {
    const handleStorage = () => {
      setSettings(getStoredSettings());
    };
    window.addEventListener("siteSettingsUpdated", handleStorage);
    return () =>
      window.removeEventListener("siteSettingsUpdated", handleStorage);
  }, []);

  const contextValue = useMemo(
    () => ({
      settings,
      updateSettings,
    }),
    [settings, updateSettings],
  );

  return (
    <SiteContext.Provider value={contextValue}>{children}</SiteContext.Provider>
  );
};

SiteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SiteProvider;
