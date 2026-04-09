import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const GlassCard = ({ 
  children, 
  className, 
  hover = true,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.01, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' } : {}}
      className={cn(
        'glass-card p-6 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
