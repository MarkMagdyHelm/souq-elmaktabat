import { Button, Linking, Platform } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { ThemeContext } from '../Constants/theming';
import Signin from "../Screens/Auth/Signin/index";
import Signup from '../Screens/Auth/SignUp/index';
import ConfirmtionCode from '../Screens/Auth/ConfirmtionCode/index'
import Boursa from '../Screens/Boursa/index';
import HomeMore from '../Screens/HomeMore/index';
import Notifications from '../Screens/Notification/index';
import Polls from '../Screens/Polls/index';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MoreComponnent from '../Components/MoreComponnent/MoreComponnent';
import { phoneWidth, PixelPerfect } from '../Constants/styleConstants';
import ContactUs from '../Screens/ContactUs/index';
import RegisterInformation from '../Screens/Auth/RegisterInformation/index'
import ProductDetails from '../Screens/ProductDetails/index'
import Market from '../Screens/Market/index'
import Orders from '../Screens/Orders/index'
import MyOrders from '../Screens/MyOrders/index'
import Demo from '../Screens/Demo/index';
import OrderDetails from '../Screens/OrderDetails/index';
import OffersDetails from '../Screens/OffersDetails/index';
import ForgetPassword from '../Screens/Auth/ForgetPassword/Index';
import AddOffer from '../Screens/Company/AddOffer/index'
import SellerProfile from '../Screens/SellerProfile/index'
import UserProfile from '../Screens/UserProfile/index'
import Favoriate from '../Screens/Favoriate/index'
import Branches from '../Screens/Branchs/index'
import MyOffers from '../Screens/MyOffers/index'
import Rating from '../Screens/Rating/index'
import Sellers from '../Screens/Sellers/index'
import SellerInfo from '../Screens/SellerInfo/index'

import Terms from '../Screens/Terms/index'
import ChangeLang from '../Screens/ChangeLang/index'
import AddNewBranch from '../Screens/AddNewBranch/index'
import ChangePass from '../Screens/Auth/ChangePassword/Index'
import EditProfile from '../Screens/Auth/EditProfile/index'
import EditProfileUser from '../Screens/Auth/EditProfileUser/index'
const Stack = createStackNavigator();


const Stacks = () => {
  const { isLogin } = useSelector(state => state.auth, shallowEqual);
 
  return (
    <Stack.Navigator
      screenOptions={props => {
        return {
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          // animationEnabled:true,
          // animationTypeForReplace:"push",
          // presentation:"transparentModal",
        };
      }}
      initialRouteName={isLogin ? "Market" : "Dimo"}

    >

      <Stack.Screen name="Boursa" component={Boursa} />


      {/* Baroo */}
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="MyOrders" component={MyOrders} />
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="Market" component={Market} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="OffersDetails" component={OffersDetails} />
      <Stack.Screen name="SellerProfile" component={SellerProfile} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="Favoriate" component={Favoriate} />
      <Stack.Screen name="HomeMore" component={HomeMore} />
      <Stack.Screen name="Branches" component={Branches} />
      <Stack.Screen name="MyOffers" component={MyOffers} />
      <Stack.Screen name="Rating" component={Rating} />
      <Stack.Screen name="Sellers" component={Sellers} />
      <Stack.Screen name="SellerInfo" component={SellerInfo} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="ChangeLang" component={ChangeLang} />
      <Stack.Screen name="ChangePass" component={ChangePass} />
      <Stack.Screen name="AddNewBranch" component={AddNewBranch} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
       <Stack.Screen name="EditProfileUser" component={EditProfileUser} />
      

      <Stack.Screen name="Demo" component={Demo} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="ConfirmtionCode" component={ConfirmtionCode} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Polls" component={Polls} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="RegisterInformation" component={RegisterInformation} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="AddOffer" component={AddOffer} />
      <Stack.Screen name="More" component={MoreComponnent} />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();



// const Drawers = () => {
//   const { direction } = useSelector(state => state.settings, shallowEqual);

//   return (

//     <Drawer.Navigator initialRouteName="Home"

//       screenOptions={props => {
//         return {
//           headerShown: false,
//           drawerPosition: direction === "rtl" ? 'right' : "left",
//           drawerType: Platform.OS == "ios" ? "front" : 'front',
//           gestureEnabled: false,
//           drawerStyle: {
//             width: phoneWidth,
//           },
//         };
//       }}
//       drawerContent={(props) => <MoreComponnent {...props} />}>
//       <Drawer.Screen name="More" component={Stacks} />
//     </Drawer.Navigator>

//   );
// }
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
