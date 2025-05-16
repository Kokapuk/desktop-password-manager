import { is } from '@electron-toolkit/utils';
import { BrowserWindow, nativeImage, shell } from 'electron';
import { join } from 'path';
import icon from '../../../resources/icon.png?asset';
import { Channel } from '../../utils/channel';
import { getDefaultSettings, setSettings } from '../../utils/settings';

export const canCloseApp = { value: false };

const createWindow = (onWindowShow: () => void) => {
  const defaultSize = getDefaultSettings().size;

  const mainWindow = new BrowserWindow({
    width: defaultSize[0],
    height: defaultSize[1],
    minWidth: 400,
    minHeight: 400,
    show: false,
    fullscreenable: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: 'rgba(0,0,0,0)',
      symbolColor: 'white',
      height: 32,
    },
    ...(process.platform === 'linux' ? { icon: nativeImage.createFromPath(icon) } : {}),
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
    mainWindow.webContents.send(Channel.toggleMaximized, true);
  });

  mainWindow.on('unmaximize', () => {
    setSettings({ isMaximized: false, size: mainWindow.getSize() as [number, number] }, mainWindow.webContents);
    mainWindow.webContents.send(Channel.toggleMaximized, false);
  });

  mainWindow.on('close', (e) => {
    if (!canCloseApp.value) {
      e.preventDefault();
      mainWindow.webContents.send(Channel.requestClose);
    }
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  mainWindow.loadURL(
    is.dev && process.env.LOCAL ? 'http://localhost:3000/signIn' : 'https://password-manager-iota.vercel.app/signIn'
  );
};

export default { createWindow };
