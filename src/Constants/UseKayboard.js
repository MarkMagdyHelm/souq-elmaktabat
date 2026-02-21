import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardShow, setKeyboardShow] = useState(false);
  const onKeyboardDidShow=(e) =>{
    // Remove type here if not using TypeScript
    setKeyboardShow(true);
  }

  function onKeyboardDidHide() {
    setKeyboardShow(false);
  }

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide,
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardShow;
};
