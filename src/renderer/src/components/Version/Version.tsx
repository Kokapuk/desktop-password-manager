import { useEffect, useState } from 'react';

const Version = () => {
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    (async () => {
      const appVersion: string = await window.electron.ipcRenderer.invoke('getVersion');
      setAppVersion(appVersion);
    })();
  }, []);

  return <>{appVersion}</>;
};

export default Version;
