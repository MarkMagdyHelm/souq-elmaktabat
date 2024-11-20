import React from 'react';
import 'react-native-gesture-handler';
import {AppRegistry, I18nManager, Text, TextInput, LogBox} from 'react-native';
import {ThemeProvider} from './src/Constants/theming';
// @ts-ignore
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import App from './App';
import {name as appName} from './app.json';
import { persistor, store } from './src/Store/store';
LogBox.ignoreLogs([
  'Remote debugger',
  "Looks like you're passing an inline function",
  'Cannot update a component (`initNavgtion`) while rendering',
  'Warning: Cannot update a component from inside the function body of a different component',
  "Warning: Can't perform a React state update on an unmounted component.",
  'interpolate() was renamed to interpolateNode() in Reanimated 2. Please use interpolateNode() instead',
]);
// Disable Font Scalling
if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}
// app
const RNapp = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={false}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => RNapp);
