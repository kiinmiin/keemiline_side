const SETTINGS_STORAGE_KEY = 'chemistryApp_settings';

const VALID_LOCK_STYLES = ['strict', 'lenient', 'easy'];

export const defaultAppSettings = {
  lockStyle: 'lenient',
};

function normalizeSettings(rawSettings = {}) {
  const lockStyle = VALID_LOCK_STYLES.includes(rawSettings.lockStyle)
    ? rawSettings.lockStyle
    : defaultAppSettings.lockStyle;

  return {
    ...defaultAppSettings,
    ...rawSettings,
    lockStyle,
  };
}

export function getAppSettings() {
  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!stored) {
    return defaultAppSettings;
  }

  try {
    const parsed = JSON.parse(stored);
    return normalizeSettings(parsed);
  } catch {
    return defaultAppSettings;
  }
}

export function saveAppSettings(nextSettings) {
  const merged = normalizeSettings(nextSettings);

  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
  return merged;
}

function encodeSettings(settings) {
  const json = JSON.stringify(normalizeSettings(settings));
  return btoa(json);
}

function decodeSettings(encodedValue) {
  const json = atob(encodedValue);
  return JSON.parse(json);
}

export function buildSettingsShareUrl(settings) {
  const origin = window.location.origin;
  const encodedSettings = encodeSettings(settings);
  return `${origin}/hub?settings=${encodeURIComponent(encodedSettings)}`;
}

export function applySettingsFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const encodedSettings = params.get('settings');

  if (!encodedSettings) {
    return false;
  }

  try {
    const parsedSettings = decodeSettings(decodeURIComponent(encodedSettings));
    saveAppSettings(parsedSettings);

    params.delete('settings');
    const remainingQuery = params.toString();
    const nextUrl = `${window.location.pathname}${remainingQuery ? `?${remainingQuery}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', nextUrl);

    return true;
  } catch {
    return false;
  }
}
