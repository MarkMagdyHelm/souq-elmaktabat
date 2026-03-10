import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container } from '../../Components/containers/Containers'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import { PixelPerfect, phoneWidth } from '../../Constants/styleConstants'
import TabBar from '../../Components/TabBar/index';

import 'moment/locale/ar'

import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { RootState } from '../../Store/store';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Product from '../../Components/Cards/Product';
import SearchBar from '../../Components/Cards/SearchBar';
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute } from '@react-navigation/native';
import { GetAllPaperOffers, GetPapersHandler } from '../../Apis/HomeApis';
import { t } from 'i18next';
import PriceFilter from '../../Components/PopUps/PriceFilter';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import FilterMultiChecker from '../../Components/PopUps/FilterMultiChecker';
import { AddFavouritePaperOffer } from '../../Apis/CommonApi'
import SellerItem from '../../Components/Cards/SellersItem'
import { AddFavouriteUser } from '../../Apis/Appinfo'
import { GetSellerList } from '../../Apis/Request'
type Props = {
      navigation: any
}

const Index = (props: Props) => {
      const {
            navigation,
      } = props

      const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
      const styles = useStyles(Fonts, theme, dark, dir);
      const { isLogin } = useSelector((state: RootState) => state.auth);

      const { countries, paperSize } = useSelector((state: RootState) => state.settings);



      const filters = ["price", "size", "paperTypeFilter", "governorate"];

      const [categoryId, setCategoryId] = useState(null)
      const [activityId, setActivityId] = useState(null)
      const [query, setQuery] = useState("")
      const dispatch = useDispatch();
      const [state, setstate] = useState({
            loading: false,
            viewFilter: false,
            isFetching: false,
            viewCountries: false,
            viewPaperType: false,
            viewPaperSize: false,
            viewPrice: false,
            sellers: [],
            papers: [],
            minPrice: null,
            maxPrice: null,
            countries: null,
            paperSize: null,
            paperType: null,
            requestsPage: 1,
            hasMoreRequests: true,
            loadingMore: false,
      });
      useEffect(() => {

            getPapers()
      }, [])
      useEffect(() => {
            setstate(old => ({ ...old, sections: [] }))
            getAllPaperOffers(1)
      }, [state.countries, state.paperSize, state.paperType,query])

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
      }



      const getPapers = () => {
            setstate(old => ({ ...old, loading: true }))
            dispatch<any>(GetPapersHandler((res, status) => {
                  if (res.status == 200) {
                        setstate(old => ({ ...old, papers: res.data }))

                  } else {
                        toastNotfication({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
                  }
                  setstate(old => ({ ...old, loading: false }))
            }))
      };




      const addFav = (id: any) => {
            setstate(old => ({ ...old, loading: true }))


            dispatch<any>(AddFavouriteUser(id, (res, status) => {
                  if (res.status === 200) {
                        setTimeout(() => {
                              getAllPaperOffers();
                        }, 1000);

                  } else {
                        toastNotfication({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
                  }
                  setstate(old => ({ ...old, loading: false }))
            }))
      };



      const getAllPaperOffers = (page: number = 1, loadMore: boolean = false) => {
            if (loadMore) {
                  setstate(old => ({ ...old, loadingMore: true }));
            } else {
                  setstate(old => ({ ...old, loading: true }));
            }

            dispatch<any>(
                        GetSellerList({ countryId:categoryId,activityId:activityId,query:query,
                              page: page.toString(), pageSize: "10"  ,                 
                        }, (res, status) => {
                        if (res.status === 200) {
                              console.log('===============itemsitemsitems=====================');
                              console.log(res.data);
                              console.log('====================================');


                              const newItems = res.data;
                              setstate(old => ({
                                    ...old,
                                    sellers: loadMore ? [...old.sellers, ...newItems] : newItems,
                                    requestsPage: page,
                                    hasMoreRequests: newItems?.length === 10,
                                    loading: false,   
                                    loadingMore: false,
                              }));
                        } else {
                              toastNotfication({
                                    type: "error",
                                    message: res?.Message ?? t("Something Went wrong"),
                              });
                              setstate(old => ({ ...old, loading: false }));
                        }
                  })
            );
      };

      const handleLoadMore = () => {
            if (!state.loadingMore && state.hasMoreRequests) {
                  getAllPaperOffers(state.requestsPage + 1, true);
            }
      };

      const handleRefresh = () => {
            setstate(old => ({ ...old, sections: [] }))
            getAllPaperOffers(1);
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
            <TouchableOpacity style={styles.filterBtn} onPress={() => {
                  if (item === "governorate") {
                        setstate(old => ({ ...old, viewCountries: true }));
                  }
                  else if (item == "paperTypeFilter") {
                        setstate(old => ({ ...old, viewPaperType: true }));
                  }
                  else if (item == "size") {
                        setstate(old => ({ ...old, viewPaperSize: true }));
                  } else {
                        setstate(old => ({ ...old, viewPrice: true }));
                  }

            }}>
                  <Icon name="chevron-down" size={PixelPerfect(16)} color="#000" />
                  <Text style={styles.filterText}>{t(item)}</Text>

            </TouchableOpacity>
      );
      const handleSelectSeller = (item) => {
            navigation.navigate("SellerInfo", { seller: item })
      }

      return (
            <Container showHint={false}>
                  <HeaderWithText title={t(" ")}
                  hasNotBack={true}
                  />
                  <View style={{ flex: 1, paddingHorizontal: PixelPerfect(16) }}>
                        {state.viewCountries && <FilterMultiChecker
                              onCloseFn={(val) => {

                                    if (Array.isArray(val)) {
                                          setstate(old => ({
                                                ...old,
                                                viewCountries: false,
                                                countries: val.map(item => item.id)
                                          }));
                                    } else {
                                          setstate(old => ({
                                                ...old,
                                                viewCountries: false,
                                          }));
                                    }

                              }}
                              title={t("chooseGovernorate")}
                              currentFilter={""}
                              items={countries}
                              style={{ flex: 0.6 }}
                              type="countries"
                              hasTextInput={false}

                        />}
                        {state.viewPaperType && <FilterMultiChecker
                              onCloseFn={(val) => {

                                    if (Array.isArray(val)) {
                                          setstate(old => ({
                                                ...old,
                                                viewPaperType: false,
                                                paperType: val.map(item => item.id)
                                          }));
                                    } else {
                                          setstate(old => ({
                                                ...old,
                                                viewPaperType: false,
                                          }));
                                    }

                              }}
                              title={t("choosePaperType")}
                              currentFilter={""}
                              items={state.papers}
                              style={{ flex: 0.6 }}
                              type="paperType"
                              hasTextInput={false}

                        />}
                        {state.viewPaperSize && <FilterMultiChecker
                              onCloseFn={(val) => {
                                    if (Array.isArray(val)) {
                                          setstate(old => ({
                                                ...old,
                                                viewPaperSize: false,
                                                paperSize: val.map(item => item.id)
                                          }));
                                    } else {
                                          setstate(old => ({
                                                ...old,
                                                viewPaperSize: false,
                                          }));
                                    }

                              }}
                              title={t("choosePaperSize")}
                              currentFilter={""}
                              items={paperSize}
                              style={{ flex: 0.8 }}
                              type="paperSize"
                              hasTextInput={false}

                        />}
                        <PriceFilter show={state.viewPrice} onCloseFn={(val) => {
                              if (val) {
                                    setstate(old => ({ ...old, minPrice: val.min, maxPrice: val.max, viewPrice: false }))
                              }
                              else {
                                    setstate(old => ({ ...old, minPrice: null, maxPrice: null, viewPrice: false }))
                              }
                              setstate(old => ({ ...old, sections: [] }))
                              getAllPaperOffers(1)
                        }} />

                        <SearchBar
                         onPressSearch={(val)=>{
                    setQuery(val)
                }}
                        onPress={() => {

                              setstate(old => ({ ...old, viewFilter: !state.viewFilter }))
                        }} />
                        {state.viewFilter &&
                              <FlatList
                                    data={filters}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderItem}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.container}

                              />

                        }


                        <FlatList
                              data={state.sellers}
                              keyExtractor={(item) => item.id}
                              showsVerticalScrollIndicator={false}
                              renderItem={({ item }) => <SellerItem isOfffer={false}
                               item={item} onPress={() => {
                                    handleSelectSeller(item)
                              }} onFavPress={() => {
                                    addFav(item.id)
                              }} />}
                              numColumns={2}
                              columnWrapperStyle={{
                                    marginVertical: PixelPerfect(4),
                                    justifyContent: state.sellers.length === 1 ? "flex-end" : "space-between",
                              }}
                              onEndReached={handleLoadMore}
                              onEndReachedThreshold={0.5}
                              ListFooterComponent={renderFooter}
                              refreshing={state.loading}
                              onRefresh={handleRefresh}
                        />

                  </View>
                  {/* <Filter/> */}
                  <TabBar />
            </Container>

      )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
      StyleSheet.create({

            bodyCon: {
                  height: PixelPerfect(96),
                  width: (phoneWidth / 3.2),
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: PixelPerfect(10)
            },

            viewCon: {
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: PixelPerfect(10),
            },

            textsection1: {
                  fontFamily: Fonts.bold,
                  color: theme.active,
                  paddingHorizontal: PixelPerfect(8),
                  fontSize: PixelPerfect(16)
            },

            textsection2: {
                  fontFamily: Fonts.medium,
                  // fontWeight:"700",
                  color: theme.active,
                  paddingHorizontal: PixelPerfect(8),
                  fontSize: PixelPerfect(14),

            },

            container: {
                  justifyContent: "flex-end",
                  flex: 1,
                  height: PixelPerfect(35),
                  marginBottom: PixelPerfect(8),

            },
            filterBtn: {
                  height: PixelPerfect(33),
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#eee",
                  marginBottom: 4,
                  borderRadius: PixelPerfect(10),
                  paddingHorizontal: PixelPerfect(8),
                  marginHorizontal: PixelPerfect(6),
            },
            filterText: {
                  fontSize: PixelPerfect(14),
                  fontFamily: Fonts.regular,
                  color: "#000",
            },
            footerLoader: {
                  paddingVertical: PixelPerfect(20),
                  alignItems: 'center',
            },
      });