import styles from './ProgressBar.module.css';

interface Props {
  progress: number;
}

const ProgressBar = ({ progress }: Props) => {
  return (
    <div className={styles.background}>
      <div className={styles.progress} style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
