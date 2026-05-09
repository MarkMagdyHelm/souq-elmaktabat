import {
  FlatList,
  TouchableOpacity,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Container, Content } from '../../Components/containers/Containers';
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import {
  PixelPerfect,
  phoneHeight,
  phoneWidth,
} from '../../Constants/styleConstants';
import TabBar from '../../Components/TabBar/index';

import { useDispatch, useSelector } from 'react-redux';

import { useToast } from 'react-native-toast-notifications';
import { RootState } from '../../Store/store';
import HomeCategory from '../../Components/Cards/HomeCategory';
import Product from '../../Components/Cards/Product';
import {
  AddFavouriteInkOffer,
  AddFavouritePaperOffer,
  AddFavouritePrintingPressesOffer,
  GetCategories,
} from '../../Apis/CommonApi';
import { t } from 'i18next';
import {
  GetAllInkOffers,
  GetAllPaperOffers,
  GetAllPrintersOffers,
} from '../../Apis/HomeApis';
import { AddOfferICon, MoreIcon } from '../../Assets/Svg';
import CategoriesPopup from '../../Components/PopUps/categories';
import { CheckActivison, logoutHandler } from '../../Apis/User';
import { GetSettingsHandler } from '../../Apis/Appinfo';
import CancelOrder from '../../Components/PopUps/CancelOrder';
import useDoubleBackExit from '../../Apis/SharedFunctions';

type Props = {
  navigation: any;
};

