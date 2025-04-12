import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showNotification = (message, type) => {
  toast(message, { type });
};
