import { BrowserWindow, app, ipcMain } from 'electron';
import { Channel } from './channel';
import { Settings } from './settings';

export const handleIpc = () => {
  ipcMain.handle(Channel.getVersion, () => {
    return app.getVersion();
  });

  ipcMain.on(Channel.restoreWindowState, (event, settings: Settings) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    if (!window) {
      return;
    }

    window.setSize(...settings.size);
    window.center();
    settings.isMaximized ? window.maximize() : window.unmaximize();
  });

  ipcMain.on(Channel.minimize, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    if (!window) {
      return;
    }

    window.minimize();
  });

  ipcMain.on(Channel.toggleMaximized, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    if (!window) {
      return;
    }

    window.isMaximized() ? window.unmaximize() : window.maximize();
  });

  ipcMain.on(Channel.close, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    if (!window) {
      return;
    }

    window.close();
  });
};
