import Version from '@renderer/components/Version';
import { useEffect, useState } from 'react';
import icon from '../../assets/icon.png';
import { Channel } from '../../../../utils/channel';
import ProgressBar from '@renderer/components/ProgressBar';

const Splash = () => {
  const [state, setState] = useState('Checking for updates...');
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    window.electron.ipcRenderer.on(Channel.updateState, (_, state: string) => {
      setState(state);
    });

    window.electron.ipcRenderer.on(Channel.downloadProgress, (_, downloadProgress: number) => {
      setDownloadProgress(downloadProgress);
    });
  }, []);

  return (
    <>
      <img className="image" src={icon} />
      <h4>Password Manager</h4>
      <p className="caption">{state}</p>
      {!!downloadProgress && <ProgressBar progress={downloadProgress} />}
      <p className="version">{<Version />}</p>
    </>
  );
};

export default Splash;
