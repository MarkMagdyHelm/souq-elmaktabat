import { useToast } from 'react-native-toast-notifications';
import { t } from 'i18next'; // Assuming you're using i18next for translations

const useToastNotification = () => {
  const toast = useToast();

  const showToast = (config: { message: string, type: 'ok' | 'error'}) => {
    toast.hideAll();
    toast.show(t(config.message), {
        type: config.type, 
        duration: 3000,     
        animationType: 'slide-in', 
        placement: 'top',       
    });
  };

  return showToast;
};

export default useToastNotification;
