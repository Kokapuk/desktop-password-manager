import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';
import { Channel } from '../utils/channel';
import { getSettings } from '../utils/settings';

const api = {};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}

(async () => {
  const settings = await getSettings();
  electronAPI.ipcRenderer.send(Channel.restoreWindowState, settings);
})();
