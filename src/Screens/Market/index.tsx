import { FlatList, TouchableOpacity, Pressable, SectionList, StyleSheet, Text, View, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container, Content } from '../../Components/containers/Containers'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import { PixelPerfect, phoneHeight, phoneWidth } from '../../Constants/styleConstants'
import TabBar from '../../Components/TabBar/index';


import { useDispatch, useSelector } from 'react-redux'

import { useToast } from 'react-native-toast-notifications'
import { RootState } from '../../Store/store'
import HomeCategory from '../../Components/Cards/HomeCategory'
import Product from '../../Components/Cards/Product'
import { AddFavouritePaperOffer, GetCategories } from '../../Apis/CommonApi'
import { t } from 'i18next'
import { GetAllInkOffers, GetAllPaperOffers, GetAllPrintersOffers } from '../../Apis/HomeApis'
import { AddOfferICon, MoreIcon } from '../../Assets/Svg'
import CategoriesPopup from '../../Components/PopUps/categories'
import { CheckActivison } from '../../Apis/User'
import { GetSettingsHandler } from '../../Apis/Appinfo'


type Props = {
    navigation: any
}

const Index = (props: Props) => {
    const {
        navigation
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const ref = useRef() as any;
    const { isLogin, userdata, isSeller } = useSelector((state: RootState) => state.auth);


    const dispatch = useDispatch();
    const [state, setstate] = useState({
        loading: false,
        isFetching: false,
        categories: [],
        sections: [],
        inks: [],
        showCategories: false
    });
    useEffect(() => {
        getCategory();
        getAllPaperOffers();


        dispatch<any>(CheckActivison());
        getSettings();

    }, [])
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
    const getAllPaperOffers = () => {
        setstate(old => ({ ...old, loading: true }));

        dispatch<any>(
            GetAllPaperOffers({ page: "1", pageSize: "4" }, (res, status) => {
                if (res.status === 200) {
                    const sec = {
                        title: t("latestOffers") + " " + res.data.items[0].categoryName,
                        id: 1,
                        products: res.data.items ?? [],
                    };

                    setstate(old => ({ ...old, sections: [sec], loading: false }));
                    getAllInkOffers()
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


    const getAllInkOffers = () => {
        dispatch<any>(
            GetAllInkOffers({ page: "1", pageSize: "4" }, (res) => {
                if (res.status === 200 && res.data.items?.length) {
                    const inkSection = {
                        title: t("latestInks"),
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
            })
        );
    };
    const getAllPrinting = () => {
        dispatch<any>(
            GetAllPrintersOffers({ page: "1", pageSize: "10" }, (res) => {
                if (res.status === 200 && res.data.items?.length) {
                    const printsSection = {
                        title: t("latestPrinting"),
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
            })
        );
    };
    const getCategory = () => {
        setstate(old => ({ ...old, loading: true }))
        dispatch<any>(GetCategories((res, status) => {
            if (res.status === 200) {
                const updatedCategories = res.data.map(item => ({
                    ...item,
                    image: 'https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg', // هنا الصورة اللي انت عايزها
                }));

                setstate(old => ({ ...old, categories: updatedCategories }));


            } else {
                toastNotfication({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
            }
            setstate(old => ({ ...old, loading: false }))
        }))
    };

    const addFavouritePaperOffer = (id: any) => {
        setstate(old => ({ ...old, loading: true }))


        dispatch<any>(AddFavouritePaperOffer(id, (res, status) => {
            if (res.status === 200) {
                setTimeout(() => {
                    getAllPaperOffers();
                }, 500);

            } else {
                toastNotfication({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
            }
            setstate(old => ({ ...old, loading: false }))
        }))
    };

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

    const getSettings = () => {
        dispatch<any>(GetSettingsHandler({ lookupIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] }, "countries", (res, status) => {
        }))
    }
    console.log(userdata);

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
    return (
        <Container showHint={false}>
            <Content style={styles.formCon} noPadding 
            refreshControl={
                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            >
                <View style={[layout.rowBox, styles.Header]}>
                    <Pressable onPress={() => navigation.navigate("More")} >
                        <MoreIcon />
                    </Pressable>
                </View>

                <Text style={[layout.textAlign, styles.textsection1]}>{t("mainCategories")}</Text>
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
                <View style={[layout.rowBox, { justifyContent: "space-between", paddingHorizontal: PixelPerfect(16), paddingTop: PixelPerfect(5) }]}>

                    <View style={{ flex: 1, alignItems: "flex-end" }} >
                        <HomeCategory item={state.categories[0]} onPress={() => {
                            navigation.navigate("HomeMore", { sectionId: 1 });
                        }} />
                    </View>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <HomeCategory item={state.categories[1]} onPress={() => {
                            navigation.navigate("HomeMore", { sectionId: 2 });
                        }} />
                    </View>
                    <View style={{ flex: 1, alignItems: "flex-start" }}>
                        <HomeCategory item={state.categories[2]} onPress={() => {
                            navigation.navigate("HomeMore", { sectionId: 3 });
                        }} />
                    </View>
                </View>
                {state.sections.map((section) => (
                    <View key={`section.id-${section.id}`}
                        style={{ marginTop: PixelPerfect(16) }}>
                        <View
                            style={[layout.rowBox, styles.viewCon]}
                        >
                            <Text style={styles.textsection1}>
                                {section.title}
                            </Text>
                            <TouchableOpacity onPress={() => {

                                navigation.navigate("HomeMore", { sectionId: section.id })
                            }
                            }>
                                <Text style={styles.textsection2}>{t("more")}</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={section.id === 1 ? section.products.slice(0, 5) : section.id == 2 ? section.inks.slice(0, 5) : section.prints.slice(0, 5)}
                            horizontal
                            inverted
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            style={section.id === 3 ? { paddingBottom: PixelPerfect(36) } : null}

                            renderItem={({ item }) =>
                                <Product isOfffer={false} item={item}
                                    onPress={() =>
                                        handleSelectProduct(item)
                                    } onFavPress={() => {
                                        addFavouritePaperOffer(item.id)
                                    }} />}

                        />
                    </View>
                ))}
            </Content>
            <TabBar />
            {isSeller && <View style={styles.addOffer}>
                <Pressable onPress={() => setstate(old => ({ ...old, showCategories: true }))}>
                    <AddOfferICon />
                </Pressable>
            </View>}
            {state.showCategories && (
                <CategoriesPopup
                    onCloseFn={() => { setstate(old => ({ ...old, showCategories: false })) }}
                    title={t("categoriespopup")}
                    items={state.categories}
                    style={{ flex: 0.45 }}
                />
            )}
        </Container>

    )

}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        formCon: {
            flex: 1,
            backgroundColor: theme.mainColor,
            paddingVertical: PixelPerfect(20),

            paddingHorizontal: PixelPerfect(8)
        },
        bodyCon: {
            height: PixelPerfect(96),
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            alignContent: "center",
            backgroundColor: "blue",
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
            paddingHorizontal: PixelPerfect(16),
            fontSize: PixelPerfect(16),
            lineHeight: 25
        },

        textsection2: {
            fontFamily: Fonts.medium,
            // fontWeight:"700",
            color: theme.active,
            paddingHorizontal: PixelPerfect(8),
            fontSize: PixelPerfect(14),

        },
        addOffer: {
            position: "absolute",
            bottom: phoneHeight * 0.125,
            left: PixelPerfect(16)
        },
        Header: {
            alignItems: "center",
            padding: PixelPerfect(8)
        }

    });