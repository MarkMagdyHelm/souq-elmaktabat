import { Button, Linking, Platform } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { CardStyleInterpolators,createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { ThemeContext } from '../Constants/theming';
import Signin from "../Screens/Auth/Signin/index";
import Signup from '../Screens/Auth/SignUp/index';
import Home from '../Screens/Home/index';
import Notifications from '../Screens/Notification/index';
import Polls from '../Screens/Polls/index';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MoreComponnent from '../Components/MoreComponnent/MoreComponnent';
import { phoneWidth, PixelPerfect } from '../Constants/styleConstants';
import ContactUs from '../Screens/ContactUs/index'
const Stack = createStackNavigator();


const Stacks = () => {
  const { isLogin } = useSelector(state => state.auth, shallowEqual);

  return (
    <Stack.Navigator
      screenOptions={props => {
        return {
          headerShown: false,
          gestureEnabled:true,
          gestureDirection:"horizontal",
          cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS
          // animationEnabled:true,
          // animationTypeForReplace:"push",
          // presentation:"transparentModal",
        };
      }}
        initialRouteName={ 'Home' }
      >
        
       <Stack.Screen name="Signin" component={Signin} />
       <Stack.Screen name="Home" component={Home} />
       <Stack.Screen name="Signup" component={Signup} />
       <Stack.Screen name="Notifications" component={Notifications} />
       <Stack.Screen name="Polls" component={Polls} />
       <Stack.Screen name="ContactUs" component={ContactUs} />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();



const Drawers =()=> {
  const { direction } = useSelector(state => state.settings, shallowEqual);
 
  return (
    
      <Drawer.Navigator initialRouteName="Home"
      
       screenOptions={props => {
        return {
          headerShown: false,
      drawerPosition:direction==="rtl"?'right':"left",
      drawerType:Platform.OS == "ios" ? "front" : 'front',
      gestureEnabled: false,
      drawerStyle: {
        width:phoneWidth-PixelPerfect(87), 
      },
        };
      }}
       drawerContent={(props) => <MoreComponnent {...props} />}>
        <Drawer.Screen name="More" component={Stacks} />
      </Drawer.Navigator>
    
  );
}
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
      <Drawers />
     
    </NavigationContainer>
  );
};

export default initNavgtion;
