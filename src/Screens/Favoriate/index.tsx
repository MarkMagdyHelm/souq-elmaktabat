import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  I18nManager,
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
import Product from '../../Components/Cards/Product';
import { t } from 'i18next';
import SellerItem from '../../Components/Cards/SellersItem';
import { useDispatch } from 'react-redux';
import { AddFavouriteUser, GetFavouriteOffers } from '../../Apis/Appinfo';
import { useToast } from 'react-native-toast-notifications';
import {
  AddFavouritePaperOffer,
  GetFavouriteUsers,
} from '../../Apis/CommonApi';

type Props = { navigation?: any };

const Index = ({ navigation }: Props) => {
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme);

  const [tab, setTab] = useState<'offers' | 'sellers'>('offers');

  // demo data
  // const sellers = Array.from({ length: 3 }).map((_, i) => ({ id: `s${i}`, name: 'مكتبة النور', city: 'مصر', area: 'القاهرة', rating: 5, ratingCount: 125, items: 67 }))

  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    showSuccess: false,
    offers: [],
    users: [],
  });
  useEffect(() => {
    getFavouriteOffers();
    getFavouriteUsers();
  }, []);

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
    // setState(old => ({ ...old, loading: true }))

    dispatch<any>(
      AddFavouritePaperOffer(id, (res, status) => {
        if (res.status === 200) {
          setTimeout(() => {
            getFavouriteOffers();
          }, 1000);
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

  const getFavouriteOffers = () => {
    setState(old => ({ ...old, loading: true }));
    dispatch<any>(
      GetFavouriteOffers((res, status) => {
        if (res.status === 200) {
          console.log('===============itemsitemsitems=====================');
          console.log(res.data);
          console.log('====================================');
          const offersWithFavourite = res.data.map((item: any) => ({
            ...item,
            paperOffer: {
              ...item.paperOffer,
              isFavourite: true, // 👈 هنا بالظبط
            },
          }));

          setState(old => ({
            ...old,
            offers: offersWithFavourite,
          }));
        } else {
          toastNotfication({
            type: 'error',
            message: res?.Message ?? t('Something Went wrong'),
          });
          setState(old => ({ ...old, loading: false }));
        }
      }),
    );
  };

  const removeFavUsers = (id: any) => {
    setState(old => ({ ...old, loading: true }));

    dispatch<any>(
      AddFavouriteUser(id, (res, status) => {
        if (res.status === 200) {
          setTimeout(() => {
            getFavouriteUsers();
          }, 1000);
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

  const getFavouriteUsers = () => {
    setState(old => ({ ...old, loading: true }));
    dispatch<any>(
      GetFavouriteUsers((res, status) => {
        if (res.status === 200) {
          console.log('===============itemsitemsitems=====================');
          console.log(res.data);
          console.log('====================================');

          const usersWithFavourite = res.data.map((user: any) => ({
            ...user,
            isFavourite: true, // 👈 هنا
          }));

          setState(old => ({
            ...old,
            users: usersWithFavourite,
          }));
        } else {
          toastNotfication({
            type: 'error',
            message: res?.Message ?? t('Something Went wrong'),
          });
          setState(old => ({ ...old, loading: false }));
        }
      }),
    );
  };

  const handleSelectOffer = item => {
    console.log('lllllllll', item);

    // if (item?.isMine) {
    // navigation.navigate('OffersDetails', { item: item });
    // }else{

    // navigation.navigate('ProductDetails', { item: item });
    // }
  };

  const handleSelectSeller = item => {
    navigation.navigate('SellerInfo', { seller: item });
  };

  return (
    <Container showHint={false}>
      <HeaderWithText title={t('favoriteList')} />
      <View style={styles.page}>
        {/* Tabs */}
        <View style={[layout.rowBox, styles.tabsRow]}>
          <Pressable
            style={[
              styles.tab,
              tab === 'offers' ? styles.tabActive : styles.tabInactive,
            ]}
            onPress={() => setTab('offers')}
          >
            <Text
              style={[
                styles.tabText,
                tab === 'offers'
                  ? styles.tabTextActive
                  : styles.tabTextInactive,
              ]}
            >
              {t('offers')}
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.tab,
              tab === 'sellers' ? styles.tabActive : styles.tabInactive,
            ]}
            onPress={() => setTab('sellers')}
          >
            <Text
              style={[
                styles.tabText,
                tab === 'sellers'
                  ? styles.tabTextActive
                  : styles.tabTextInactive,
              ]}
            >
              {t('sellers')}
            </Text>
          </Pressable>
        </View>

        {tab === 'offers' ? (
          <FlatList
            key={`list-${tab}`}
            data={state.offers}
            numColumns={2}
            keyExtractor={(item, index) =>
              item?.paperOffer?.paperOfferId?.toString() ?? index.toString()
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                style={{
                  marginRight: index % 2 === 0 ? PixelPerfect(8) : 0,
                  marginBottom: PixelPerfect(6),
                }}
              >
                <Product
                  isOfffer={false}
                  onFavPress={() => {
                    setState(old => ({
                      ...old,
                      offers: [],
                    }));
                    addFavouritePaperOffer(item?.paperOffer.paperOfferId);
                  }}
                  item={item?.paperOffer as any}
                //   item={item?.paperOffer as any}
                  onPress={() => {
                    console.log("hhhhhh",item);
                    
                    handleSelectOffer(item);
                  }}
                />
              </View>
            )}
            contentContainerStyle={{
              marginHorizontal: PixelPerfect(10),
            }}
            columnWrapperStyle={[
              layout.rowBox,
              {
                marginVertical: PixelPerfect(4),
                justifyContent:
                  state.offers.length === 1 ? 'flex-end' : 'space-between',
              },
            ]}
          />
        ) : (
          <FlatList
            key={`list-${tab}`}
            data={state.users}
            keyExtractor={(item, index) =>
              item?.userId?.toString() ?? index.toString()
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <SellerItem
                isOfffer={false}
                item={item}
                onPress={() => {
                  handleSelectSeller(item);
                }}
                onFavPress={() => {
                  setState(old => ({
                    ...old,
                    users: [],
                  }));
                  removeFavUsers(item.userId);
                }}
              />
            )}
            numColumns={2}
            contentContainerStyle={{
              marginHorizontal: PixelPerfect(10),
            }}
            columnWrapperStyle={[
              layout.rowBox,
              {
                marginVertical: PixelPerfect(4),
                justifyContent:
                  state.users.length === 1 ? 'flex-end' : 'space-between',
              },
            ]}
          />
        )}
      </View>
    </Container>
  );
};

export default Index;

const useStyles = (Fonts: IFont, theme: ITheme) =>
  StyleSheet.create({
    page: { flex: 1, paddingHorizontal: PixelPerfect(16) },
    tabsRow: { gap: PixelPerfect(20), marginVertical: PixelPerfect(12) },
    tab: {
      flex: 1,
      height: PixelPerfect(40),
      borderRadius: PixelPerfect(10),
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabActive: { backgroundColor: theme.active },
    tabInactive: { backgroundColor: '#D9D9D9' },
    tabText: { fontFamily: Fonts.medium, fontSize: PixelPerfect(16) },
    tabTextActive: { color: Colors.white },
    tabTextInactive: { color: '#2E3A59' },

    sellerCard: {
      backgroundColor: Colors.white,
      borderRadius: PixelPerfect(12),
      padding: PixelPerfect(12),
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: PixelPerfect(6),
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    sellerHeader: { flexDirection: 'row-reverse', alignItems: 'center' },
    heart: { color: theme.active, marginLeft: PixelPerfect(6) },
    sellerName: {
      color: theme.active,
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(16),
      marginLeft: PixelPerfect(6),
    },
    location: {
      color: '#8F9BB3',
      fontFamily: Fonts.regular,
      fontSize: PixelPerfect(12),
    },
    sellerBody: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      marginTop: PixelPerfect(6),
    },
    stars: { color: '#FFA800', marginLeft: PixelPerfect(6) },
    ratingCount: { color: '#8F9BB3' },
    desc: { textAlign: 'center', color: '#2E3A59', marginTop: PixelPerfect(8) },
    count: {
      textAlign: 'center',
      color: theme.active,
      marginTop: PixelPerfect(6),
    },
    detailsBtn: {
      marginTop: PixelPerfect(10),
      backgroundColor: theme.active,
      borderRadius: PixelPerfect(10),
      height: PixelPerfect(36),
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailsText: { color: Colors.white, fontFamily: Fonts.medium },
  });
