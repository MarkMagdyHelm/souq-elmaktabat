import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ThemeContext } from '../../Constants/theming';
import { PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';
import { Container } from '../../Components/containers/Containers';
import TabBar from '../../Components/TabBar/index';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import SellesOrder from '../../Components/Cards/SellesOrder';
import { GetNamesByLang } from '../../Helper';
import { GetRequests } from '../../Apis/Request';
import { RootState } from '../../Store/store';

let items = [{ flag: false }, { flag: true }, { flag: false }, { flag: false }, { flag: false }, { flag: false }, { flag: false }, { flag: true }, { flag: false }, { flag: false }, { flag: false }, { flag: false }, , { flag: false }]

type Props = {
  navigation: any
}

const Index = (props: Props) => {
  const {
    navigation
  } = props
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  const dispatch = useDispatch();


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

  const [tab, setTab] = useState("orders");
  const handleAccept = (item) => {
    console.log("قبول الطلب:", item);
  };

  const handleReject = (item) => {
    console.log("رفض الطلب:", item);
  };
  return (
    <Container showHint={false}>
      <HeaderWithText title={"طلبات الشراء"} />
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


        <FlatList
          data={state.requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SellesOrder item={item} onAccept={handleAccept} onReject={handleReject} />
          )}
          contentContainerStyle={{ paddingBottom: PixelPerfect(16), paddingHorizontal: PixelPerfect(16) }}
        />

      </View>
      <TabBar />
    </Container>
  )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
  StyleSheet.create({
    bodyCon: {
      flex: 0.8,
      backgroundColor: theme.mainColor,
    },
    list: {
    },
    separator: {
      height: PixelPerfect(1),
      backgroundColor: theme.border
    },


    container: {
      flex: 1, height: PixelPerfect(40), backgroundColor: theme.white, paddingHorizontal: PixelPerfect(8),

    },
    tabsContainer: {
      height: PixelPerfect(45),
  },
    tabs: { flexDirection: "row", height: PixelPerfect(40) },
    tab: {
      height: PixelPerfect(50),
      marginHorizontal: PixelPerfect(4),
      flex: 1,
      padding: PixelPerfect(10),
      borderRadius: PixelPerfect(8),
      alignItems: "center",
      backgroundColor: theme.gray2
    },
    activeTab: { backgroundColor: theme.babyBlue, fontFamily: Fonts.medium },
    tabText: { fontSize: PixelPerfect(18), color: theme.black, fontFamily: Fonts.medium },
    activeTabText: { color: theme.white, fontFamily: Fonts.medium, fontSize: PixelPerfect(18) },
  })