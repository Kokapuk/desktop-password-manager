import { BrowserWindow, app, ipcMain } from 'electron';
import { Channel } from './channel';
import { Settings } from './settings';

export const handleIpc = () => {
  ipcMain.on(Channel.restoreWindowState, (event, settings: Settings) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    if (!window) {
      return;
    }

    window.setSize(...settings.size);
    window.center();
    settings.isMaximized ? window.maximize() : window.unmaximize();
  });

  ipcMain.handle(Channel.getVersion, () => {
    return app.getVersion();
  });
};
