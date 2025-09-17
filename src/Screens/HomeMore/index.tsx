import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container } from '../../Components/containers/Containers'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import { PixelPerfect, phoneWidth } from '../../Constants/styleConstants'
import TabBar from '../../Components/TabBar/index';

import 'moment/locale/ar'

import { useDispatch, useSelector } from 'react-redux'

import { useToast } from 'react-native-toast-notifications'
import { RootState } from '../../Store/store'
import HomeCategory from '../../Components/Cards/HomeCategory'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Product from '../../Components/Cards/Product'
import SearchBar from '../../Components/Cards/SearchBar'
import Icon from "react-native-vector-icons/Ionicons";
import Filter from '../../Components/PopUps/Filter'
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

    const filters = ["المحافظة", "نوع الورق", "الحجم", "السعر"];


    const products = [
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
    ]



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

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.filterBtn}>
            <Icon name="chevron-down" size={PixelPerfect(16)} color="#000" />
            <Text style={styles.filterText}>{item}</Text>

        </TouchableOpacity>
    );

    return (
        <Container showHint={false}>
            <View style={{ flex: 1, paddingHorizontal: PixelPerfect(16) }}>

                <SearchBar />
                <FlatList
                    data={filters}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.container}
                />


                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <Product item={item} />}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }} // optional spacing
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
            marginEnd: PixelPerfect(16)
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
    });