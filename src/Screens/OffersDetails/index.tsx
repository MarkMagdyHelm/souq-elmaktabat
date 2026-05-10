import React, { useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  I18nManager,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import { PixelPerfect } from '../../Constants/styleConstants';
import SellerBranches from '../../Components/Cards/SellerBranches';
import { Container, Content } from '../../Components/containers/Containers';
import { useRoute } from '@react-navigation/native';
import { AddPaperOfferRequest } from '../../Apis/Request';
import { useDispatch } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import SignUpSuccess from '../../Components/PopUps/SignUpSuccess';
import { t } from 'i18next';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import { CancelIcon, EditIcon, RateIcone } from '../../Assets/Svg';
import Stars from '../../Helper/Stars';
import Space from '../../Helper/Space';
import { AddFavouritePaperOffer } from '../../Apis/CommonApi';
import CancelOrder from '../../Components/PopUps/CancelOrder';
import { DeleteOffer } from '../../Apis/Appinfo';
import ImageWithFallback from '../../Components/ImageWithFallback/ImageWithFallback';

type Props = {
  navigation: any;
};
const Index = (props: Props) => {
  const { navigation } = props;

  const route = useRoute();
  const { item: routeItem } = route.params as any;
  const [item, setItem] = useState(routeItem);
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);

  // Sync local state when route params change (e.g. after edit)
  useEffect(() => {
    if (routeItem) {
      console.log("OffersDetails: item updated from route params");
      setItem(routeItem);
    }
  }, [routeItem]);

  const pricePerUnit = item.price;
  const minQty = 1;
  const maxQty = 1500;
  const [qty, setQty] = useState(1);
  const [totalPrice, setTotalPrice] = useState(item.price);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [visibleCancel, setVisibleCancel] = useState(false);

  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    showSuccess: false,
  });

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

  const addFavouritePaperOffer = (id: any) => {
    setState(old => ({ ...old, loading: true }));

    dispatch<any>(
      AddFavouritePaperOffer(id, (res, status) => {
        if (res.status === 200) {
        } else {
          toastNotfication({
            type: 'error',
            message: res?.message ?? t('Something Went wrong'),
          });
        }
        setState(old => ({ ...old, loading: false }));
      }),
    );
  };

  const deleteOffer = (id: any) => {
    setState(old => ({ ...old, loading: true }));

    dispatch<any>(
      DeleteOffer(
        {
          id: id,
          type: item.type,
        },
        (res, status) => {
          console.log('rrrrrr', res.status);

          if (res.status == 200) {
            setState(old => ({
              ...old,
              loading: false,
              showSuccess: true,
            }));

            setTimeout(() => {
              setState(old => ({ ...old, showSuccess: false }));
              navigation.reset({
                index: 0,
                routes: [{ name: 'Market' }],
              });
            }, 2000);
          } else {
            toastNotfication({
              type: 'error',
              message: res?.message ?? t('Something Went wrong'),
            });
            setState(old => ({ ...old, loading: false }));
          }
        },
      ),
    );
  };

  const fullDate = item.endDate?.split("T")[0].split("-").reverse().join("/");
  // const [date, time] = fullDate?.split("T");
  console.log('====================================');
  console.log('fffffffff', item);
  console.log('====================================');
  return (
    <Container showHint={false}>
      <HeaderWithText
        title={t('offer_details')}
        isShareVisible={true}
        onFavClick={() => {
          console.log(item);
          addFavouritePaperOffer(item.id);
        }}
        onShareClick={() => console.log()}
      />
      <CancelOrder
        visible={visibleCancel}
        onClose={() => setVisibleCancel(false)}
        onSubmit={() => {
          deleteOffer(item.id);
          setVisibleCancel(false);
        }}
        title={t('delete_offer')}
        body={t('confirmCancelOffer')}
        cancleText={t('yesCancelOffer')}
      />
      <Content style={styles.formCon} noPadding>
        <View>
          {/* <Image source={item.imageUrl} style={styles.productImage} resizeMode="contain" /> */}
          <ImageWithFallback
            uri={item?.imageUrl}
            type={item?.type}
            style={styles.productImage}
          />
          <View>
            <View style={styles.info}>
              {item.type == 1 && (
                <Text style={[layout.textAlign, styles.title]}>
                  {item.categoryName +
                    ' ' +
                    item.name +
                    ' ' +
                    item.width +
                    t('GM') +
                    ' ' +
                    item.paperSize}
                </Text>
              )}
              {item.type == 2 && (
                <Text style={[layout.textAlign, styles.title]}>
                  {item.categoryName + ' ' + item.name}
                </Text>
              )}
              {item.type == 3 && (
                <Text style={[layout.textAlign, styles.title]}>
                  {item.categoryName + ' ' + item.userName}
                </Text>
              )}

              {(item.type == 2 || item.type == 1) && (
                <Text style={[layout.textAlign, styles.priceText]}>
                  {item.type == 2
                    ? t('price_Cartage') + ' ' + item.price + t('pound')
                    : t('carton_price') + item.price + t('pound')}
                </Text>
              )}
              {item.coloredPrice && (
                <Text style={[layout.textAlign, styles.priceText]}>
                  {t('coloerPrinter') + item.coloredPrice + t('pound')}
                </Text>
              )}
              {item.nonColoredPrice && (
                <Text style={[layout.textAlign, styles.priceText]}>
                  {t('nonColoered') + item.nonColoredPrice + t('pound')}
                </Text>
              )}
              <View>
                {item.coloredPrice && (
                  <Text style={[layout.textAlign, styles.priceText]}>
                    {item.coloredPrice + t('pound')}
                  </Text>
                )}
                {item.nonColoredPrice && (
                  <Text style={[layout.textAlign, styles.priceText]}>
                    {item.nonColoredPrice + t('pound')}
                  </Text>
                )}
              </View>
              <View
                style={[layout.rowBox, { marginVertical: PixelPerfect(2) }]}
              >
                <Stars
                  rating={item.userRateAverage}
                  rateCount={item.userRateCount ?? item.rates}
                />
              </View>
            </View>
            <Space />

            {/* تحديد الكمية */}
            <View style={styles.info}>
              <View
                style={[
                  layout.rowBox,
                  {
                    justifyContent: 'space-between',
                    marginVertical: PixelPerfect(4),
                  },
                ]}
              >
                <Text style={[layout.textAlign, styles.note]}>
                  {t('minOrderQuantity')}
                </Text>
                <Text style={[layout.textAlign, styles.note1]}>{item.min}</Text>
              </View>
              <View
                style={[
                  layout.rowBox,
                  {
                    justifyContent: 'space-between',
                    marginVertical: PixelPerfect(4),
                  },
                ]}
              >
                <Text style={[layout.textAlign, styles.note]}>
                  {t('offerEndDate')}
                </Text>
                <Text style={[layout.textAlign, styles.note1]}>
                  {fullDate + ' ' + t('orUntilOutOfStock')}
                </Text>
              </View>
              <View
                style={[
                  layout.rowBox,
                  {
                    justifyContent: 'space-between',
                    marginVertical: PixelPerfect(4),
                  },
                ]}
              >
                <Text style={[layout.textAlign, styles.note]}>
                  {t('deliveryMethods')}
                </Text>
                <Text style={[layout.textAlign, styles.note1]}>
                  {' '}
                  {item.includeDelivery
                    ? t('deliveryAvailable')
                    : t('deliveryNotAvailable')}
                </Text>
              </View>
              <View
                style={[
                  layout.rowBox,
                  {
                    justifyContent: 'space-between',
                    marginTop: PixelPerfect(4),
                  },
                ]}
              >
                <Text style={[layout.textAlign, styles.totalPrice]}>
                  {t('totalPrice')}
                </Text>
                <Text style={[layout.textAlign, styles.totalPriceValue]}>
                  {totalPrice + ' ' + t('pound')}
                </Text>
              </View>
              <View
                style={[layout.rowBox, { justifyContent: 'space-between' }]}
              >
                <Text style={[layout.textAlign, styles.note]}>{''}</Text>
                <Text style={[layout.textAlign, styles.note2]}>
                  {t('excludingOtherFees')}
                </Text>
              </View>

              {/* وصف المنتج */}
              <View>
                <Text style={[layout.textAlign, styles.sellerTitle]}>
                  {t('productDescription')}
                </Text>
                <Text style={[layout.textAlign, styles.description]}>
                  {item.description}
                </Text>
                {/* <View style={[layout.rowBox, { justifyContent: "space-between",marginVertical:PixelPerfect(8) }]}>
                                <Text style={[layout.textAlign,styles.note]}>{t("type")}</Text>
                                <Text style={[layout.textAlign,styles.note1]}>{item.paperName}</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between",marginVertical:PixelPerfect(8) }]}>
                                <Text style={[layout.textAlign,styles.note]}>{t("size")}</Text>
                                <Text style={[layout.textAlign,styles.note1]}>{item.paperSize}</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between",marginVertical:PixelPerfect(8) }]}>
                                <Text style={[layout.textAlign,styles.note]}>{t("weight")}</Text>
                                <Text style={[layout.textAlign,styles.note1, { paddingBottom: PixelPerfect(8) }]}>{item.width + t("GM") + " "}</Text>
                            </View> */}
              </View>
              <Space />
              <TouchableOpacity
                style={[layout.rowBox, styles.orderBtn]}
                onPress={() => {
                  navigation.navigate('EditOffer', {
                    item: item,
                    type:
                      item.type == 1
                        ? 'Paper'
                        : item.type == 2
                        ? 'Inks'
                        : 'Printers',
                  });
                }}
              >
                <View style={[styles.icon]}>
                  <EditIcon />
                </View>
                <Text style={[layout.textAlign, styles.orderBtnText]}>
                  {t('edit')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[layout.rowBox, styles.cancelBtn]}
                onPress={() => {
                  setVisibleCancel(true);
                }}
              >
                <View style={[styles.icon]}>
                  <CancelIcon />
                </View>
                <Text style={[layout.textAlign, styles.cancelText]}>
                  {t('delete')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <SignUpSuccess show={state.showSuccess} title={t('orderSentSuccess')} />
      </Content>
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
    formCon: {
      flex: 1,
      backgroundColor: theme.mainColor,
    },
    icon: {
      paddingHorizontal: PixelPerfect(2),
    },
    cancelText: {
      lineHeight: PixelPerfect(25),
      fontSize: PixelPerfect(16),
      fontFamily: Fonts.bold,
      color: theme.red,
    },
    productImage: {
      width: '100%',
      height: PixelPerfect(187),
      borderRadius: PixelPerfect(8),

      marginBottom: PixelPerfect(10),
    },
    info: {
      paddingHorizontal: PixelPerfect(16),
      gap: PixelPerfect(8),
    },
    title: {
      lineHeight: PixelPerfect(25),
      fontSize: PixelPerfect(16),
      color: theme.black,
      fontFamily: Fonts.bold,

      marginBottom: PixelPerfect(4),
    },
    rowSpace: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: PixelPerfect(8),
    },
    priceText: {
      lineHeight: PixelPerfect(25),
      fontSize: PixelPerfect(16),
      color: theme.babyBlue,
      fontFamily: Fonts.medium,
    },

    sellerRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginBottom: PixelPerfect(8),
    },
    sellerTitle: {
      lineHeight: PixelPerfect(25),
      fontSize: PixelPerfect(18),
      fontFamily: Fonts.medium,
      marginBottom: PixelPerfect(4),
      color: theme.babyBlue,
    },
    sellerImage: {
      width: PixelPerfect(32),
      height: PixelPerfect(32),
      borderRadius: PixelPerfect(25),
      marginLeft: PixelPerfect(4),
    },

    sellerName: {
      lineHeight: PixelPerfect(25),
      fontSize: PixelPerfect(18),
      fontFamily: Fonts.medium,
      color: theme.black,
      textAlign: 'right',
    },

    text1: {
      color: theme.currenctText,
      fontSize: PixelPerfect(14),
      fontFamily: Fonts.medium,
      textAlign: 'right',
      marginTop: Platform.OS == 'ios' ? 3 : 0,
    },

    quantityRow: {
      alignItems: 'center',
      alignContent: 'center',
      alignSelf: 'center',
    },
    qtyBtn: {
      width: PixelPerfect(40),
      height: PixelPerfect(40),
      backgroundColor: theme.textColor,
      borderRadius: PixelPerfect(8),
      justifyContent: 'center',
      alignItems: 'center',
    },
    qtyText: { color: theme.white, fontSize: 18 },
    qtyValue: {
      lineHeight: PixelPerfect(50),
      marginHorizontal: PixelPerfect(20),
      fontSize: PixelPerfect(32),
      fontFamily: Fonts.medium,
    },
    note: {
      fontSize: PixelPerfect(16),
      fontFamily: Fonts.regular,
      color: theme.textColor,
      lineHeight: PixelPerfect(20),
    },
    note1: {
      textAlign: 'right',
      fontSize: PixelPerfect(16),
      fontFamily: Fonts.regular,
      color: theme.black,
      lineHeight: PixelPerfect(20),
    },
    note2: {
      fontSize: PixelPerfect(10),
      fontFamily: Fonts.extraLight,
      color: theme.black,
      lineHeight: PixelPerfect(20),
    },
    totalPrice: {
      fontSize: PixelPerfect(16),
      fontFamily: Fonts.medium,
      color: theme.textColor,
      lineHeight: PixelPerfect(25),
    },
    totalPriceValue: {
      fontSize: PixelPerfect(14),
      fontFamily: Fonts.bold,
      color: theme.textColor,
      lineHeight: PixelPerfect(20),
    },

    orderBtn: {
      height: PixelPerfect(50),
      backgroundColor: theme.babyBlue,
      borderRadius: PixelPerfect(8),
      padding: PixelPerfect(12),
      marginVertical: PixelPerfect(8),
      alignItems: 'center',
      justifyContent: 'center',
    },
    orderBtnText: {
      lineHeight: PixelPerfect(25),
      color: theme.white,
      fontSize: PixelPerfect(16),
      fontFamily: Fonts.bold,
    },
    description: {
      lineHeight: PixelPerfect(20),
      textAlign: 'right',
      fontSize: PixelPerfect(14),
      color: theme.black,
      fontFamily: Fonts.regular,
      marginBottom: PixelPerfect(8),
    },
    cancelBtn: {
      flex: 1,
      height: PixelPerfect(50),
      borderWidth: 1,
      borderColor: theme.red,
      borderRadius: PixelPerfect(6),
      paddingVertical: PixelPerfect(10),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: PixelPerfect(20),
    },
  });
