import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ThemeContext } from '../../Constants/theming';
import { PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';
import { Container } from '../../Components/containers/Containers';
import TabBar from '../../Components/TabBar/index';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';

import MyOrderItem from '../../Components/Cards/MyOrderItem';
import { GetRequests } from '../../Apis/Notification';




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
            case "منتهي":
                return theme.deactive;
            default:
                return theme.black;
        }
    };

    const tabs = [
        { id: 0, label: "الكل" },
        { id: 1, label: "قيد الانتظار" },
        { id: 2, label: "طلب مقبول" },
        { id: 3, label: "طلب ملغي" },
        { id: 4, label: "تم التسليم" },
        { id: 5, label: "منتهي" },
    ];

    useEffect(() => {
        getRequests();
    }, [selectedTab]);


    const getRequests = useCallback(() => {
        setState((old) => ({ ...old, loading: true }));
        dispatch<any>(
            GetRequests({ statusId: selectedTab, page: "1", pageSize: "10" }, (res, status) => {
                if (res.status === 200) {
                    console.log('===============lllll=====================');
                    console.log(res.data.items);
                    console.log('====================================');
                    setState((old) => ({
                        ...old,
                        requests: res.data.items ?? [],
                        loading: false,
                    }));
                } else {
                    toastNotfication({
                        type: "error",
                        message: res?.Message ?? "حدث خطأ ما",
                    });
                    setState((old) => ({ ...old, loading: false }));
                }
            })
        );
    }, [dispatch, selectedTab]);



    const onDetailsClick = (item: any) => {
        navigation.navigate("OrderDetails", { item });
    };

    return (
        <Container showHint={false}>
            <HeaderWithText title={"طلباتي"} />

            <View style={styles.bodyCon}>
                {/* ✅ التابات */}
                <FlatList
                    horizontal
                    inverted
                    data={tabs}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabsContainer}
                    contentContainerStyle={{
                        paddingRight: PixelPerfect(16),
                        marginHorizontal: PixelPerfect(10),
                    }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                selectedTab === item.id && {
                                    backgroundColor: getStatusColor(item.label),
                                },
                            ]}
                            onPress={() =>{
                                state.requests = []
                                setSelectedTab(item.id)}}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === item.id && { color: theme.white },
                                ]}
                            >
                                {item.label}
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
        tabsContainer: { height: PixelPerfect(45), },
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