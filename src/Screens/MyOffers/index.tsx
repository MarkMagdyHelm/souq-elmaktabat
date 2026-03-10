import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import { Container, Content } from '../../Components/containers/Containers'
import Product from '../../Components/Cards/Product'
import { PixelPerfect } from '../../Constants/styleConstants'
import TabBar from '../../Components/TabBar/index';
import HeaderWithText from '../../Components/Headers/HeaderWithText'
import { t } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from 'react-native-toast-notifications'
import { GetAllPaperOffers, GetMyPaperOffers } from '../../Apis/HomeApis'
import { AddFavouritePaperOffer } from '../../Apis/CommonApi'
import { RootState } from '../../Store/store'

type Props = {
      navigation: any
}


const Index = (props: Props) => {
      const {
            navigation
      } = props
      const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
      const styles = useStyles(Fonts, theme, dark, dir);
          const { isLogin, userdata, isSeller } = useSelector((state: RootState) => state.auth);

     const handleSelectProduct = (item) => {
        if (item?.isMine) {
            if (isLogin) {

                navigation.navigate("OffersDetails", { item: item })
            } else {
                navigation.reset({
                    index: 0,
                    routes: [

                        { name: "Signin" } as any,
                    ],
                });
            }
        } else {
            if (isLogin) {
                navigation.navigate("ProductDetails", { item: item })
            } else {
                navigation.reset({
                    index: 0,
                    routes: [

                        { name: "Signin" } as any,
                    ],
                });
            }

        }
    }
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
      }

      const [state, setstate] = useState({
            loading: false,
            offers: [{ id: 1 }, { id: 2 }],
            paperSize: null,
            paperType: null,
            requestsPage: 1,
            hasMoreRequests: true,
            loadingMore: false,
      });
      useEffect(() => {
            getMyPaperOffers()
      }, [])

      useEffect(() => {

            getMyPaperOffers()
      }, [])

      const getMyPaperOffers = (page: number = 1, loadMore: boolean = false) => {
            if (loadMore) {
                  setstate(old => ({ ...old, loadingMore: true }));
            } else {
                  setstate(old => ({ ...old, loading: true }));
            }

            dispatch<any>(
                  GetMyPaperOffers({
                        page: page.toString(), pageSize: "10"
                  }, (res, status) => {
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
                  getMyPaperOffers(state.requestsPage + 1, true);
            }
      };

      const handleRefresh = () => {
            setstate(old => ({ ...old, sections: [] }))
            getMyPaperOffers(1);
      };

      const renderFooter = () => {
            if (!state.loadingMore) return null;
            return (
                  <View style={styles.footerLoader}>
                        <ActivityIndicator size="small" color={theme.babyBlue} />
                  </View>
            );
      };


      return (
            <Container showHint={false}>
                  <HeaderWithText title={t("My Offers")} />

                  <View style={styles.formCon}>
                        <FlatList
                              data={state.offers}
                              
                              keyExtractor={(item) => item.id.toString()}
                              showsVerticalScrollIndicator={false}
                              renderItem={({ item, index }) =>
                                    <Product isOfffer={true} item={item} onPress={() => {
                                          handleSelectProduct(item)
                                    }} onFavPress={() => {
                                          AddFavouritePaperOffer(item.id)
                                    }} />


                              }
                              numColumns={2}
                              style={{}}
                              columnWrapperStyle={[layout.rowBox,{
                                    marginVertical: PixelPerfect(4),
                                    justifyContent: state.offers.length === 1 ? "flex-end" : "space-between",


                              }]}
                              onEndReached={handleLoadMore}
                              onEndReachedThreshold={0.5}
                              ListFooterComponent={renderFooter}
                              refreshing={state.loading}
                              onRefresh={handleRefresh}
                        />
                  </View>

                  <TabBar />


            </Container>

      )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
      StyleSheet.create({
            formCon: {
                  flex: 0.8,
                  backgroundColor: theme.mainColor,
                  paddingVertical: PixelPerfect(10),
                  paddingHorizontal: PixelPerfect(8)
            },
            footerLoader: {
                  paddingVertical: PixelPerfect(20),
                  alignItems: 'center',
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
      })