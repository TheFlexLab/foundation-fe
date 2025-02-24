import { toast } from 'sonner';
import { toastMessages } from '../../constants/toastMessages';

type ToastKind = keyof typeof toastMessages;

interface ToastOptions {
  // Define the properties of the options object here, if any
}

type ShowToastFunction = (
  type: 'success' | 'warning' | 'error' | 'info',
  kind: ToastKind,
  options?: ToastOptions,
  customMessage?: string,
) => void;

const showToast: ShowToastFunction = (type, kind, options = {}, customMessage) => {
  const message = toastMessages[kind];

  if (type === 'error' && !message && !customMessage) {
    console.warn(`No predefined or custom message provided for error type.`);
    return;
  }

  if (type === 'error') {
    if (message) {
      // Predefined error message available
      toast.error(message, options);
    } else {
      // Use custom error message
      toast.error(customMessage!, options); // Assuming customMessage always exists here
    }
  } else if (message) {
    // Predefined message available for other types
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      default:
        console.warn(`Toast message of type "${type}" not found.`);
    }
  } else {
    console.warn(`Toast message of type "${type}" not found.`);
  }
};

export default showToast;
