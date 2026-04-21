import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  Pressable,
  TextInput,
} from 'react-native';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import SellerBranches from '../../Components/Cards/SellerBranches';
import { Container, Content } from '../../Components/containers/Containers';
import { useRoute } from '@react-navigation/native';
import { AddPaperOfferRequest } from '../../Apis/Request';
import { useDispatch } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import SignUpSuccess from '../../Components/PopUps/SignUpSuccess';
import { t } from 'i18next';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import { RateIcone } from '../../Assets/Svg';
import Stars from '../../Helper/Stars';
import Space from '../../Helper/Space';
import {
  AddFavouriteInkOffer,
  AddFavouritePaperOffer,
  AddFavouritePrintingPressesOffer,
} from '../../Apis/CommonApi';

type Props = {
  navigation: any;
  sectionID: string;
};
const Index = (props: Props) => {
  const { navigation } = props;

  const { item, sectionID } = useRoute().params as any;
  console.log('yyyyyyyyy', item);

  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);

  const pricePerUnit = item.price;
  const minQty = 1;
  const maxQty = 1500;
  const [qty, setQty] = useState(1);
  const [totalPrice, setTotalPrice] = useState(item.price);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    showSuccess: false,
    isImediatePrinting: false,
    isdelervable: false,
  });
  const handelDelery = () => {
    setState(old => ({ ...old, isdelervable: !old.isdelervable }));
  };

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

  const total = useMemo(() => pricePerUnit * qty, [pricePerUnit, qty]);

  const decrease = () => {
    setQty(prev => {
      const next = prev - 1;
      if (next < minQty) {
        Alert.alert(t('alert'), `${t('minQuantityAlert')} ${minQty}.`);
        return prev;
      }
      setTotalPrice(next * item.price);
      return next;
    });
  };

  const increase = () => {
    setQty(prev => {
      const next = prev + 1;

      if (next > maxQty) {
        Alert.alert(t('alert'), `${t('maxQuantityAlert')} ${maxQty}.`);
        return prev;
      }
      setTotalPrice(next * item.price);
      return next;
    });
  };

  const addFavouritePaperOffer = (id: any) => {
    setState(old => ({ ...old, loading: true }));

    dispatch<any>(
      AddFavouritePaperOffer(id, (res, status) => {
        if (res.status === 200) {
          setTimeout(() => {
            item.isFavourite = !item.isFavourite;
            setState(old => ({ ...old, loading: false }));
          }, 500);
        } else {
          toastNotfication({
            type: 'error',
            message: res?.Message ?? t('Something Went wrong'),
          });
        }
        setState(old => ({ ...old, loading: false }));
      }),
    );
  };

  const addFavouriteInkOffer = (id: any) => {
    setState(old => ({ ...old, loading: true }));

    dispatch<any>(
      AddFavouriteInkOffer(id, (res, status) => {
        if (res.status === 200) {
          setTimeout(() => {
            item.isFavourite = !item.isFavourite;
            setState(old => ({ ...old, loading: false }));
          }, 500);
        } else {
          toastNotfication({
            type: 'error',
            message: res?.Message ?? t('Something Went wrong'),
          });
        }
        setState(old => ({ ...old, loading: false }));
      }),
    );
  };

    const addFavouritePrintingPressesOffer = (id: any) => {
    setState(old => ({ ...old, loading: true }));

    dispatch<any>(
      AddFavouritePrintingPressesOffer(id, (res, status) => {
        if (res.status === 200) {
          setTimeout(() => {
            item.isFavourite = !item.isFavourite;
            setState(old => ({ ...old, loading: false }));
          }, 500);
        } else {
          toastNotfication({
            type: 'error',
            message: res?.Message ?? t('Something Went wrong'),
          });
        }
        setState(old => ({ ...old, loading: false }));
      }),
    );
  };
  const addPaperOfferRequest = () => {
    setState(old => ({ ...old, loading: true }));

    dispatch<any>(
      AddPaperOfferRequest(
        item.type == 1
          ? {
              paperOfferId: item.id,
              paperOfferBranchId: selectedBranchId,
              quantity: qty,
              totalPrice: totalPrice,
              type: item.type,
            }
          : item.type == 2
          ? {
              inkOfferId: item.id,
              inkOfferBranchId: selectedBranchId,
              quantity: qty,
              totalPrice: totalPrice,
              type: item.type,
            }
          : {
              printingPressOfferId: item.id,
              printingPressOfferBranchId: selectedBranchId,
              isColored: state.isdelervable,
            },
        (res, status) => {
          if (res.status === 200) {
            setState(old => ({
              ...old,
              requests: res.data.items ?? [],
              loading: false,
              showSuccess: true,
            }));

            setTimeout(() => {
              setState(old => ({ ...old, showSuccess: false }));
              navigation.navigate('MyOrders');
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

  const fullDate = item?.endDate;
  const [date, time] = fullDate?.split('T');
  return (
    <Container showHint={false}>
      <HeaderWithText
        title={t('productDetailsTitle')}
        isShareVisible={false}
        isFavVisible={true}
        isFaverouit={item?.isFavourite}
        onFavClick={() => {
          if (sectionID === 1) {
            addFavouritePaperOffer(item.id);
          } else if (sectionID === 2) {
            addFavouriteInkOffer(item.id)
          } else if (sectionID === 3) {
            addFavouritePrintingPressesOffer(item.id)
          }
        }}
        onShareClick={() => console.log()}
      />
      <Content style={styles.formCon} noPadding>
        <View>
          <Image
            source={item.paperPhoto}
            style={styles.productImage}
            resizeMode="contain"
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

              <View
                style={[layout.rowBox, { marginVertical: PixelPerfect(2) }]}
              >
                <Stars
                  rating={item.userRateAverage}
                  rateCount={item.userRateCount}
                />
              </View>
            </View>
            <Space />
            {/* seller Info  */}
            <View style={styles.info}>
              <Text style={[layout.textAlign, styles.sellerTitle]}>
                {t('sellerInfo')}
              </Text>
              <View style={styles.sellerRow}>
                <Image
                  source={{ uri: item.userImages }}
                  style={styles.sellerImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[layout.textAlign, styles.sellerName]}>
                    {item.userName}
                  </Text>
                </View>
                <Stars
                  rating={item.userRateAverage}
                  rateCount={item.userRateCount}
                />
              </View>
            </View>
            <Space />
            {/* "select branch" */}
            <View style={styles.info}>
              <Text style={[layout.textAlign, styles.sellerTitle]}>
                {t('select_branch')}
              </Text>

              <FlatList
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                //   onRefresh={() =>{}}
                //   refreshing={isFetching}

                data={item.branches}
                keyExtractor={(items, index: number) => index.toString()}
                // ItemSeparatorComponent={() => (state.loading ? null : <View style={styles.separator} />)}
                renderItem={({ item }) => {
                  return (
                    <>
                      <SellerBranches
                        viewRadio={true}
                        item={item}
                        onPress={() => setSelectedBranchId(item.id)}
                        selected={selectedBranchId === item.id}
                        backgroundColor={theme.accordianBody}
                      />
                    </>
                  );
                }}
              />
            </View>
            <Space />
            {item.type == 3 ? (
              <View style={styles.selectMenueCon}>
                <Text style={[layout.textAlign, styles.label]}>
                  {t('SelectPrintertype')}
                </Text>
                <View
                  style={[
                    layout.rowBox,
                    styles.selectMenue,
                    { borderWidth: 0, marginBottom: 0 },
                  ]}
                >
                  <Pressable
                    style={[layout.rowBox, styles.yesNocon]}
                    onPress={handelDelery}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        {
                          borderColor: state.isdelervable
                            ? theme.active
                            : theme.gray,
                        },
                      ]}
                    >
                      {state.isdelervable ? (
                        <View style={styles.radioButtonSelected} />
                      ) : null}
                    </View>
                    <Text
                      style={[
                        styles.textselectmenu,
                        { paddingHorizontal: PixelPerfect(5) },
                      ]}
                    >
                      {t('coloerPrinter')}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[layout.rowBox, styles.yesNocon]}
                    onPress={handelDelery}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        {
                          borderColor: !state.isdelervable
                            ? theme.active
                            : theme.gray,
                        },
                      ]}
                    >
                      {!state.isdelervable ? (
                        <View style={styles.radioButtonSelected} />
                      ) : null}
                    </View>
                    <Text
                      style={[
                        styles.textselectmenu,
                        { paddingHorizontal: PixelPerfect(5) },
                      ]}
                    >
                      {t('nonColoered')}
                    </Text>
                  </Pressable>
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
                    {date + ' ' + t('orUntilOutOfStock')}
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
              </View>
            ) : (
              <View style={styles.info}>
                <View
                  style={[
                    layout.rowBox,
                    { justifyContent: 'space-between', alignItems: 'center' },
                  ]}
                >
                  <Text style={styles.sellerTitle}>{t('selectQuantity')}</Text>
                  <View style={[layout.dirRow, styles.quantityRow]}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={decrease}>
                      <Text style={styles.qtyText}>-</Text>
                    </TouchableOpacity>
                    {/* <Text style={styles.qtyValue}>{qty}</Text> */}
                    <TextInput
                      style={styles.qtyValue}
                      value={String(qty)}
                      onChangeText={text => setQty(Number(text))}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.qtyBtn} onPress={increase}>
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                  </View>
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
                    {t('minOrderQuantity')}
                  </Text>
                  <Text style={[layout.textAlign, styles.note1]}>
                    {item.min}
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
                    {t('offerEndDate')}
                  </Text>
                  <Text style={[layout.textAlign, styles.note1]}>
                    {date + ' ' + t('orUntilOutOfStock')}
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
              </View>
            )}

            {/* تحديد الكمية */}

            <TouchableOpacity
              style={styles.orderBtn}
              onPress={() => {
                if (qty < item.min) {
                  toastNotfication({
                    type: 'error',
                    message: 'Quantity less than min quantity',
                  });
                } else if (selectedBranchId === null) {
                  toastNotfication({
                    type: 'error',
                    message: 'Please select Branch',
                  });
                } else {
                  // navigation.navigate("MyOrders")
                  addPaperOfferRequest();
                }
              }}
            >
              <Text style={[layout.textAlign, styles.orderBtnText]}>
                {t('sendOrder')}
              </Text>
            </TouchableOpacity>

            <Space />
            {/* وصف المنتج */}
            <View style={styles.info}>
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

    productImage: {
      width: '100%',
      height: PixelPerfect(187),
      borderRadius: PixelPerfect(8),

      marginBottom: PixelPerfect(10),
    },
    info: {
      paddingHorizontal: PixelPerfect(16),
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
      marginHorizontal: PixelPerfect(16),
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
    yesNocon: {
      alignItems: 'center',
      flex: 0.5,
    },
    selectMenueCon: {
      marginTop: PixelPerfect(10),
      marginHorizontal: PixelPerfect(16),
    },
    label: {
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(18),
      color: theme.black,
      marginBottom: PixelPerfect(10),
      lineHeight: PixelPerfect(20),
    },
    selectMenue: {
      justifyContent: 'space-between',
      backgroundColor: Colors.white,
      height: PixelPerfect(50),
      alignItems: 'center',
      borderRadius: PixelPerfect(8),
      paddingHorizontal: PixelPerfect(10),
      marginBottom: PixelPerfect(20),
      borderWidth: PixelPerfect(1),
      borderColor: theme.optionText,
    },
    radioButton: {
      height: PixelPerfect(20),
      width: PixelPerfect(20),
      borderRadius: PixelPerfect(20) / 2,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioButtonSelected: {
      height: PixelPerfect(10),
      width: PixelPerfect(10),
      borderRadius: PixelPerfect(10) / 2,
      backgroundColor: theme.active,
    },
    textselectmenu: {
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(16),
      color: theme.deactive,
    },
  });
