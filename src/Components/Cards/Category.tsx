import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import {
  ColorWithOpacity,
  Colors,
  PixelPerfect,
  phoneWidth,
} from '../../Constants/styleConstants';
import { t } from 'i18next';
import { imageUrl } from '../../Constants/config';
import { AddPaperRate } from '../../Apis/HomeApis';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootState } from '../../Store/store';
import CancelOrder from '../PopUps/CancelOrder';
import { logoutHandler } from '../../Apis/User';
import { useNavigation } from '@react-navigation/native';
import ImageWithFallback from '../ImageWithFallback/ImageWithFallback';

type Props = {
  item: any;
};

const Category = (props: Props) => {
  const { item } = props;
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  const [showModal, setShowModal] = useState(false);
  const [visibleCancel, setVisibleCancel] = useState(false);
  const [tempRating, setTempRating] = useState(0);
  const navigation = useNavigation();

  const { isLogin } = useSelector((state: RootState) => state.auth);
  console.log('lll', isLogin);

  const dispatch = useDispatch();
  const toast = useToast();

  const toastNotfication = (config: any) => {
    toast.hideAll();
    toast.show(config.message, {
      type: config.type,
      duration: 3000,
      offset: 50,
      animationType: 'slide-in',
      placement: 'top',
    } as any);
  };

  const handleSubmit = () => {
    if (tempRating === 0) {
      return;
    }

    dispatch<any>(
      AddPaperRate(
        {
          paperId: item?.id,
          rate: tempRating,
        },
        (res, status) => {
          if (res.status === 200) {
            // optionally update UI or show success
          } else {
            toastNotfication({
              type: 'error',
              message: res?.Message ?? t('Something Went wrong'),
            });
          }
        },
      ),
    );

    setShowModal(false);
    setTempRating(0); // reset
  };
  return (
    <>
      <Pressable
        style={[layout.rowBox, styles.con]}
        onPress={() => (isLogin ? setShowModal(true) : setVisibleCancel(true))}
      >
        <View style={[layout.rowBox, { alignItems: 'center' }]}>
          <View style={styles.imageCon}>
            <Image
              style={styles.image}
              source={{ uri: imageUrl + item?.imageUrl, cache: 'reload' }}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              paddingHorizontal: PixelPerfect(5),
            }}
          >
            <Text style={[layout.textAlign, styles.text1]}>{item?.name}</Text>
            <Text style={[layout.textAlign, styles.text2]}>
              {item?.paperSize}
            </Text>
            <Text style={[layout.textAlign, styles.text2]}>
              {item?.paperWidth == 0 ? '70' : '80'} {t('GM')}
            </Text>
          </View>
        </View>

        <Text style={styles.currency}>
          {item?.price == 0 ? '------' : item?.price}
          {item?.price == 0 ? '' : t('LE')}
        </Text>
      </Pressable>
      {/* Rating Modal */}

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Close */}
            <TouchableOpacity
              style={styles.close}
              onPress={() => setShowModal(false)}
            >
              <Text>✕</Text>
            </TouchableOpacity>
  
            <ImageWithFallback
                uri={imageUrl + item?.imageUrl}
                type={item?.type}
                style={styles.modalImage}
              />
            <Text style={styles.title}>{t('RatePaper')}</Text>
            {/* Select Rating */}
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setTempRating(star)}
                >
                  <Icon
                    name={star <= tempRating ? 'star' : 'star-o'}
                    size={32}
                    color={star <= tempRating ? '#FFD700' : '#B0B0B0'} // دهبي للعادية، رمادي للدفولت
                    style={styles.star}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {/* Save */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: tempRating === 0 ? '#ccc' : '#007bff',
                },
              ]}
              disabled={tempRating === 0}
              onPress={handleSubmit}
            >
              <Text style={{ color: '#fff' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CancelOrder
        visible={visibleCancel}
        onClose={() => setVisibleCancel(false)}
        onSubmit={() => {
          setVisibleCancel(false);
          dispatch<any>(logoutHandler());
          navigation.reset({
            index: 0,
            routes: [{ name: 'Signin' }],
          } as any);
        }}
        title={t('signtxt1')}
        body={''}
        cancleText={t('Sign in')}
        SignIn={true}
      />
    </>
  );
};

export default Category;

const useStyles = (
  Fonts: IFont,
  theme: ITheme,
  darkmode: boolean,
  dir: string,
) =>
  StyleSheet.create({
    con: {
      paddingLeft: PixelPerfect(5),
      borderRadius: PixelPerfect(8),
      height: PixelPerfect(60),
      width: (phoneWidth - PixelPerfect(29)) / 2,
      alignItems: 'center',
      backgroundColor: Colors.white,
      marginBottom: PixelPerfect(16),
      borderColor: ColorWithOpacity(theme.black, 0.25),
      borderWidth: PixelPerfect(0.7),
      // borderRaduis: PixelPerfect(4),
      justifyContent: 'space-between',
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 1,
    },
    imageCon: {
      height: PixelPerfect(50),
      width: PixelPerfect(50),
    },
    image: {
      height: PixelPerfect(50),
      width: PixelPerfect(50),
      borderRadius: PixelPerfect(10),
      resizeMode: 'contain',
    },
    text1: {
      color: theme.textColor,
      fontSize: PixelPerfect(16),
      fontFamily: Fonts.bold,
    },
    text2: {
      color: theme.black,
      fontSize: PixelPerfect(12),
      fontFamily: Fonts.light,
    },
    currency: {
      color: theme.currenctText,
      fontSize: PixelPerfect(18),
      fontFamily: Fonts.bold,
      //  paddingHorizontal:PixelPerfect(4),
      position: 'absolute',
      right: 2,
      top: PixelPerfect(26),
    },

    card: {
      padding: 10,
      alignItems: 'center',
    },
    // image: {
    //   width: 100,
    //   height: 100,
    // },
    stars: {
      flexDirection: 'row',
      marginTop: 5,
    },
    star: {
      fontSize: 22,
      marginHorizontal: 2,
    },

    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      width: '80%',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
    },
    modalImage: {
      width: 120,
      height: 120,
    },
    title: {
      marginVertical: 10,
    },
    close: {
      position: 'absolute',
      top: 10,
      left: 10,
    },
    button: {
      width: '90%', // ✅ this is what you need
      display: 'flex',
      height: PixelPerfect(50),
      backgroundColor: theme.babyBlue,
      borderRadius: PixelPerfect(6),
      paddingVertical: PixelPerfect(10),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: PixelPerfect(10),
    },
  });
