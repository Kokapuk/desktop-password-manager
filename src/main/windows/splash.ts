import { is } from '@electron-toolkit/utils';
import { BrowserWindow, nativeImage, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import { join } from 'path';
import icon from '../../../resources/icon.png?asset';
import { Channel } from '../../utils/channel';
import App from './app';

const createWindow = () => {
  let mainWindow: BrowserWindow | null = new BrowserWindow({
    width: 300,
    height: 350,
    show: false,
    resizable: false,
    fullscreenable: false,
    titleBarStyle: 'hidden',
    darkTheme: true,
    ...(process.platform === 'linux' ? { icon: nativeImage.createFromPath(icon) } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: is.dev,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show();

    const startApp = () => {
      mainWindow?.webContents.send(Channel.updateState, 'Starting...');

      App.createWindow(() => {
        mainWindow?.close();
        mainWindow?.removeAllListeners();
        autoUpdater.removeAllListeners();
        mainWindow = null;
      });
    };

    if (is.dev && !process.env.SPLASH_MODE) {
      return startApp();
    } else if (process.env.SPLASH_MODE) {
      return setTimeout(() => {
        mainWindow?.webContents.send(Channel.updateState, 'Downloading updates...');
        let percent = 0;

        setInterval(() => {
          mainWindow?.webContents.send(Channel.downloadProgress, (percent += 10));
        }, 1000);
      }, 1500);
    } else if (!is.dev) {
      autoUpdater.checkForUpdates();
    }

    autoUpdater.on('update-not-available', startApp);
    autoUpdater.on('download-progress', (info) => {
      mainWindow?.webContents.send(Channel.updateState, 'Downloading updates...');
      mainWindow?.webContents.send(Channel.downloadProgress, info.percent);
    });
    autoUpdater.on('update-downloaded', () => {
      mainWindow?.webContents.send(Channel.updateState, 'Installing updates..');
      autoUpdater.quitAndInstall();
    });
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/splash.html`);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/splash.html'));
  }

  return mainWindow;
};

export default { createWindow };
