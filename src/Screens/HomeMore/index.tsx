import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Container } from '../../Components/containers/Containers';
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { PixelPerfect, phoneHeight, phoneWidth } from '../../Constants/styleConstants';
import TabBar from '../../Components/TabBar/index';

// import 'moment/locale/ar';

import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { RootState } from '../../Store/store';
import Product from '../../Components/Cards/Product';
import SearchBar from '../../Components/Cards/SearchBar';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import {
  GetAllInkOffers,
  GetAllPaperOffers,
  GetAllPrintersOffers,
  GetPapersHandler,
} from '../../Apis/HomeApis';
import { t } from 'i18next';
import PriceFilter from '../../Components/PopUps/PriceFilter';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import FilterMultiChecker from '../../Components/PopUps/FilterMultiChecker';
import {
  AddFavouritePaperOffer,
  AddFavouriteInkOffer,
  AddFavouritePrintingPressesOffer,
  GetCategories,
} from '../../Apis/CommonApi';
import CancelOrder from '../../Components/PopUps/CancelOrder';
import { logoutHandler } from '../../Apis/User';
import Loader from '../../Components/PopUps/Loader';
import LottieView from 'lottie-react-native';
import HomeCategoryLoder from '../../Components/SkeltonLoaders/HomeCategoryLoder';
import { AddOfferICon } from '../../Assets/Svg';
import CategoriesPopup from '../../Components/PopUps/categories';

type Props = {
  navigation: any;
};

