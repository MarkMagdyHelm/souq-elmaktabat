import React, {useContext} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../Constants/theming';
import {Colors, PixelPerfect} from '../../Constants/styleConstants';
import {IFont, ITheme} from '../../Constants/interfaces';
import {ErrorNOtfiIcon} from '../../Assets/Svg';
import useNetworkStatus from '../CustomHooks/useNetworkStatus';

const OfflineNotice = () => {
  const {isOffline, isRetrying, retry} = useNetworkStatus();
  const {Fonts, dir, layout, theme, dark} = useContext(ThemeContext);
  const {t} = useTranslation();
  const styles = useStyles(Fonts, theme, dark, dir);

  if (!isOffline) {
    return null;
  }

  return (
    <SafeAreaView edges={['top']} style={styles.wrapper} pointerEvents="box-none">
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={
          dir === 'rtl' ? ['#FF011E', '#eb001b'] : ['#eb001b', '#FF011E']
        }
        style={styles.banner}>
        <View style={[layout.rowBox, styles.content]}>
          <ErrorNOtfiIcon />
          <Text style={styles.message}>{t('No internet connection')}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={retry}
            disabled={isRetrying}>
            {isRetrying ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.retryText}>{t('Retry')}</Text>
            )}
          </Pressable>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default OfflineNotice;

const useStyles = (
  fonts: IFont,
  theme: ITheme,
  darkmode: boolean,
  dir: string,
) =>
  StyleSheet.create({
    wrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      elevation: 9999,
      alignItems: 'center',
      paddingHorizontal: PixelPerfect(16),
      paddingBottom: PixelPerfect(8),
    },
    banner: {
      width: '100%',
      borderRadius: PixelPerfect(11),
      minHeight: PixelPerfect(50),
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: PixelPerfect(12),
      paddingVertical: PixelPerfect(10),
      gap: PixelPerfect(8),
    },
    message: {
      flex: 1,
      color: Colors.white,
      fontFamily: fonts.medium,
      fontSize: PixelPerfect(12),
      lineHeight: PixelPerfect(20),
    },
    retryButton: {
      minWidth: PixelPerfect(56),
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: PixelPerfect(10),
      paddingVertical: PixelPerfect(6),
      borderRadius: PixelPerfect(6),
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.45)',
    },
    retryText: {
      color: Colors.white,
      fontFamily: fonts.medium,
      fontSize: PixelPerfect(12),
    },
  });
