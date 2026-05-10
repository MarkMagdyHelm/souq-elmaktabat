import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Container, Content } from '../../Components/containers/Containers';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import {
  Colors,
  PixelPerfect,
  phoneWidth,
} from '../../Constants/styleConstants';
import { t } from 'i18next';
import { GrayRate, RateIcone } from '../../Assets/Svg';
import { useToast } from 'react-native-toast-notifications';
import Product from '../../Components/Cards/Product';
import Space from '../../Helper/Space';
import RateItem from '../../Components/Cards/RateItem';
import SellerBranches from '../../Components/Cards/SellerBranches';
import { useRoute } from '@react-navigation/native';
import { GetNamesByLang } from '../../Helper';
import Stars from '../../Helper/Stars';
import { GetMyPaperOffers, GetSellerData } from '../../Apis/HomeApis';
import { useDispatch, useSelector } from 'react-redux';
import {
  AddFavouritePaperOffer,
  GetMyBranches,
  UserProfile,
} from '../../Apis/CommonApi';
import { AddFavouriteUser, UserRate } from '../../Apis/Appinfo';
import { RootState } from '../../Store/store';
import CancelOrder from '../../Components/PopUps/CancelOrder';
import { logoutHandler } from '../../Apis/User';
import ImageWithFallback from '../../Components/ImageWithFallback/ImageWithFallback';

type Props = {
  navigation?: any;
};

