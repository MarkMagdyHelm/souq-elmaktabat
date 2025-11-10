import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ThemeContext } from '../../Constants/theming';
import { PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';
import { Container } from '../../Components/containers/Containers';
import TabBar from '../../Components/TabBar/index';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';

import MyOrderItem from '../../Components/Cards/MyOrderItem';
import { RootState } from '../../Store/store';
import { GetNamesByLang } from '../../Helper';
import { GetRequests } from '../../Apis/Request';




type Props = {
    navigation: any;
};

const Index = (props: Props) => {
    const { navigation } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const dispatch = useDispatch();

    const toast = useToast();
    const toastNotfication = (config: any) => {
        toast.hideAll();
        toast.show(config.message, {
            type: config.type,
            duration: 3000,
            offset: 50,
            animationType: "slide-in",
            placement: "top",
        } as any);
    };

    const [state, setState] = useState({
        loading: false,
        requests: [],
    });

    const [selectedTab, setSelectedTab] = useState(0);
    const { offerRequestStatus } = useSelector((state: RootState) => state.settings);
    const offerStatusWithAll = [
        { id: 0, name: "All", arName: t("all"), paperOfferRequests: [] },
        ...(offerRequestStatus || []),
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "طلب مقبول":
                return theme.green;
            case "قيد الانتظار":
                return theme.currenctText;
            case "طلب جديد":
                return theme.currenctText;
            case "طلب ملغي":
                return theme.red;
            case "تم التسليم":
                return theme.textColor;
            case "طلب منتهي":
                return theme.deactive;
            default:
                return theme.black;
        }
    };


    useEffect(() => {
        getRequests();
    }, [selectedTab]);



    const getRequests = () => {
        setState((old) => ({ ...old, loading: true }));

        dispatch<any>(
            GetRequests({ statusId: selectedTab == 0 ? null : selectedTab, page: "1", pageSize: "10" }, (res, status) => {
                if (res.status === 200) {
                    setState((old) => ({
                        ...old,
                        requests: res.data.items ?? [],
                        loading: false,
                    }));
                } else {
                    toastNotfication({
                        type: "error",
                        message: res?.Message ?? t("Something Went wrong"),
                    });
                    setState((old) => ({ ...old, loading: false }));
                }
            })
        );
    };


    const onDetailsClick = (item: any) => {
        navigation.navigate("OrderDetails", { item });
    };
    useLayoutEffect(() => {
        if (Platform.OS === 'android') {
            navigation.setOptions({ gestureEnabled: false });
        }

        // Disable drawer swipe
        const parent = navigation.getParent();
        parent?.setOptions({ swipeEnabled: false });

        return () => {
            if (Platform.OS === 'android') {
                navigation.setOptions({ gestureEnabled: true });
            }
            parent?.setOptions({ swipeEnabled: true });
        };
    }, [navigation]);
    return (
        <Container showHint={false}>
            <HeaderWithText title={t("myOrders")} />

            <View style={styles.bodyCon}>

                <FlatList
                    horizontal
                    inverted
                    nestedScrollEnabled
                    data={offerStatusWithAll}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabsContainer}
                    contentContainerStyle={{
                        // paddingRight: PixelPerfect(16),
                        // marginHorizontal: PixelPerfect(10),
                    }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                selectedTab === item.id && {
                                    backgroundColor: getStatusColor(GetNamesByLang(item, "rtl")),
                                },
                            ]}
                            onPress={() => {
                                setState((old) => ({ ...old, requests: [] }));
                                setSelectedTab(item.id)
                            }}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === item.id && { color: theme.white },
                                ]}
                            >
                                {GetNamesByLang(item, "rtl")}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {/* ✅ الطلبات */}
                <FlatList
                    data={state.requests}
                    initialNumToRender={3}
                    keyExtractor={(item: any) => item.id?.toString()}
                    renderItem={({ item }) => (
                        <MyOrderItem item={item} onDetailsClick={onDetailsClick} />
                    )}
                    contentContainerStyle={{
                        paddingBottom: PixelPerfect(16),
                        paddingHorizontal: PixelPerfect(16),

                    }}
                    style={{
                        height: "100%",
                    }}

                />
            </View>

            <TabBar />
        </Container>
    );
};

export default Index;

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string) =>
    StyleSheet.create({
        bodyCon: {
            flex: 0.8,
            backgroundColor: theme.mainColor,
        },
        tabsContainer: {
            height: PixelPerfect(45),
        },
        tab: {
            height: PixelPerfect(35),
            backgroundColor: theme.gray2,
            borderRadius: PixelPerfect(10),
            paddingHorizontal: PixelPerfect(15),
            marginHorizontal: PixelPerfect(4),
            justifyContent: "center",
        },
        tabText: { textAlign: "center", color: theme.black, fontSize: PixelPerfect(16), fontFamily: Fonts.medium },
    });