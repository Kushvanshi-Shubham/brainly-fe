import React, { type ReactNode, useEffect, useRef, createContext, useContext } from 'react';
import { cn } from '../../utlis/cn';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CrossIcon } from '../../Icons/IconsImport'; 


interface DialogContextType {
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a Dialog component");
  }
  return context;
};

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  showCloseButton?: boolean;
}


interface DialogHeaderProps { children: ReactNode; className?: string; }
interface DialogTitleProps { children: ReactNode; className?: string; id?: string; }
interface DialogFooterProps { children: ReactNode; className?: string; }


export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') onOpenChange(false);
      };
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      const timer = setTimeout(() => dialogRef.current?.focus(), 0);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
        clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [open, onOpenChange]);

  return createPortal(
    <AnimatePresence>
      {open && (
      
        <DialogContext.Provider value={{ onOpenChange }}>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-modal="true"
            role="dialog"
            ref={dialogRef}
            tabIndex={-1}
          >
            <motion.div
              className="relative"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </motion.div>
        </DialogContext.Provider>
      )}
    </AnimatePresence>,
    document.body
  );
};



export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
  ariaLabelledby,
  ariaDescribedby,
  showCloseButton = true
}) => {

  const { onOpenChange } = useDialog();

  return (
    <div
      className={cn(
        "w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 relative",
        "border border-gray-200 dark:border-gray-700",
        className
      )}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
    >
      {showCloseButton && (
        <button
          className="absolute top-3 right-3 p-1 rounded-full text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close dialog"

          onClick={() => onOpenChange(false)}
        >
          <CrossIcon className="w-5 h-5" />
       
        </button>
      )}
      {children}
    </div>
  );
};


export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left mb-4", className)}>
    {children}
  </div>
);

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className, id }) => (
  <h2 className={cn("text-xl font-semibold text-gray-900 dark:text-white", className)} id={id}>
    {children}
  </h2>
);

export const DialogFooter: React.FC<DialogFooterProps> = ({ children, className }) => (
  <div className={cn(
    "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-gray-100 dark:border-gray-700 mt-4",
    className
  )}>
    {children}
  </div>
);
