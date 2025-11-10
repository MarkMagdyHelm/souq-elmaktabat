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
import { TouchableOpacity } from 'react-native-gesture-handler'
import Product from '../../Components/Cards/Product'
import SearchBar from '../../Components/Cards/SearchBar'
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute } from '@react-navigation/native'
import { GetAllPaperOffers, GetPapersHandler } from '../../Apis/HomeApis'
import { t } from 'i18next'
import MultiChekers from '../../Components/PopUps/MultiChekers'
import { GetSettingsHandler } from '../../Apis/Appinfo'
import PriceFilter from '../../Components/PopUps/PriceFilter'
import { max } from 'moment'
import HeaderWithText from '../../Components/Headers/HeaderWithText'
import FilterMultiChecker from '../../Components/PopUps/FilterMultiChecker'
type Props = {
    navigation: any
}

const Index = (props: Props) => {
    const {
        navigation,

    } = props

    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const ref = useRef() as any;
    const { isLogin } = useSelector((state: RootState) => state.auth);
    const { sectionId } = useRoute().params as any;
    const { countries, paperSize } = useSelector((state: RootState) => state.settings);



    const filters = ["price", "size", "paperTypeFilter", "governorate"];


    const dispatch = useDispatch();
    const [state, setstate] = useState({
        loading: false,
        viewFilter: false,
        isFetching: false,
        viewCountries: false,
        viewPaperType: false,
        viewPaperSize: false,
        viewPrice: false,
        sections: [],
        papers: [],
        minPrice: null,
        maxPrice: null,
        countries: null,
        paperSize: null,
        paperType: null,
    });
    useEffect(() => {

        getPapers()
    }, [])
    useEffect(() => {
        console.log('=================countries===================');
        console.log(state.countries);
        console.log('====================================');
        console.log('=================paperSize===================');
        console.log(state.paperSize);
        console.log('====================================');
        console.log('=================paperType===================');
        console.log(state.paperType);
        console.log('====================================');
        console.log('=================maxPrice===================');
        console.log(state.maxPrice);
        console.log('====================================');
        console.log('=================minPrice===================');
        console.log(state.minPrice);
        console.log('====================================');
        getAllPaperOffers()
    }, [state.countries, state.paperSize, state.paperType, state.minPrice, state.maxPrice])

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

    const getAllPaperOffers = () => {
        setstate(old => ({ ...old, loading: true }));

        dispatch<any>(
            GetAllPaperOffers({ countries: state.countries, paperSizeId: state.paperSize, paperId: state.paperType, minPrice: state.minPrice, maxPrice: state.maxPrice, page: "1", pageSize: "10" }, (res, status) => {
                if (res.status === 200) {

                    setstate(old => ({ ...old, sections: res.data.items, loading: false }));
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
    const handleSelectProduct = (item) => {
        navigation.navigate("ProductDetails", { item: item })
    }

    return (
        <Container showHint={false}>
            <HeaderWithText title={t("paperOffers")} />
            <View style={{ flex: 1, paddingHorizontal: PixelPerfect(16) }}>
                {state.viewCountries && <FilterMultiChecker   
                    onCloseFn={(val) => {
                        if (Array.isArray(val)) {
                            setstate(old => ({
                                ...old,
                                viewCountries: false,
                                countries: val.map(item => item.id)
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
                    getAllPaperOffers()
                }} />

                <SearchBar onPress={() => {
                   
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
                    data={state.sections}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <Product item={item} onPress={() => {
                        handleSelectProduct(item)
                    }} onFavPress={()=>{

                    }} />}
                    numColumns={2}
                    style={{  height:"100%"}}
                
                    columnWrapperStyle={{ marginHorizontal: PixelPerfect(16), marginVertical: PixelPerfect(4), justifyContent: 'space-between' }} // optional spacing
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
            justifyContent:"flex-end",
            flex:1,
            height:PixelPerfect(35),
            marginBottom:PixelPerfect(8),
          
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