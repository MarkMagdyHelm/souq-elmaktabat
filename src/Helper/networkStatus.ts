export type NetworkSnapshot = {
  isConnected: boolean;
  hasConnectionError: boolean;
};

type Listener = (state: NetworkSnapshot) => void;

const createNetworkStatus = () => {
  let state: NetworkSnapshot = {
    isConnected: true,
    hasConnectionError: false,
  };

  const listeners = new Set<Listener>();

  const notify = () => {
    const snapshot = {...state};
    listeners.forEach(listener => listener(snapshot));
  };

  return {
    getState: () => ({...state}),
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      listener({...state});
      return () => listeners.delete(listener);
    },
    setConnected: (isConnected: boolean) => {
      state.isConnected = isConnected;
      if (isConnected) {
        state.hasConnectionError = false;
      }
      notify();
    },
    reportConnectionError: () => {
      state.hasConnectionError = true;
      notify();
    },
    clearConnectionError: () => {
      if (!state.hasConnectionError) {
        return;
      }
      state.hasConnectionError = false;
      notify();
    },
  };
};

export const networkStatus = createNetworkStatus();
