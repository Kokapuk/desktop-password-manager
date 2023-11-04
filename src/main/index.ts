import { electronApp, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, app } from 'electron';
import { handleIpc } from '../utils/ipc';
import Splash from './splash';

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
