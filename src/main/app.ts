import { is } from '@electron-toolkit/utils';
import { BrowserWindow, shell } from 'electron';
import { join } from 'path';
import icon from '../../resources/icon.png?asset';
import { getDefaultSettings, setSettings } from '../utils/settings';

const createWindow = (onWindowShow: () => void) => {
  const defaultSize = getDefaultSettings().size;

  const mainWindow = new BrowserWindow({
    width: defaultSize[0],
    height: defaultSize[1],
    minWidth: 400,
    minHeight: 400,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#1e1e1e',
      symbolColor: 'white',
      height: 30,
    },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/app.js'),
      sandbox: false,
      devTools: is.dev,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    onWindowShow();
  });

  mainWindow.on('resized', () => {
    setSettings({ isMaximized: false, size: mainWindow.getSize() as [number, number] }, mainWindow.webContents);
  });

  mainWindow.on('maximize', () => {
    setSettings({ isMaximized: true, size: defaultSize }, mainWindow.webContents);
  });

  mainWindow.on('unmaximize', () => {
    setSettings({ isMaximized: false, size: mainWindow.getSize() as [number, number] }, mainWindow.webContents);
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  mainWindow.loadURL('https://password-mngr.web.app/login');
};

export default { createWindow };
