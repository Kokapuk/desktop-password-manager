import { WebContents } from 'electron';

export interface Settings {
  size: [number, number];
  isMaximized: boolean;
}

export class LocalStorageUnavailableError extends Error {
  constructor() {
    super(
      'Both webContents and localStorage are unavailable. Provide either webContents or ensure that localStorage is accessible to use this function.'
    );
    this.name = this.constructor.name;
  }
}

export const getDefaultSettings = (): Settings => ({ size: [1200, 700], isMaximized: false });

export const setSettings = (settings: Partial<Settings>, webContents?: WebContents) => {
  const newSettings: Settings = { ...getDefaultSettings(), ...settings };

  if (webContents) {
    webContents.executeJavaScript(`localStorage.setItem('windowState', '${JSON.stringify(newSettings)}')`);
    return;
  } else if (typeof localStorage !== 'undefined') {
    localStorage.setItem('windowState', JSON.stringify(newSettings));
    return;
  }

  throw new LocalStorageUnavailableError();
};

export const getSettings = async (webContents?: WebContents) => {
  let stringSettings: string | null = null;

  if (webContents) {
    stringSettings = await webContents.executeJavaScript(`localStorage.getItem('windowState')`);
  } else if (typeof localStorage !== 'undefined') {
    stringSettings = localStorage.getItem('windowState');
  } else {
    throw new LocalStorageUnavailableError();
  }

  if (!stringSettings) {
    return getDefaultSettings();
  }

  try {
    const settings: Settings = JSON.parse(stringSettings);
    return settings;
  } catch (_) {
    return getDefaultSettings();
  }
};
