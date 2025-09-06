import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container } from '../../Components/containers/Containers'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import { t } from 'i18next'
import { ColorWithOpacity, Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants'
import TabBar from '../../Components/TabBar/index';
import Category from '../../Components/Cards/Category';
import { CallIcon, PaperIcon, SharIcon } from '../../Assets/Svg'
import moment from 'moment';
import 'moment/locale/ar'
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';
import { GetPapersHandler } from '../../Apis/HomeApis'
import { useDispatch, useSelector } from 'react-redux'
import HomeCategoryLoder from '../../Components/SkeltonLoaders/HomeCategoryLoder'
import { AssignDeviceIdToGuestHandler } from '../../Apis/Auth'
import { useToast } from 'react-native-toast-notifications'
import { RootState } from '../../Store/store'
import PushNotificationHandler from '../../Utilties'
import HomeCategory from '../../Components/Cards/HomeCategory'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Product from '../../Components/Cards/Product'


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
    const categories = [
        { id: "1", title: "ورق", image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg" },
        { id: "2", title: "أحبار", image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg" },
        { id: "3", title: "مطابع", image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg" },
    ];

    const sections = [
        {
            id: "1",
            title: "أحدث عروض الورق",
            products: [
                {
                    id: "p1",
                    name: "ورق A4 80 جم",
                    price: "500 جنيه",
                    rating: 5,
                    seller: "مكتبة وصفه",
                    image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
                },
                {
                    id: "p2",
                    name: "نصف ريم 70 جم",
                    price: "300-500 جنيه",
                    rating: 5,
                    seller: "مكتبة وصفه",
                    image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
                },
                {
                    id: "p2",
                    name: "نصف ريم 70 جم",
                    price: "300-500 جنيه",
                    rating: 5,
                    seller: "مكتبة وصفه",
                    image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
                },
                {
                    id: "p2",
                    name: "نصف ريم 70 جم",
                    price: "300-500 جنيه",
                    rating: 5,
                    seller: "مكتبة وصفه",
                    image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
                },
            ],
        },
        {
            id: "2",
            title: "أحدث عروض الأحبار",
            products: [
                {
                    id: "p2",
                    name: "نصف ريم 70 جم",
                    price: "300-500 جنيه",
                    rating: 5,
                    seller: "مكتبة وصفه",
                    image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
                },
                {
                    id: "p2",
                    name: "نصف ريم 70 جم",
                    price: "300-500 جنيه",
                    rating: 5,
                    seller: "مكتبة وصفه",
                    image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
                },
                {
                    id: "p2",
                    name: "نصف ريم 70 جم",
                    price: "300-500 جنيه",
                    rating: 5,
                    seller: "مكتبة وصفه",
                    image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
                },
                {
                    id: "p2",
                    name: "نصف ريم 70 جم",
                    price: "300-500 جنيه",
                    rating: 5,
                    seller: "مكتبة وصفه",
                    image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg",
                },
            ],
        },
    ];

    const dispatch = useDispatch();
    const [state, setstate] = useState({
        loading: false,
        isFetching: false,

    });
    useEffect(() => {

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



    return (
        <Container showHint={false}>
            <ScrollView style={{ flex: 1, padding: PixelPerfect(10) }}>
                <Text style={styles.textsection1}>الأقسام الرئيسية</Text>
                <FlatList
                    data={categories}
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
                {sections.map((section) => (
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
                            renderItem={({ item }) => <Product item={item} />}
                        />
                    </View>
                ))}
            </ScrollView>
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


    });