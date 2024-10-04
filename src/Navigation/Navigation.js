import { Linking } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { ThemeContext } from '../Constants/theming';
import Signin from "../Screens/Auth/Signin/index";
import Signup from '../Screens/Auth/SignUp/index';
import Home from '../Screens/Home/index';

const Stack = createStackNavigator();


const Stacks = () => {
  const { isLogin } = useSelector(state => state.auth, shallowEqual);

  return (
    <Stack.Navigator
      screenOptions={props => {
        return {
          headerShown: false,
          animationEnabled:true,
          animationTypeForReplace:"push",
          presentation:"transparentModal",
          animation:'slide_from_right'
        };
      }}
        initialRouteName={isLogin ? 'Home' : 'Signin'}
      >
        
       <Stack.Screen name="Signin" component={Signin} />
       <Stack.Screen name="Home" component={Home} />
       <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
};

/**
 * @return {JSX.Element}
 */

const initNavgtion = () => {
  const { dark } = useContext(ThemeContext);
  const navigationRef = React.createRef();
  return (
    <NavigationContainer
      theme={dark ? DarkTheme : DefaultTheme}
      // linking={linking}
      ref={navigationRef}>
      <Stacks />
     
    </NavigationContainer>
  );
};

export default initNavgtion;
