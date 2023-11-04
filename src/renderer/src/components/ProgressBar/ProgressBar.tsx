import cn from 'classnames';
import styles from './ProgressBar.module.css';

interface Props {
  progress: number;
  className?: string;
}

const ProgressBar = ({ progress, className }: Props) => {
  return (
    <div className={cn(styles.bar, className)}>
      <div className={styles.progress} style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
