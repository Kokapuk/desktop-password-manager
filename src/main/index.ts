import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, app } from 'electron';
import path from 'path';
import { handleIpc } from '../utils/ipc';
import Splash from './windows/splash';

if (process.defaultApp && !is.dev) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('password-manager', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('password-manager');
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

handleIpc();

app.on('second-instance', () => {
  const window = BrowserWindow.getAllWindows()[0];

  if (!window) {
    return;
  }

  if (!window.isVisible()) {
    window.show();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
});

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.Kokapuk');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  Splash.createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) Splash.createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
