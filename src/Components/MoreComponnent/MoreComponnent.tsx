import { Pressable, StyleSheet, Text, View, Image, ScrollView, StatusBar, Platform } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, PixelPerfect, getStatusBarHeight } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { Container } from '../containers/Containers'
import { ContactUsIcon, ShareMoreIcon, CloseIcon, MenuChevronIcon, AccountIcon, OrdersIcon, OffersIcon, PurchaseOrdersIcon, RatingsIcon, FavoriteIcon, BranchesIcon, LockIcon } from '../../Assets/Svg'
import { useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
import { imageUrl } from '../../Constants/config'

type Props = {
    navigation: any
}

const MoreComponnent = (props: Props) => {
  const { isLogin, userdata,isSeller } = useSelector((state:RootState) => state.auth);

  const { navigation } = props;
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
console.log("sssssssssssssssssssssss");
console.log(isSeller);
console.log("sssssssssssssssssssssss");
  const allMenuItems = [
    { 
      key: 'account', 
      title: t('The Account'), 
      icon: <AccountIcon  />, 
      onPress: () => navigation.navigate('Signin') 
    },
    { 
      key: 'orders', 
      title: t('My Orders'), 
      icon: <OrdersIcon  />, 
      onPress: () => navigation.navigate('MyOrders') 
    },
  
    { 
      key: 'offers', 
      title: t('My Offers'), 
      icon: <OffersIcon  />, 
      onPress: () => navigation.navigate('AddOffer'),
      sellerOnly: true 
    },
    { 
      key: 'purchase', 
      title: t('Purchase Orders'), 
      icon: <PurchaseOrdersIcon  />, 
      onPress: () => navigation.navigate('Orders') ,
      sellerOnly: true 
    },
    { 
      key: 'ratings', 
      title: t('Ratings'), 
      icon: <RatingsIcon  />, 
      onPress: () => {},
      sellerOnly: true 
    },
    { 
      key: 'favorites', 
      title: t('Favorite List'), 
      icon: <FavoriteIcon  />, 
      onPress: () => {} 
    },
    { 
      key: 'changePassword', 
      title: t("Change Password"), 
      icon: <LockIcon  />, 
      onPress: () => {} 
    },
    { 
      key: 'branches', 
      title: t('Branches'), 
      icon: <BranchesIcon  />, 
      onPress: () => {},
      sellerOnly: true 
    },
    { 
      key: 'contact', 
      title: t('Contact us'), 
      icon: <ContactUsIcon  />, 
      onPress: () => navigation.navigate('ContactUs') 
    },
    { 
      key: 'invite', 
      title: t('Invite Friends'), 
      icon: <ShareMoreIcon  />, 
      onPress: () => {} 
    },
    { 
      key: 'logout', 
      title:"Logout", 
      icon: <ShareMoreIcon  />, 
      onPress: () => {
        navigation.navigate('Signin') 
      } 
    },
  ];



  
  // Filter menu items based on isSeller
  const menuItems = allMenuItems.filter(item => {
    // If item is sellerOnly, only show if isSeller is true
    if (item.sellerOnly) {
      return isSeller === true;
    }
    // Otherwise, show all items
    return true;
  });

console.log(userdata,'userdata',Platform.OS,isSeller);

  const userName = userdata?.name  || 'مكتبة النور' ;
  const userPhone = userdata?.phoneNumber || '01123456789' ;
  const userImage = userdata?.imageUrl || userdata?.userImages ? { uri: imageUrl + (userdata?.imageUrl || userdata?.userImages) } : null;

  return (
<Container>
  {/* Header Section */}
  <View style={[layout.rowBox,styles.header]}>
    <View style={[layout.rowBox,styles.profileSection]}>
      <View style={styles.profileImageContainer}>
        {userImage ? (
          <Image source={userImage} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImageText}>{t("library")}</Text>
          </View>
        )}
      </View>
      <View style={styles.profileInfo}>
        <Text style={[layout.textAlign,styles.userName]}>{userName}</Text>
        <Text style={[layout.textAlign,styles.userPhone]}>{userPhone}</Text>
      </View>
    </View>
    <Pressable 
      style={styles.closeButton}
      onPress={() => navigation.closeDrawer()}
    >
      <CloseIcon />
    </Pressable>
  </View>

  {/* Menu Items */}
  <ScrollView 
    style={styles.menuContainer}
    showsVerticalScrollIndicator={false}
  >
    {menuItems.map((item, index) => (
      <Pressable
        key={item.key}
        style={styles.menuItem}
        onPress={item.onPress}
      >
         <View style={styles.chevronContainer}>
          <MenuChevronIcon 
            color={theme.textColor}
            style={styles.chevron}
          />
        </View>
        <View style={[layout.rowBox, { flex: 1, alignItems: 'center' }]}>
          <View style={styles.menuIconContainer}>
            {item.icon}
          </View>
          <Text style={[styles.menuText, layout.textAlign]}>{item.title}</Text>
        </View>
       
      </Pressable>
    ))}
  </ScrollView>
</Container>
    
  )
}

export default MoreComponnent

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.white,
            paddingTop: getStatusBarHeight(true),
        },
        header: {
            paddingHorizontal: PixelPerfect(16),
            paddingTop: PixelPerfect(16),
            marginBottom: PixelPerfect(18),
            justifyContent: 'space-between',
        },
        closeButton: {
            width: PixelPerfect(24),
            height: PixelPerfect(24),
        },
        profileSection: {
            alignItems: 'center',
          // width: '100%',
        },
        profileImageContainer: {
            marginRight: dir === 'rtl' ? 0 : PixelPerfect(12),
            marginLeft: dir === 'rtl' ? PixelPerfect(12) : 0,
        },
        profileImage: {
            width: PixelPerfect(60),
            height: PixelPerfect(60),
            borderRadius: PixelPerfect(30),
            backgroundColor: theme.light,
        },
        profileImagePlaceholder: {
            width: PixelPerfect(60),
            height: PixelPerfect(60),
            borderRadius: PixelPerfect(30),
            backgroundColor: '#E8F5E9',
            justifyContent: 'center',
            alignItems: 'center',
        },
        profileImageText: {
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(14),
            color: theme.textColor,
        },
        profileInfo: {
          
        },
        userName: {
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(18),
            color: theme.textColor,
            marginBottom: PixelPerfect(4),
       
        },
        userPhone: {
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(14),
            color: theme.medGary,
        },
        menuContainer: {
            flex: 1,
            paddingTop: PixelPerfect(8),
        },
        menuItem: {
            paddingHorizontal: PixelPerfect(16),
            paddingVertical: PixelPerfect(10),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: theme.categorypopupitemBg,
        },
        menuIconContainer: {
            width: PixelPerfect(24),
            height: PixelPerfect(24),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: dir === 'rtl' ? 0 : PixelPerfect(4),
            marginLeft: dir === 'rtl' ? PixelPerfect(4) : 0,
        },
        menuText: {
            flex: 1,
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(16),
            color: theme.black,
            textAlign: dir === 'rtl' ? 'right' : 'left',
        },
        chevronContainer: {
            width: PixelPerfect(24),
            height: PixelPerfect(24),
            justifyContent: 'center',
            alignItems: 'center',
        },
        chevron: {
            transform: [{ rotate: dir !== 'rtl' ? '180deg' : '0deg' }],
        },
    })