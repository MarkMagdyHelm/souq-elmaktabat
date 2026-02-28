import { Pressable, StyleSheet, Text, View, Image, ScrollView, StatusBar, Platform, Linking } from 'react-native'
import React, { useContext, useState } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, PixelPerfect, getStatusBarHeight } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { Container } from '../containers/Containers'
import { ContactUsIcon, ShareMoreIcon, CloseIcon, MenuChevronIcon, AccountIcon, OrdersIcon, OffersIcon, PurchaseOrdersIcon, RatingsIcon, FavoriteIcon, BranchesIcon, LockIcon, TermsIcon, ChangeLangIcon, LogoutIcon, DeleteIcon, StareIcon, StareIconGray, RateProfileIcon } from '../../Assets/Svg'
import { useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
import { imageUrl } from '../../Constants/config'
import CancelOrder from '../PopUps/CancelOrder'

type Props = {
  navigation: any
}

const MoreComponnent = (props: Props) => {
  const { isLogin, userdata, isSeller } = useSelector((state: RootState) => state.auth);
  const { navigation } = props;
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
// const APP_STORE_LINK = `itms-apps://apps.apple.com/app/id${IOS_APP_ID}?action=write-review`;
const PLAY_STORE_LINK = `market://details?id=com.souqelmaktabat`;

const STORE_LINK = Platform.select({
  // ios: APP_STORE_LINK,
  android: PLAY_STORE_LINK,
});

  const allMenuItems = [
    {
      key: 'accountInfo',
       isLogin:true,
      title: t('AccountInfo'),
      icon: null,
      onPress: () => {

      }
    },
 {
      key: 'login',
      title: t('signin1'),
         isLogin:false,
      icon: <AccountIcon />,
      onPress: () => navigation.navigate('Signin')
    },
 {
      key: 'account',
       isLogin:true,
      title: t('The Account'),
      icon: <AccountIcon />,
      onPress: () => navigation.navigate(isSeller ? 'SellerProfile' : 'UserProfile')
    },
    {
      key: 'orders',
      title: t('My Orders'),
       isLogin:true,
      icon: <OrdersIcon />,
      onPress: () => navigation.navigate('MyOrders')
    },

    {
      key: 'offers',
      title: t('My Offers'),
       isLogin:true,
      icon: <OffersIcon />,
      onPress: () => navigation.navigate('MyOffers'),
      sellerOnly: true
    },
    {
      key: 'purchase',
      title: t('Purchase Orders'),
       isLogin:true,
      icon: <PurchaseOrdersIcon />,
      onPress: () => navigation.navigate('Orders'),
      sellerOnly: true
    },
    {
      key: 'ratings',
      title: t('Ratings'),
       isLogin:true,
      icon: <RatingsIcon />,
      onPress: () => {
      
        navigation.navigate('Rating')
      },
   
    },
    {
      key: 'branches',
      title: t('Branches'),
      icon: <BranchesIcon />,
      onPress: () => {
        navigation.navigate('Branches')
      },
      sellerOnly: true,
       isLogin:true,
    },
    {
      key: 'favorites',
       isLogin:true,
      title: t('Favorite List'),
      icon: <FavoriteIcon />,
      onPress: () => {
        navigation.navigate('Favoriate')
      }
    },
    {
      key: 'changePassword',
       isLogin:true,
      title: t("Change Password"),
      icon: <LockIcon />,
      onPress: () => {
        navigation.navigate('ChangePass')
       },
      sellerOnly: false
    },
    {
      key: 'aboutAPP',
      title: t('AboutAPP'),
      icon: null,
      onPress: () => {

      }
    },


    {
      key: 'contact',
      title: t('Contact us'),
      icon: <ContactUsIcon />,
      onPress: () => navigation.navigate('ContactUs')
    },

    {
      key: 'Terms',
      title: t('terms'),
      icon: <TermsIcon />,
      onPress: () => navigation.navigate('Terms')
    },

    {
      key: 'invite',
      title: t('Invite Friends'),
      icon: <ShareMoreIcon />,
      onPress: () => { }
    },
    {
      key: 'rateApp',
      title: t('Rate App'),
      icon: <RateProfileIcon />,
      onPress: () => {
          // Linking.openURL(STORE_LINK)
        //  StoreReview.requestReview(); 
        }
    },
    {
      key: 'changeLang',
      title: t('Change Language'),
      icon: <ChangeLangIcon />,
      onPress: () => navigation.navigate('ChangeLang')
    },
    {
      key: 'logout',
      title: t('logout'),
       isLogin:true,
      icon: <LogoutIcon />,
      onPress: () => {
        setVisibleCancel(true)

      }
    },
    {
      key: 'deleteAccount',
      isLogin:true,
      title: t('Delete Account'),
      icon: <DeleteIcon />,
      onPress: () => {

      }
    },
  ];




const filteredMenuItems = allMenuItems.filter(item => {
  // login check
  if (item.isLogin === true && !isLogin) return false;
 if (item.key === "login" && isLogin) return false;
  // seller check
  if (item.sellerOnly && !isSeller) return false;

  return true;
});

  console.log(userdata, 'userdata', Platform.OS, isSeller);

  const userName = userdata?.name;
  const userPhone = userdata?.phoneNumber;
  const userImage = userdata?.imageUrl || userdata?.userImages ? { uri: imageUrl + (userdata?.imageUrl || userdata?.userImages) } : null;
  const [visibleCancel, setVisibleCancel] = useState(false);
  return (
    <Container>
      {/* Header Section */}
      <CancelOrder visible={visibleCancel} onClose={() => setVisibleCancel(false)} onSubmit={() => {
        setVisibleCancel(false)
        navigation.navigate('Signin')
      }} title={t("LogoutCancle")} body={t("confirmLogout")} cancleText={t("yesLogout")} />
      <View style={[layout.rowBox, styles.header]}>
        <View style={[layout.rowBox, styles.profileSection]}>
          <View style={styles.profileImageContainer}>
            {(userImage&&isLogin) && (
              <Image source={userImage} style={styles.profileImage} />
            ) }
          </View>
          <View style={styles.profileInfo}>
            <Text style={[layout.textAlign, styles.userName]}>{userName}</Text>
            <Text style={[layout.textAlign, styles.userPhone]}>{userPhone}</Text>
          </View>
        </View>
        <Pressable
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <CloseIcon />
        </Pressable>
      </View>

      {/* Menu Items */}
      <ScrollView
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredMenuItems.map((item, index) => (
          <Pressable
            key={item?.key}
            style={styles.menuItem}
            onPress={item?.onPress}
          >
            {item?.key != "aboutAPP" && <View style={styles.chevronContainer}>
              <MenuChevronIcon
                color={theme.textColor}
                style={styles.chevron}
              />
            </View>}
            <View style={[layout.rowBox, { flex: 1, alignItems: 'center' }]}>

              {item?.key !== "aboutAPP" && item?.key !== "accountInfo" && (
                <View style={styles.menuIconContainer}>
                  {item?.icon}
                </View>
              )}

              {item?.key !== "aboutAPP"  && item?.key !== "accountInfo"? (
                <Text style={[styles.menuText, layout.textAlign]}>
                  {item?.title}
                </Text>
              ) : (
                <Text style={[styles.menuText1, layout.textAlign]}>
                  {item?.title}
                </Text>
              )}

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
      marginBottom: PixelPerfect(15)
    },
    menuItem: {
      paddingHorizontal: PixelPerfect(16),
      paddingVertical: PixelPerfect(12),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 3,
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
      marginEnd: PixelPerfect(4),
      textAlign: dir === 'rtl' ? 'right' : 'left',
    },
    menuText1: {
      flex: 1,
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(18),
      color: "#0394FF",
      marginEnd: PixelPerfect(4),
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