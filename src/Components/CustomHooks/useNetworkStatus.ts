import {useCallback, useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {mainUrl} from '../../Constants/config';
import {networkStatus, NetworkSnapshot} from '../../Helper/networkStatus';

const useNetworkStatus = () => {
  const [state, setState] = useState<NetworkSnapshot>(
    networkStatus.getState(),
  );
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const unsubscribeStore = networkStatus.subscribe(setState);
    const unsubscribeNetInfo = NetInfo.addEventListener(netState => {
      networkStatus.setConnected(netState.isConnected ?? false);
    });

    NetInfo.fetch().then(netState => {
      networkStatus.setConnected(netState.isConnected ?? false);
    });

    return () => {
      unsubscribeStore();
      unsubscribeNetInfo();
    };
  }, []);

  const retry = useCallback(async () => {
    setIsRetrying(true);

    try {
      const netState = await NetInfo.fetch();
      const isConnected = netState.isConnected ?? false;

      networkStatus.setConnected(isConnected);

      if (!isConnected) {
        return;
      }

      try {
        await axios.get(mainUrl, {timeout: 5000});
        networkStatus.clearConnectionError();
      } catch {
        networkStatus.reportConnectionError();
      }
    } finally {
      setIsRetrying(false);
    }
  }, []);

  const isOffline = !state.isConnected || state.hasConnectionError;

  return {
    isOffline,
    isConnected: state.isConnected,
    isRetrying,
    retry,
  };
};

export default useNetworkStatus;