const Index = (props: Props) => {
  const { navigation } = props;
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  const ref = useRef() as any;
  const { isLogin, userdata, isSeller } = useSelector(
    (state: RootState) => state.auth,
  );
  const [visibleCancel, setVisibleCancel] = useState(false);

  const dispatch = useDispatch();
  const [state, setstate] = useState({
    loading: false,
    isFetching: false,
    categories: [],
    sections: [],
    inks: [],
    showCategories: false,
  });
  useEffect(() => {
    getCategory();
    getAllPaperOffers();

    dispatch<any>(CheckActivison());
    getSettings();
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
  const getAllPaperOffers = () => {
    setstate(old => ({ ...old, loading: true }));

    dispatch<any>(
      GetAllPaperOffers({ page: '1', pageSize: '4' }, (res, status) => {
        if (res.status === 200) {
          const sec = {
            title: t('latestOffers') + ' ' + res.data.items[0].categoryName,
            id: 1,
            products: res.data.items ?? [],
          };

          setstate(old => ({ ...old, sections: [sec], loading: false }));
          getAllInkOffers();
        } else {
          toastNotfication({
            type: 'error',
            message: res?.Message ?? t('Something Went wrong'),
          });
          setstate(old => ({ ...old, loading: false }));
        }
      }),
    );
  };

  const getAllInkOffers = () => {
    dispatch<any>(
      GetAllInkOffers({ page: '1', pageSize: '4' }, res => {
        if (res.status === 200 && res.data.items?.length) {
          const inkSection = {
            title: t('latestInks'),
            id: 2,
            inks: res.data.items ?? [],
          };

          setstate(old => ({
            ...old,
            sections: [...old.sections, inkSection],
            loading: false,
          }));
          getAllPrinting();
        } else {
          setstate(old => ({ ...old, loading: false }));
        }
      }),
    );
  };
  const getAllPrinting = () => {
    dispatch<any>(
      GetAllPrintersOffers({ page: '1', pageSize: '10' }, res => {
        if (res.status === 200 && res.data.items?.length) {
          const printsSection = {
            title: t('latestPrinting'),
            id: 3,
            prints: res.data.items,
          };

          setstate(old => ({
            ...old,
            sections: [...old.sections, printsSection], // 👈 إضافة مش استبدال
            loading: false,
          }));
        } else {
          setstate(old => ({ ...old, loading: false }));
        }
      }),
    );
  };
  const getCategory = () => {
    setstate(old => ({ ...old, loading: true }));
    dispatch<any>(
      GetCategories((res, status) => {
        if (res.status === 200) {
          const updatedCategories = res.data.map(item => ({
            ...item,
            image: item.imageUrl,//??
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

  //   const addFavouritePaperOffer = (id: any) => {
  //     setstate(old => ({ ...old, loading: true }));

  //     dispatch<any>(
  //       AddFavouritePaperOffer(id, (res, status) => {
  //         if (res.status === 200) {
  //           setTimeout(() => {
  //             getAllPaperOffers();
  //           }, 500);
  //         } else {
  //           toastNotfication({
  //             type: 'error',
  //             message: res?.Message ?? t('Something Went wrong'),
  //           });
  //         }
  //         setstate(old => ({ ...old, loading: false }));
  //       }),
  //     );
  //   };

  const addFavouritePaperOffer = (item: any) => {
    setstate(old => ({ ...old, loading: true }));
    dispatch<any>(
      AddFavouritePaperOffer(item.id, (res, status) => {
        if (res.status === 200) {
          setstate(old => {
            const newSections = old.sections.map(section => {
              // ✅ PRODUCTS
              if (section.products?.some(p => p.id === item.id)) {
                return {
                  ...section,
                  products: section.products.map(p =>
                    p.id === item.id
                      ? { ...p, isFavourite: !p.isFavourite }
                      : p,
                  ),
                };
              }

              // ✅ INKS
              if (section.inks?.some(i => i.id === item.id)) {
                return {
                  ...section,
                  inks: section.inks.map(i =>
                    i.id === item.id
                      ? { ...i, isFavourite: !i.isFavourite }
                      : i,
                  ),
                };
              }

              // ✅ PRINTS
              if (section.prints?.some(pr => pr.id === item.id)) {
                return {
                  ...section,
                  prints: section.prints.map(pr =>
                    pr.id === item.id
                      ? { ...pr, isFavourite: !pr.isFavourite }
                      : pr,
                  ),
                };
              }

              return section;
            });

            return { ...old, sections: newSections };
          });
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

  const addFavouriteInkOffer = (item: any) => {
    setstate(old => ({ ...old, loading: true }));
    dispatch<any>(
      AddFavouriteInkOffer(item.id, (res, status) => {
        if (res.status === 200) {
          setstate(old => {
            const newSections = old.sections.map(section => {
              // ✅ PRODUCTS
              if (section.products?.some(p => p.id === item.id)) {
                return {
                  ...section,
                  products: section.products.map(p =>
                    p.id === item.id
                      ? { ...p, isFavourite: !p.isFavourite }
                      : p,
                  ),
                };
              }

              // ✅ INKS
              if (section.inks?.some(i => i.id === item.id)) {
                return {
                  ...section,
                  inks: section.inks.map(i =>
                    i.id === item.id
                      ? { ...i, isFavourite: !i.isFavourite }
                      : i,
                  ),
                };
              }

              // ✅ PRINTS
              if (section.prints?.some(pr => pr.id === item.id)) {
                return {
                  ...section,
                  prints: section.prints.map(pr =>
                    pr.id === item.id
                      ? { ...pr, isFavourite: !pr.isFavourite }
                      : pr,
                  ),
                };
              }

              return section;
            });

            return { ...old, sections: newSections };
          });
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
  const addFavouritePrintingPressesOffer = (item: any) => {
    setstate(old => ({ ...old, loading: true }));
    dispatch<any>(
      AddFavouritePrintingPressesOffer(item.id, (res, status) => {
        if (res.status === 200) {
          setstate(old => {
            const newSections = old.sections.map(section => {
              // ✅ PRODUCTS
              if (section.products?.some(p => p.id === item.id)) {
                return {
                  ...section,
                  products: section.products.map(p =>
                    p.id === item.id
                      ? { ...p, isFavourite: !p.isFavourite }
                      : p,
                  ),
                };
              }

              // ✅ INKS
              if (section.inks?.some(i => i.id === item.id)) {
                return {
                  ...section,
                  inks: section.inks.map(i =>
                    i.id === item.id
                      ? { ...i, isFavourite: !i.isFavourite }
                      : i,
                  ),
                };
              }

              // ✅ PRINTS
              if (section.prints?.some(pr => pr.id === item.id)) {
                return {
                  ...section,
                  prints: section.prints.map(pr =>
                    pr.id === item.id
                      ? { ...pr, isFavourite: !pr.isFavourite }
                      : pr,
                  ),
                };
              }

              return section;
            });

            return { ...old, sections: newSections };
          });
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
  const handleSelectProduct = (item, sectionID) => {
    console.log('Selected item:', item);
    if (item?.isMine) {
      if (isLogin) {
        navigation.navigate('OffersDetails', { item: item });
      }
    } else {
      if (isLogin) {
        navigation.navigate('ProductDetails', {
          item: item,
          sectionID: sectionID,
        });
      } else {
        setVisibleCancel(true);
      }
    }
  };

  const getSettings = () => {
    dispatch<any>(
      GetSettingsHandler(
        { lookupIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
        'countries',
        (res, status) => {},
      ),
    );
  };
  console.log('userdatauserdata', userdata);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getCategory();
    getAllPaperOffers();

    dispatch<any>(CheckActivison());
    getSettings();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  //to prevent app close on back press in home screen
  useDoubleBackExit();

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
      <Content
        style={styles.formCon}
        noPadding
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[layout.rowBox, styles.Header]}>
          <Pressable onPress={() => navigation.navigate('More')}>
            <MoreIcon />
          </Pressable>
        </View>

        <Text style={[layout.textAlign, styles.textsection1]}>
          {t('mainCategories')}
        </Text>
        {/* <FlatList
                    data={state.categories}
                    horizontal
                    inverted
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item, index }) => (
                     <HomeCategory/>
                           
                       
                    )}
                /> */}
        <View
          style={[
            layout.rowBox,
            {
              justifyContent: 'space-between',
              paddingHorizontal: PixelPerfect(16),
              paddingTop: PixelPerfect(5),
            },
          ]}
        >
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <HomeCategory
              item={state.categories[0]}
              onPress={() => {
                navigation.navigate('HomeMore', { sectionId: 1 });
              }}
            />
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <HomeCategory
              item={state.categories[1]}
              onPress={() => {
                navigation.navigate('HomeMore', { sectionId: 2 });
              }}
            />
          </View>
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            <HomeCategory
              item={state.categories[2]}
              onPress={() => {
                navigation.navigate('HomeMore', { sectionId: 3 });
              }}
            />
          </View>
        </View>
        {state.sections.map(section => {
          console.log('iiiiiiiii', state);

          const listData = (() => {
            if (section.id === 1) return section.products?.slice(0, 5);
            if (section.id === 2) return section.inks?.slice(0, 5);
            return section.prints?.slice(0, 5);
          })();
          return (
            <View
              key={`section.id-${section.id}`}
              style={{ marginTop: PixelPerfect(16) }}
            >
              <View style={[layout.rowBox, styles.viewCon]}>
                <Text style={styles.textsection1}>{section.title}</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('HomeMore', { sectionId: section.id });
                  }}
                >
                  <Text style={styles.textsection2}>{t('more')}</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={listData}
                horizontal
                inverted
                keyExtractor={(item, index) => `${section.id}-${item.id}`}
                showsHorizontalScrollIndicator={false}
                style={{ paddingBottom: PixelPerfect(36) }}
                renderItem={({ item }) => (
                  <Product
                    isOfffer={false}
                    item={item}
                    onPress={() => handleSelectProduct(item, section.id)}
                    onFavPress={() => {
                      if (section.id === 1) {
                        addFavouritePaperOffer(item);
                      } else if (section.id === 2) {
                        addFavouriteInkOffer(item);
                      } else if (section.id === 3) {
                        addFavouritePrintingPressesOffer(item);
                      }
                    }}
                  />
                )}
              />
            </View>
          );
        })}
      </Content>
      <TabBar />
      {isSeller && (
        <View style={styles.addOffer}>
          <Pressable
            onPress={() => setstate(old => ({ ...old, showCategories: true }))}
          >
            <AddOfferICon />
          </Pressable>
        </View>
      )}
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
      paddingVertical: PixelPerfect(20),

      paddingHorizontal: PixelPerfect(8),
    },
    bodyCon: {
      height: PixelPerfect(96),
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      alignContent: 'center',
      backgroundColor: 'blue',
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
      paddingHorizontal: PixelPerfect(16),
      fontSize: PixelPerfect(16),
      lineHeight: 25,
    },

    textsection2: {
      fontFamily: Fonts.medium,
      // fontWeight:"700",
      color: theme.active,
      paddingHorizontal: PixelPerfect(8),
      fontSize: PixelPerfect(14),
    },
    addOffer: {
      position: 'absolute',
      bottom: phoneHeight * 0.125,
      left: PixelPerfect(16),
    },
    Header: {
      alignItems: 'center',
      padding: PixelPerfect(8),
    },
  });
