import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ThemeContext } from '../../Constants/theming';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';
import { Container } from '../../Components/containers/Containers';
import TabBar from '../../Components/TabBar/index';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import { useDispatch } from 'react-redux';

type Props = {
  navigation: any;
};

const Index = (props: Props) => {
  const { navigation } = props;
  const { Fonts, dir, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  const dispatch = useDispatch();

  return (
    <Container showHint={false}>
      <HeaderWithText title={''} hasNotBack={true} />
      <View style={styles.bodyCon}>
        <View style={styles.container}>
          <View style={styles.container}>
            <Text style={styles.title}>{t('NoData')}</Text>

            <Text style={styles.subtitle}>{t('NoDataDetails')}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Signin' }],
                });
              }}
            >
              <Text style={styles.buttonText}>{t('Sign in')}</Text>
            </TouchableOpacity>

            <Pressable
              style={styles.signUpCon}
              onPress={() => {
                navigation.navigate('Signup', { isForgetPassword: false });
              }}
            >
              <Text style={styles.signUpText}>
                {t("Don't have account")}
                <Text style={[styles.signUpText1]}> {t('Sign up')}</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <TabBar />
    </Container>
  );
};

export default Index;

const useStyles = (
  Fonts: IFont,
  theme: ITheme,
  darkmode: boolean,
  dir: string,
) =>
  StyleSheet.create({
    bodyCon: {
      flex: 0.8,
      backgroundColor: theme.mainColor,
    },
    separator: {
      height: PixelPerfect(1),
      backgroundColor: theme.border,
    },
    // container: {
    //   height: PixelPerfect(40),
    //   backgroundColor: theme.white,
    //   paddingHorizontal: PixelPerfect(8),
    //   marginBottom: PixelPerfect(16),
    // },
    tabs: {
      flexDirection: 'row',
      height: PixelPerfect(40),
    },
    tab: {
      height: PixelPerfect(50),
      marginHorizontal: PixelPerfect(4),
      flex: 1,
      borderRadius: PixelPerfect(8),
      alignItems: 'center',
      backgroundColor: theme.gray2,
      justifyContent: 'center',
    },
    activeTab: {
      backgroundColor: theme.babyBlue,
    },
    tabText: {
      fontSize: PixelPerfect(18),
      color: theme.black,
      fontFamily: Fonts.medium,
    },
    activeTabText: {
      color: theme.white,
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(18),
    },
    footerLoader: {
      paddingVertical: PixelPerfect(20),
      alignItems: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: '#222',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 15,
      color: '#666',
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 30,
    },
    button: {
      backgroundColor: Colors.secondColor,
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 8,
      marginBottom: 12,
    },
    buttonText: {
      fontFamily: Fonts.bold,
      fontSize: PixelPerfect(18),
      color: theme.mainColor,
    },
    link: {
      color: '#007BFF',
      fontSize: 14,
    },
    signUpCon: {
      backgroundColor: theme.mainColor,
      paddingTop: PixelPerfect(16),
      alignItems: 'center',
      justifyContent: 'center',
    },
    signUpText: {
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(14),
      color: theme.deactive,
    },
    signUpText1: {
      fontFamily: Fonts.bold,
      fontSize: PixelPerfect(16),
      color: Colors.secondColor,
    },
  });