const Index = (props: Props) => {
  const { navigation } = props;

  const { Fonts, layout, theme, dark, dir } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark);
  const [tab, setTab] = useState('offers');
  const toast = useToast();
  const dispatch = useDispatch();
  const { seller } = useRoute().params as any;
  const [visibleCancel, setVisibleCancel] = useState(false);

  const { isLogin } = useSelector((state: RootState) => state.auth);

  const [state, setstate] = useState({
    loading: false,
    viewRate: false,
    viewOffers: true,
    offers: [],
    branches: [],
    userProfile: null,
    userRate: null,
    viewInformation: false,
    paperSize: null,
    paperType: null,
    requestsPage: 1,
    hasMoreRequests: true,
    loadingMore: false,
    sellerData: null,
    allOffers: [],
  });

  useEffect(() => {
    // getMyPaperOffers()
    // getMyBranches()
    // userProfile()
    // userRate()
    getSellerData();
  }, []);

  const getMyPaperOffers = (page: number = 1, loadMore: boolean = false) => {
    if (loadMore) {
      setstate(old => ({ ...old, loadingMore: true }));
    } else {
      setstate(old => ({ ...old, loading: true }));
    }

    dispatch<any>(
      GetMyPaperOffers(
        {
          page: page.toString(),
          pageSize: '10',
        },
        (res, status) => {
          if (res.status === 200) {
            console.log('===============itemsitemsitems=====================');
            console.log(res.data.items);
            console.log('====================================');

            const newItems = res.data.items;
            setstate(old => ({
              ...old,
              offers: loadMore ? [...old.offers, ...newItems] : newItems,
              requestsPage: page,
              hasMoreRequests: newItems.length === 10,
              loading: false,
              loadingMore: false,
            }));
          } else {
            toastNotfication({
              type: 'error',
              message: res?.Message ?? t('Something Went wrong'),
            });
            setstate(old => ({ ...old, loading: false }));
          }
        },
      ),
    );
  };

  const addFavouritePaperOffer = (item: any) => {
    setstate(old => ({ ...old, loading: true }));

    dispatch<any>(
      AddFavouritePaperOffer(item.id, (res, status) => {
             console.log("rrrrrrr",item);
            console.log("rrrrrrr",res);
        if (res.status === 200) {
          setTimeout(() => {
            item.isFavourite = !item.isFavourite;
            setstate(old => ({ ...old, loading: false }));
          }, 500);
        } else {
          toastNotfication({
            type: 'error',
            message: res?.Message ?? t('Something Went wrong'),
          });
        }
        setstate(old => ({ ...old, loading: false }));
      }),
    );
  };

  const getMyBranches = () => {
    setstate(old => ({ ...old, loading: true }));

    dispatch<any>(
      GetMyBranches((res, status) => {
        if (res.status === 200) {
          setstate(old => ({ ...old, branches: res.branches }));
        } else {
          toastNotfication({
            type: 'error',
            message: res?.Message ?? t('Something Went wrong'),
          });
        }
        setstate(old => ({ ...old, loading: false }));
      }),
    );
  };
  const userProfile = () => {
    setstate(old => ({ ...old, loading: true }));
    dispatch<any>(
      UserProfile((res, status) => {
        if (res.status === 200) {
          console.log('------userProfile--------');

          console.log(res.data[0]);
          console.log('--------------');

          setstate(old => ({ ...old, userProfile: res.data[0] }));
        } else {
          toastNotfication({
            type: 'error',
            message: res?.Message ?? t('Something Went wrong'),
          });
        }
        setstate(old => ({ ...old, loading: false }));
      }),
    );
  };
  const userRate = () => {
    setstate(old => ({ ...old, loading: true }));
    dispatch<any>(
      UserRate((res, status) => {
        if (res.status === 200) {
          setstate(old => ({ ...old, userRate: res.data }));
        } else {
          toastNotfication({
            type: 'error',
            message: res?.Message ?? t('Something Went wrong'),
          });
        }
        setstate(old => ({ ...old, loading: false }));
      }),
    );
  };

  const getSellerData = () => {
    setstate(old => ({ ...old, loading: true }));
    dispatch<any>(
      GetSellerData(seller.id, (res, status) => {
        if (res.status === 200) {
          const allOffers = [
            ...res.data.offers.paperOffers,
            ...res.data.offers.inkOffers,
            ...res.data.offers.printingPressesOffers,
          ];
          setstate(old => ({
            ...old,
            sellerData: res.data,
            allOffers: allOffers,
          }));
          console.log('------sellerData--------');
          console.log('-sellerData-', res.data);
          console.log('--------------');

          setstate(old => ({ ...old, sellerData: res.data, loading: false }));
        }
      }),
    );
  };

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
  const handleSelectProduct = item => {
    if (item?.isMine) {
      if (isLogin) {
        navigation.navigate('OffersDetails', { item: item });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Signin' } as any],
        });
      }
    } else {
      if (isLogin) {
        navigation.navigate('ProductDetails', { item: item });
      } else {
          setVisibleCancel(true);
      }
    }
  };

  const handleLoadMore = () => {
    if (!state.loadingMore && state.hasMoreRequests) {
    }
  };

  const handleRefresh = () => {
    setstate(old => ({ ...old, sections: [] }));
    const renderFooter = () => {
      if (!state.loadingMore) return null;
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={theme.babyBlue} />
        </View>
      );
    };
  };
  const renderFooter = () => {
    if (!state.loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.babyBlue} />
      </View>
    );
  };

  const handleRate = () => {
    setstate(old => ({
      ...old,
      viewRate: true,
      viewOffers: false,
      viewInformation: false,
    }));
  };
  const handleOffers = () => {
    setstate(old => ({
      ...old,
      viewRate: false,
      viewOffers: true,
      viewInformation: false,
    }));
  };
  const handleInformations = () => {
    setstate(old => ({
      ...old,
      viewRate: false,
      viewOffers: false,
      viewInformation: true,
    }));
  };
  const addFav = (id: any) => {
    setstate(old => ({ ...old, loading: true }));
        console.log('rrrrrrr', id);

    dispatch<any>(
      AddFavouriteUser(id, (res, status) => {
      //   console.log('rrrrrrr', id);
        console.log('rrrrrrr', res);
        if (res.status === 200) {
          seller.isFavourite = !seller.isFavourite;
          setstate(old => ({ ...old, loading: false }));
        } else {
          toastNotfication({
            type: 'error',
            message: res?.Message ?? t('Something Went wrong'),
          });
        }
        setstate(old => ({ ...old, loading: false }));
      }),
    );
  };
  return (
    <Container showHint={false}>
        <CancelOrder
        visible={visibleCancel}
        onClose={() => setVisibleCancel(false)}
        onSubmit={() => {
          setVisibleCancel(false);
          dispatch<any>(logoutHandler());
 navigation.reset({
              index: 0,
              routes: [{ name: 'Signin' }],
            } as any);        }}
        title={t('signtxt1')}
        body={''}
        cancleText={t('Sign in')}
        SignIn={true}
      />
      <View style={styles.con}>
        <HeaderWithText
          isShareVisible={true}
          style={{ backgroundColor: theme.white }}
          isFavVisible={true}
          isFaverouit={seller.isFavourite}
          onFavClick={() => {
            console.log('ssssss', seller);

            addFav(seller.userId);
          }}
          onShareClick={() => {}}
          title={t('')}
        />
        <View
          style={[
            layout.rowBox,
            { alignItems: 'center', flex: 0.1, backgroundColor: theme.white },
          ]}
        >
          {/* <Image
            source={{ uri: seller.userImages ?? seller.imageURL }}
            style={[styles.imageRound]}
          /> */}
            <ImageWithFallback
                uri={seller.userImages ?? seller.imageURL}
                type={0}
                style={styles.imageRound}
              />
          <View style={{ marginHorizontal: PixelPerfect(8) }}>
            <Text style={[layout.textAlign, styles.seller]}>
              {seller.userName ?? seller.name}
            </Text>
            <View style={[layout.rowBox, { marginTop: PixelPerfect(4) }]}>
              <Stars
                rating={seller.userRateAverage ?? seller.rate}
                rateCount={seller.userRateCount ?? seller.rateCount}
              />
            </View>
          </View>
        </View>
        {/* Tabs */}
        <View style={[layout.rowBox, styles.tabs]}>
          <Pressable
            style={[styles.tab, tab === 'offers' && styles.activeTab]}
            onPress={() => {
              setTab('offers');
              handleOffers();
            }}
          >
            <Text
              style={[styles.tabText, tab === 'offers' && styles.activeTabText]}
            >
              {t('offers')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, tab === 'informations' && styles.activeTab]}
            onPress={() => {
              setTab('informations');
              handleInformations();
            }}
          >
            <Text
              style={[
                styles.tabText,
                tab === 'informations' && styles.activeTabText,
              ]}
            >
              {t('informations')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, tab === 'Ratings' && styles.activeTab]}
            onPress={() => {
              setTab('Ratings');
              handleRate();
            }}
          >
            <Text
              style={[
                styles.tabText,
                tab === 'Ratings' && styles.activeTabText,
              ]}
            >
              {t('Ratings')}
            </Text>
          </Pressable>
        </View>

        {state.viewOffers && (
          <View
            style={{
              paddingTop: PixelPerfect(16),
              backgroundColor: theme.accordianBody,
              flex: 0.7,
              paddingHorizontal: PixelPerfect(16),
            }}
          >
            <FlatList
              data={state.allOffers}
              keyExtractor={item => item.id + ''}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Product
                  isOfffer={true}
                  item={item}
                  onPress={() => {
                    handleSelectProduct(item);
                  }}
                  onFavPress={() => {
                    addFavouritePaperOffer(item.id);
                  }}
                />
              )}
              numColumns={2}
              columnWrapperStyle={{
                marginVertical: PixelPerfect(4),
                justifyContent:
                  state.sellerData?.offers?.paperOffers?.length === 1
                    ? 'flex-end'
                    : 'space-between',
              }}
              // onEndReached={handleLoadMore}
              // onEndReachedThreshold={0.5}
              // ListFooterComponent={renderFooter}
              // refreshing={state.loading}
              // onRefresh={handleRefresh}
            />
          </View>
        )}
        {state.viewRate && (
          <View
            style={{
              marginTop: PixelPerfect(16),
              backgroundColor: theme.accordianBody,
              flex: 0.7,
            }}
          >
            {/* Header */}
            <View style={[styles.header]}>
              <Text style={[layout.textAlign, styles.title]}>
                {t('seller_rate')}
              </Text>

              {/* Overall Rating */}
              <View style={[layout.rowBox, styles.starsRow]}>
                <Stars
                  rating={state.sellerData?.rate}
                  rateCount={state.sellerData?.rateCount}
                />
              </View>
            </View>

            <FlatList
              style={{ marginBottom: PixelPerfect(10) }}
              data={state.sellerData?.rates}
              keyExtractor={item => item.id + ''}
              renderItem={({ item }) => (
                <>
                  <View style={styles.starsRow}>
                    <RateItem
                      item={item}
                      onPress={function (): void {
                        throw new Error('Function not implemented.');
                      }}
                    />
                  </View>
                </>
              )}
            />
          </View>
        )}

        {state.viewInformation && (
          <View
            style={{
              paddingTop: PixelPerfect(16),

              flex: 0.7,
            }}
          >
            <Content noPadding>
              {/* About */}
              <View style={styles.block}>
                <Text style={[layout.textAlign, styles.blockTitle]}>
                  {t('aboutCompany')}
                </Text>
                <Text style={[layout.textAlign, styles.paragraph]}>
                  {t('specializedIn')} {t('specializedIn')}
                </Text>
              </View>

              {/* Tools - inline separated like design */}
              <View style={styles.block}>
                <Text style={[layout.textAlign, styles.blockTitle]}>
                  {t('companyTools')}
                </Text>
                <View style={[layout.rowBox, styles.listRow]}>
                  {[
                    t('paper'),
                    t('inks'),
                    t('photocopyMachines'),
                    t('officeSupplies'),
                  ].map((txt, idx, arr) => (
                    <View key={idx} style={[layout.rowBox, styles.listPair]}>
                      <Text style={[layout.textAlign, styles.listItem]}>
                        {txt}
                      </Text>
                      {idx !== arr.length - 1 && (
                        <Text style={styles.separatorDot}>·</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
              {/* <Space /> */}
              {/* Activity (outlined box) - inline separated */}
              <View style={[styles.block]}>
                <Text style={[layout.textAlign, styles.blockTitle]}>
                  {t('companyActivity')}
                </Text>
                <View style={[layout.rowBox, styles.listRow]}>
                  {[t('libraries'), t('supplyCompanies'), t('printing')].map(
                    (txt, idx, arr) => (
                      <View key={idx} style={[layout.rowBox, styles.listPair]}>
                        <Text style={[layout.textAlign, styles.listItem]}>
                          {txt}
                        </Text>
                        {idx !== arr.length - 1 && (
                          <Text style={styles.separatorDot}>·</Text>
                        )}
                      </View>
                    ),
                  )}
                </View>
              </View>
              {/* <Space /> */}
              {/* Payment methods */}
              <View style={[styles.block]}>
                <Text style={[layout.textAlign, styles.blockTitle]}>
                  {t('paymentMethods')}
                </Text>
                <Text style={[layout.textAlign, styles.bullets]}>
                  • {t('bankCard')}
                </Text>
                <Text style={[layout.textAlign, styles.bullets]}>
                  • {t('electronicWallets')}
                </Text>
                <Text style={[layout.textAlign, styles.bullets]}>
                  • {t('cashOnDelivery')}
                </Text>
              </View>
              {/* <Space /> */}
              <View style={styles.block}>
                <Text style={[layout.textAlign, styles.blockTitle]}>
                  {t('branches')}
                </Text>
                <FlatList
                  data={state.branches}
                  keyExtractor={item => item.id + ''}
                  renderItem={({ item }) => (
                    <SellerBranches
                      viewRadio={false}
                      onPress={function (): void {
                        console.log('');
                      }}
                      backgroundColor={theme.white}
                    />
                  )}
                />
              </View>
            </Content>
          </View>
        )}
      </View>
    </Container>
  );
};

export default Index;

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean) =>
  StyleSheet.create({
    con: {
      flex: 1,
      backgroundColor: theme.accordianBody,
    },
    header: {
      marginTop: PixelPerfect(16),
      marginBottom: PixelPerfect(8),
      alignItems: 'center',
    },
    imageRound: {
      height: PixelPerfect(80),
      width: PixelPerfect(80),
      borderRadius: PixelPerfect(80),
      marginRight: PixelPerfect(4),
    },

    text: {
      lineHeight: PixelPerfect(18),
      color: theme.orange,
      fontSize: PixelPerfect(12),
      fontFamily: Fonts.regular,
    },
    seller: {
      color: theme.black,
      fontSize: PixelPerfect(20),
      fontFamily: Fonts.bold,
      lineHeight: PixelPerfect(25),
    },
    tabs: {
      flex: 0.1,
      paddingVertical: PixelPerfect(16),
      paddingHorizontal: PixelPerfect(16),
      backgroundColor: theme.white,
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
      lineHeight: PixelPerfect(25),
      fontSize: PixelPerfect(18),
      color: theme.black,
      fontFamily: Fonts.medium,
    },
    activeTabText: {
      lineHeight: PixelPerfect(25),
      color: theme.white,
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(18),
    },
    footerLoader: {
      paddingVertical: PixelPerfect(20),
      alignItems: 'center',
    },
    countText: {
      lineHeight: PixelPerfect(35),
      fontSize: PixelPerfect(24),
      color: theme.orange,
      fontFamily: Fonts.regular,
      marginTop: PixelPerfect(4),
    },

    starsRow: {
      width: '95%',
      justifyContent: 'center',
      backgroundColor: theme.white,
      borderRadius: PixelPerfect(16),
      paddingVertical: PixelPerfect(12),
      paddingHorizontal: PixelPerfect(14),
      marginTop: PixelPerfect(12),
      marginHorizontal: PixelPerfect(16),
      shadowColor: theme.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,

      gap: PixelPerfect(10),
    },
    title: {
      lineHeight: PixelPerfect(20),
      fontSize: PixelPerfect(16),
      fontFamily: Fonts.medium,
      color: theme.babyBlue,
    },

    avatar: {
      width: PixelPerfect(70),
      height: PixelPerfect(70),
      borderRadius: PixelPerfect(35),
      marginBottom: PixelPerfect(8),
    },

    rating: {
      marginTop: PixelPerfect(4),
      color: '#FFA800',
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(14),
    },

    block: {
      backgroundColor: theme.white,
      borderRadius: PixelPerfect(16),
      paddingVertical: PixelPerfect(12),
      paddingHorizontal: PixelPerfect(14),
      marginVertical: PixelPerfect(12),
      marginHorizontal: PixelPerfect(16),
      shadowColor: theme.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
    },
    outlined: {
      borderWidth: 0,
      backgroundColor: Colors.white,
    },
    blockTitle: {
      lineHeight: PixelPerfect(20),
      fontFamily: Fonts.medium,
      color: theme.textColor,
      fontSize: PixelPerfect(16),
      marginBottom: PixelPerfect(10),
    },
    paragraph: {
      fontFamily: Fonts.regular,
      color: theme.black,
      lineHeight: PixelPerfect(22),
      fontSize: PixelPerfect(14),
    },

    bullets: {
      lineHeight: PixelPerfect(20),
      fontFamily: Fonts.regular,
      color: theme.black,
      fontSize: PixelPerfect(14),

      marginBottom: PixelPerfect(2),
    },
    listRow: {
      width: '100%',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    listPair: {
      alignItems: 'center',
      marginBottom: PixelPerfect(6),
    },
    listItem: {
      lineHeight: PixelPerfect(20),
      color: theme.black,
      fontFamily: Fonts.regular,
      fontSize: PixelPerfect(14),
      marginLeft: PixelPerfect(6),
    },
    separatorDot: {
      lineHeight: PixelPerfect(20),
      color: theme.black,
      fontSize: PixelPerfect(18),
      marginHorizontal: PixelPerfect(4),
    },
  });
