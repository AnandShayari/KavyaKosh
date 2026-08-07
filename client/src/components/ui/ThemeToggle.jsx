import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon } from 'lucide-react';
import { toggleTheme } from '../../features/theme/themeSlice';

export default function ThemeToggle({ className = '' }) {
  const dispatch = useDispatch();
  const mode = useSelector((s) => s.theme.mode);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => dispatch(toggleTheme())}
      className={`relative w-14 h-7 rounded-full p-1 transition-colors duration-300 ${className}`}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      aria-label="Toggle theme"
    >
      <motion.div
        layout
        className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center"
        animate={{ x: mode === 'dark' ? 0 : 24 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {mode === 'dark' ? <Moon size={12} className="text-white" /> : <Sun size={12} className="text-white" />}
      </motion.div>
    </motion.button>
  );
}
