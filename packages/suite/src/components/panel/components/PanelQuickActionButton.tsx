import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useThemeStyles } from '@/hooks/use-theme-styles';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  color: string;
  iconColor: string;
  onClick?: () => void;
}

export function QuickActionButton({
  icon,
  title,
  color,
  iconColor,
  onClick,
}: QuickActionButtonProps) {
  const styles = useThemeStyles();
  return (
    <motion.button
      onClick={onClick}
      className="w-full flex items-center p-3 rounded-xl transition-colors duration-200"
      style={{
        ...styles.quickAction.container,
        backgroundColor: styles.quickAction.container.backgroundColor,
      }}
      whileHover={{ x: 4, backgroundColor: styles.quickAction.container.hoverBackgroundColor }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
      <div className={cn('rounded-full p-2 mr-3', color)}>
        <div className={iconColor}>{icon}</div>
      </div>
      <div className="flex-1 text-left font-medium text-lg" style={styles.text.primary}>
        {title}
      </div>
      <ChevronRight size={16} style={styles.text.muted} />
    </motion.button>
  );
}
