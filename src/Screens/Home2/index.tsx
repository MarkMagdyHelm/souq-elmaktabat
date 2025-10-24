import { FlatList, SectionList, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container, Content } from '../../Components/containers/Containers'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import { PixelPerfect, phoneWidth } from '../../Constants/styleConstants'
import TabBar from '../../Components/TabBar/index';


import { useDispatch, useSelector } from 'react-redux'

import { useToast } from 'react-native-toast-notifications'
import { RootState } from '../../Store/store'
import HomeCategory from '../../Components/Cards/HomeCategory'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Product from '../../Components/Cards/Product'
import { GetCategories } from '../../Apis/CommonApi'
import { t } from 'i18next'
import { GetAllPaperOffers } from '../../Apis/HomeApis'


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
    const { isLogin } = useSelector((state: RootState) => state.auth);
    // const categories = [
    //     { id: "1", title: "ورق", image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg" },
    //     { id: "2", title: "أحبار", image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg" },
    //     { id: "3", title: "مطابع", image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg" },
    // ];

    // const sections = [
    //     {
    //         id: "1",
    //         title: "أحدث عروض الورق",
    //         products: [
    //             {
    //                 id: "p1",
    //                 name: "ورق A4 80 جم",
    //                 price: "500 جنيه",
    //                 rating: 5,
    //                 seller: "مكتبة وصفه",
    //                 image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
    //             },
    //             {
    //                 id: "p2",
    //                 name: "نصف ريم 70 جم",
    //                 price: "300-500 جنيه",
    //                 rating: 5,
    //                 seller: "مكتبة وصفه",
    //                 image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
    //             },
    //             {
    //                 id: "p2",
    //                 name: "نصف ريم 70 جم",
    //                 price: "300-500 جنيه",
    //                 rating: 5,
    //                 seller: "مكتبة وصفه",
    //                 image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
    //             },
    //             {
    //                 id: "p2",
    //                 name: "نصف ريم 70 جم",
    //                 price: "300-500 جنيه",
    //                 rating: 5,
    //                 seller: "مكتبة وصفه",
    //                 image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
    //             },
    //         ],
    //     },
    //     {
    //         id: "2",
    //         title: "أحدث عروض الأحبار",
    //         products: [
    //             {
    //                 id: "p2",
    //                 name: "نصف ريم 70 جم",
    //                 price: "300-500 جنيه",
    //                 rating: 5,
    //                 seller: "مكتبة وصفه",
    //                 image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
    //             },
    //             {
    //                 id: "p2",
    //                 name: "نصف ريم 70 جم",
    //                 price: "300-500 جنيه",
    //                 rating: 5,
    //                 seller: "مكتبة وصفه",
    //                 image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
    //             },
    //             {
    //                 id: "p2",
    //                 name: "نصف ريم 70 جم",
    //                 price: "300-500 جنيه",
    //                 rating: 5,
    //                 seller: "مكتبة وصفه",
    //                 image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
    //             },
    //             {
    //                 id: "p2",
    //                 name: "نصف ريم 70 جم",
    //                 price: "300-500 جنيه",
    //                 rating: 5,
    //                 seller: "مكتبة وصفه",
    //                 image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
    //             },
    //         ],
    //     },
    // ];

    const dispatch = useDispatch();
    const [state, setstate] = useState({
        loading: false,
        isFetching: false,
        categories: [],
        sections: []
    });
    useEffect(() => {
        getCategory()
        getAllPaperOffers()
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
            GetAllPaperOffers({ page: "1", pageSize: "10" }, (res, status) => {
                if (res.status === 200) {
                    const sec = {
                        title: "أحدث عروض " + res.data.items[0].categoryName,
                        products: res.data.items ?? [],
                    };


                    setstate(old => ({ ...old, sections: [sec], loading: false }));
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
    const handleSelectProduct = (item) => {
        navigation.navigate("ProductDetails", { item: item })
    }
    return (
        <Container showHint={false}>
            <Content style={styles.formCon} noPadding >

                <Text style={styles.textsection1}>الأقسام الرئيسية</Text>
                <FlatList
                    data={state.categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={styles.bodyCon}
                        >
                            <HomeCategory item={item} />
                        </View>
                    )}
                />
                {state.sections.map((section) => (
                    <View key={section.id} style={{ marginTop: PixelPerfect(24) }}>
                        <View
                            style={[layout.rowBox, styles.viewCon]}
                        >
                            <Text style={styles.textsection1}>
                                {section.title}
                            </Text>
                            <TouchableOpacity>
                                <Text style={styles.textsection2}>المزيد</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={section.products}
                            horizontal
                            inverted
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => <Product item={item} onPress={() =>
                                handleSelectProduct(item)
                            } />}
                        />
                    </View>
                ))}
            </Content>
            <TabBar />
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


    });