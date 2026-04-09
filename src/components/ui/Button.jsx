import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30',
    secondary: 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30',
    accent: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/30',
    outline: 'border border-white/20 text-white hover:bg-white/5',
    ghost: 'text-white/70 hover:text-white hover:bg-white/5',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