const Index = (props: Props) => {
  const { navigation } = props;

  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  // const ref = useRef() as any;
  const toastVisible = useRef(false);

  const { isLogin,isSeller, isAdmin } = useSelector((state: RootState) => state.auth);
  const { sectionId } = useRoute().params as any;
  const { countries, paperSize, inks } = useSelector(
    (state: RootState) => state.settings,
  );
  const [visibleCancel, setVisibleCancel] = useState(false);

  const [search, setSearch] = useState('');

  const filters =
    sectionId == 1
      ? ['price', 'size', 'paperTypeFilter', 'governorate']
      : sectionId == 2
      ? ['price', 'inkTypeFilter', 'governorate']
      : sectionId == 3
      ? [ 'governorate']
      : [];
  // console.log("ggggggg",filters);

  const dispatch = useDispatch();
  const [state, setstate] = useState({
    loading: false,
    viewFilter: false,
    isFetching: false,
    viewCountries: false,
    viewPaperType: false,
    viewInkType: false,
    viewPaperSize: false,
    viewPrice: false,
    sections: [],
    papers: [],
    minPrice: null,
    maxPrice: null,
    minColorPrice: null,
    maxColorPrice: null,
    minNonColorPrice: null,
    maxNonColorPrice: null,
    countries: null,
    inkIds: null,
    paperSize: null,
    paperType: null,
    requestsPage: 1,
    hasMoreRequests: true,
    loadingMore: false,
    showCategories: false,
    categories: [],

  });
  useEffect(() => {
    getCategory();
    getPapers();
  }, []);

  useEffect(() => {
    if (state.minPrice !== null || state.maxPrice !== null) {
      if (sectionId == 1) {
        getAllPaperOffers(1);
      } else {
        getAllInkOffers(1);
      }
    }
  }, [state.minPrice, state.maxPrice]);
  // console.log('====================================');
  // console.log(sectionId);
  // console.log('====================================');
  useEffect(() => {
    setstate(old => ({ ...old, sections: [] }));
    if (sectionId == '1') {
      getAllPaperOffers(1);
    } else if (sectionId == '2') {
      getAllInkOffers(1);
    } else {
      getAllPrinting();
    }
  }, [state.countries, state.paperSize, state.paperType, state.inkIds]);

  const toast = useToast();
  // const toastNotfication = (config: any) => {
  //   toast.hideAll();
  //   toast.show(config.message, {
  //     type: config.type,
  //     duration: 3000,
  //     offset: 50,
  //     animationType: 'slide-in',
  //     placement: 'top',
  //   } as any);
  // };
 const getCategory = () => {
    setstate(old => ({ ...old, loading: true }));
    dispatch<any>(
      GetCategories((res, status) => {
        if (res.status === 200) {
          const updatedCategories = res.data.map(item => ({
            ...item,
            image: item.imageUrl, //??
          }));

          setstate(old => ({ ...old, categories: updatedCategories }));
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
  const toastNotfication = (config: any) => {
    if (!toastVisible.current) return;

    toastVisible.current = true;

    toast.show(config.message, {
      type: config.type,
      duration: 3000,
      offset: 50,
      animationType: 'slide-in',
      placement: 'top',
      onHide: () => {
        toastVisible.current = false;
      },
    } as any);
  };
  const addFavouritePaperOffer = (id: any) => {
    setstate(old => ({ ...old, loading: true }));
    if (sectionId == '1') {
      dispatch<any>(
        AddFavouritePaperOffer(id, (res, status) => {
          if (res.status === 200) {
            setTimeout(() => {
              getAllPaperOffers();
            }, 1000);
          } else {
            toastNotfication({
              type: 'error',
              message: res?.Message ?? t('Something Went wrong'),
            });
          }
          setstate(old => ({ ...old, loading: false }));
        }),
      );
    } else if (sectionId == '2') {
      dispatch<any>(
        AddFavouriteInkOffer(id, (res, status) => {
          if (res.status === 200) {
            setTimeout(() => {
              getAllInkOffers();
            }, 1000);
          } else {
            toastNotfication({
              type: 'error',
              message: res?.Message ?? t('Something Went wrong'),
            });
          }
          setstate(old => ({ ...old, loading: false }));
        }),
      );
    } else {
      dispatch<any>(
        AddFavouritePrintingPressesOffer(id, (res, status) => {
          if (res.status === 200) {
            setTimeout(() => {
              getAllPrinting();
            }, 1000);
          } else {
            toastNotfication({
              type: 'error',
              message: res?.Message ?? t('Something Went wrong'),
            });
          }
          setstate(old => ({ ...old, loading: false }));
        }),
      );
    }
  };

  const getPapers = () => {
    setstate(old => ({ ...old, loading: true }));
    dispatch<any>(
      GetPapersHandler((res, status) => {
        if (res.status == 200) {
          setstate(old => ({ ...old, papers: res.data }));
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

  const getAllPaperOffers = (
    page: number = 1,
    loadMore: boolean = false,
    query = search,
  ) => {
    if (loadMore) {
      setstate(old => ({ ...old, loadingMore: true }));
    } else {
      setstate(old => ({ ...old, loading: true }));
    }

    dispatch<any>(
      GetAllPaperOffers(
        {
          countries: state.countries,
          paperSizeId: state.paperSize,
          paperId: state.paperType,
          minPrice: state.minPrice,
          maxPrice: state.maxPrice,
          page: page.toString(),
          pageSize: '10',
          query: query,
        },
        (res, status) => {
          if (res.status === 200) {
            const newItems = res.data.items;
            setstate(old => ({
              ...old,
              sections: loadMore ? [...old.sections, ...newItems] : newItems,
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

  const getAllInkOffers = (
    page: number = 1,
    loadMore: boolean = false,
    query = search,
  ) => {
    if (loadMore) {
      setstate(old => ({ ...old, loadingMore: true }));
    } else {
      setstate(old => ({ ...old, loading: true }));
    }

    dispatch<any>(
      GetAllInkOffers(
        {
          countries: state.countries,
          inkIds: state.inkIds,
          minPrice: state.minPrice,
          maxPrice: state.maxPrice,
          page: page.toString(),
          pageSize: '10',
          query: query,
        },
        
        (res, status) => {
          if (res.status === 200) {
            const newItems = res.data.items;
            setstate(old => ({
              ...old,
              sections: loadMore ? [...old.sections, ...newItems] : newItems,
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

  const getAllPrinting = (
    page: number = 1,
    loadMore: boolean = false,
    query = search,
  ) => {
    if (loadMore) {
      setstate(old => ({ ...old, loadingMore: true }));
    } else {
      setstate(old => ({ ...old, loading: true }));
    }
    dispatch<any>(
      GetAllPrintersOffers(
        {
          page: page,
          pageSize: '10',
          countries: state.countries,
          minNonColorPrice: state.minNonColorPrice,
          maxNonColorPrice: state.maxNonColorPrice,
          minColorPrice: state.minColorPrice,
          maxColorPrice: state.maxColorPrice,
          query: query,
        },
        res => {
          if (res.status === 200) {
            const newItems = res.data.items;
            setstate(old => ({
              ...old,
              sections: loadMore ? [...old.sections, ...newItems] : newItems,
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

  const handleLoadMore = () => {
    if (!state.loadingMore && state.hasMoreRequests) {
      if (sectionId == 1) {
        getAllPaperOffers(state.requestsPage + 1, true);
      } else if (sectionId == 2) {
        getAllInkOffers(state.requestsPage + 1, true);
      } else {
        getAllPrinting(state.requestsPage + 1, true);
      }
    }
  };

  const handleRefresh = () => {
    setstate(old => ({ ...old, sections: [] }));
    getCategory();
    if (sectionId == 1) {
      getAllPaperOffers(1);
    } else if (sectionId == 2) {
      getAllInkOffers(1);
    } else {
      getAllPrinting(1);
    }
  };

  const renderFooter = () => {
    if (!state.loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.babyBlue} />
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.filterBtn}
      onPress={() => {
        if (item === 'governorate') {
          setstate(old => ({ ...old, viewCountries: true }));
        } else if (item == 'paperTypeFilter') {
          setstate(old => ({ ...old, viewPaperType: true }));
        } else if (item == 'inkTypeFilter') {
          setstate(old => ({ ...old, viewInkType: true }));
        } else if (item == 'size') {
          setstate(old => ({ ...old, viewPaperSize: true }));
        } else {
          setstate(old => ({ ...old, viewPrice: true }));
        }
      }}
    >
      <Icon name="chevron-down" size={PixelPerfect(16)} color="#000" />
      <Text style={styles.filterText}>{t(item)}</Text>
    </TouchableOpacity>
  );
  const handleSelectProduct = item => {
    if (item?.isMine) {
      if (isLogin) {
        navigation.navigate('OffersDetails', { item: item });
      } else {
        setVisibleCancel(true);

        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: 'Signin' } as any],
        // });
      }
    } else {
      if (isLogin) {
        navigation.navigate('ProductDetails', { item: item });
      } else {
        setVisibleCancel(true);
      }
    }
  };
  const debounceTimeout = useRef(null);

  const handleSearch = val => {
    setSearch(val);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (sectionId === 1) {
        getAllPaperOffers(1, false, val);
      } else if (sectionId === 2) {
        getAllInkOffers(1, false, val);
      } else {
        getAllPrinting(1, false, val);
      }
    }, 500);
  };
console.log("filters",filters);

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
          } as any);
        }}
        title={t('signtxt1')}
        body={''}
        cancleText={t('Sign in')}
        SignIn={true}
      />
      <HeaderWithText
        title={
          sectionId == 1
            ? t('paperOffers')
            : sectionId == 2
            ? t('offerInks')
            : t('offerPrinters')
        }
      />
      <View style={{ flex: 1, paddingHorizontal: PixelPerfect(16) }}>
        {state.viewCountries && (
          <FilterMultiChecker
            onCloseFn={val => {
              if (Array.isArray(val)) {
                setstate(old => ({
                  ...old,
                  viewCountries: false,
                  countries: val.map(item => item.id),
                }));
              } else {
                setstate(old => ({
                  ...old,
                  viewCountries: false,
                }));
              }
            }}
            title={t('chooseGovernorate')}
            currentFilter={'alwaysAR'}
            items={countries}
            style={{ flex: 0.6 }}
            type="countries"
            hasTextInput={false}
          />
        )}
        {state.viewPaperType && (
          <FilterMultiChecker
            onCloseFn={val => {
              if (Array.isArray(val)) {
                setstate(old => ({
                  ...old,
                  viewPaperType: false,
                  paperType: val.map(item => item.id),
                }));
              } else {
                setstate(old => ({
                  ...old,
                  viewPaperType: false,
                }));
              }
            }}
            title={t('choosePaperType')}
            currentFilter={''}
            items={state.papers}
            style={{ flex: 0.6 }}
            type="paperType"
            hasTextInput={false}
          />
        )}
        {state.viewPaperSize && (
          <FilterMultiChecker
            onCloseFn={val => {
              if (Array.isArray(val)) {
                setstate(old => ({
                  ...old,
                  viewPaperSize: false,
                  paperSize: val.map(item => item.id),
                }));
              } else {
                setstate(old => ({
                  ...old,
                  viewPaperSize: false,
                }));
              }
            }}
            title={t('choosePaperSize')}
            currentFilter={''}
            items={paperSize}
            style={{ flex: 0.8 }}
            type="paperSize"
            hasTextInput={false}
          />
        )}
        {state.viewInkType && (
          <FilterMultiChecker
        
            onCloseFn={val => {              
              if (Array.isArray(val)) {
                console.log("inkIds",state.inkIds);
                setstate(old => ({
                  ...old,
                  viewInkType: false,
                  inkIds: val.map(item => item.id),
                }));
                console.log("inkIds",state.inkIds);

              } else {
                setstate(old => ({
                  ...old,
                  viewInkType: false,
                }));
              }
            }}
            title={t('inkTypew')}
            currentFilter={'alwaysAR'}
            items={inks}
            style={{ flex: 0.6 }}
            type="inkIds"
            hasTextInput={false}
          />
        )}
        <PriceFilter
          show={state.viewPrice}
          onCloseFn={val => {
            if (val) {
              if (sectionId == 1 || sectionId == 2) {
                setstate(old => ({
                  ...old,
                  minPrice: val ? val.min : null,
                  maxPrice: val ? val.max : null,
                  viewPrice: false,
                  sections: [],
                }));
              } else if (sectionId == 3) {
              }
            } else {
              setstate(old => ({
                ...old,
                minPrice: null,
                maxPrice: null,
                viewPrice: false,
              }));
            }
          }}
            />
        <SearchBar
          onPressSearch={handleSearch}
          onPress={() => {
            // console.log('jjjj');

            setstate(old => ({ ...old, viewFilter: !state.viewFilter }));
          }}
        />
        {state.viewFilter && (
  <View style={{ maxHeight: PixelPerfect(40) }}>
          <FlatList
            data={filters}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
          />
            </View>

        )}
        {
        state.loading ? (
            <FlatList
              data={Array.from({ length: 6 })}
              keyExtractor={(_, index) => index.toString()}
              numColumns={2}
              columnWrapperStyle={{
                marginVertical: PixelPerfect(4),
                gap: PixelPerfect(8),
                justifyContent:
                  filters.length === 1 ? 'flex-end' : 'space-between',
                flexDirection: 'row-reverse',
              }}
              renderItem={() => <HomeCategoryLoder height={PixelPerfect(228)} />}
              showsVerticalScrollIndicator={false}
            />
        ) : 
        (
          <FlatList
            data={state.sections}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.title}>{t('NoData')}</Text>
                <Text style={styles.subtitle}>{t('NoDataAvailable')}</Text>
              </View>
            }
            renderItem={({ item }) => (
              <Product
                isOfffer={false}
                item={item}
                onPress={() => {
                  handleSelectProduct(item);
                }}
                onFavPress={() => {
                  if (isLogin) {
                    addFavouritePaperOffer(item.id);
                  } else {
                    setVisibleCancel(true);
                  }
                }}
              />
            )}
            numColumns={2}
            columnWrapperStyle={{
              marginVertical: PixelPerfect(4),
              justifyContent:
                filters.length === 1 ? 'flex-end' : 'space-between',
              flexDirection: 'row-reverse',
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            refreshing={state.loading}
            onRefresh={handleRefresh}
          />
        )}
      </View>
      {/* <Filter/> */}
      <TabBar />
{state.showCategories && (
        <CategoriesPopup
          onCloseFn={() => {
            setstate(old => ({ ...old, showCategories: false }));
          }}
          title={t('categoriespopup')}
          items={state.categories}
          style={{ flex: 0.45 }}
        />
      )}

        {(isSeller && isAdmin)  && (
              <View style={styles.addOffer}>
                <Pressable
                  onPress={() => setstate(old => ({ ...old, showCategories: true }))}
                >
                  <AddOfferICon />
                </Pressable>
              </View>
            )}
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
      height: PixelPerfect(96),
      width: phoneWidth / 3.2,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: PixelPerfect(10),
    },

    viewCon: {
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: PixelPerfect(10),
    },

    textsection1: {
      fontFamily: Fonts.bold,
      color: theme.active,
      paddingHorizontal: PixelPerfect(8),
      fontSize: PixelPerfect(16),
    },

    textsection2: {
      fontFamily: Fonts.medium,
      // fontWeight:"700",
      color: theme.active,
      paddingHorizontal: PixelPerfect(8),
      fontSize: PixelPerfect(14),
    },

    container: {
          flex: 0,
              alignSelf: 'flex-start',


    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: PixelPerfect(24),
      paddingVertical: PixelPerfect(200),
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: '#222',
      marginBottom: 10,
      textAlignVertical: 'center',
    },
    subtitle: {
      fontSize: 15,
      color: '#666',
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 30,
      textAlignVertical: 'center',
    },
    filterBtn: {
      height: PixelPerfect(33),
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#eee',
      marginBottom: 4,
      borderRadius: PixelPerfect(10),
      paddingHorizontal: PixelPerfect(8),
      marginHorizontal: PixelPerfect(6),
    },
    filterText: {
      // paddingTop: PixelPerfect(40),
      // fontSize: PixelPerfect(14),
      fontFamily: Fonts.regular,
      color: '#000',
    },
    footerLoader: {
      paddingVertical: PixelPerfect(20),
      alignItems: 'center',
    },
    addOffer: {
      position: 'absolute',
      bottom: phoneHeight * 0.125,
      left: PixelPerfect(16),
    },
  });
