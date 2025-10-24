import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ThemeContext } from '../../Constants/theming';
import { PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';
import { Container } from '../../Components/containers/Containers';
import TabBar from '../../Components/TabBar/index';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import Notification from '../../Components/Cards/Notification';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import { GetAllNotificationsHandler, GetRequests } from '../../Apis/Notification';
import PollLoader from '../../Components/SkeltonLoaders/PollLoader';
import OrderCard from '../../Components/Cards/OrderCard';

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
  // const ordersData = [
  //   {
  //     id: "1",
  //     name: "احمد محمد",
  //     rating: "5",
  //     product: "ورق مرام 80جم",
  //     quantity: "10 كرتونه",
  //     price: "1500",
  //     time: "منذ 15 دقيقة",
  //     avatar: "https://i.pravatar.cc/100",
  //   },
  //   {
  //     id: "2",
  //     name: "احمد محمد",
  //     rating: "5",
  //     product: "ورق مرام 80جم",
  //     quantity: "10 كرتونه",
  //     price: "1500",
  //     time: "منذ 15 دقيقة",
  //     avatar: "https://via.placeholder.com/100",
  //   },
  // ];

  const [state, setstate] = useState({
    loading: false,
    items: [{ flag: false }, { flag: false }, { flag: false }, { flag: false }, , { flag: false }],
    requests: []
  });
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
    getNotifications()
    getRequests()
  }, []);

  const getNotifications = () => {
    setstate(old => ({ ...old, loading: true }))
    dispatch<any>(GetAllNotificationsHandler({}, (res, status) => {
      if (res.status == 200) {
        setstate(old => ({ ...old, items: res.data }));
      } else {
        toastNotfication({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
      }
      setstate(old => ({ ...old, loading: false }));
    }))
  };
  const getRequests = () => {
    setstate(old => ({ ...old, loading: true }));

    dispatch<any>(
      GetRequests({ page: "1", pageSize: "10" }, (res, status) => {
        if (res.status === 200) {
          console.log('===============requests=====================');
          console.log(res.data.items);
          console.log('====================================');
          setstate(old => ({ ...old, requests: res.data.items, loading: false }));
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

  const handlePress = (item) => {
    switch (item.type) {
      case 0:
        navigation.navigate("Home");
        break;
      case 1:
        navigation.navigate("Home")
        break;
      case 2:
        navigation.navigate("Polls")
        break;

      default:
        break;
    }
  }
  const [tab, setTab] = useState("requests");
  const handleAccept = (item) => {
    console.log("قبول الطلب:", item);
  };

  const handleReject = (item) => {
    console.log("رفض الطلب:", item);
  };
  const handleSelectRequest = (item:any) => {
    navigation.navigate("OrderDetails", { item: item })
  };

  return (
    <Container showHint={false}>
      <HeaderWithText title={t("")} />
      <View style={styles.bodyCon}>

        <View style={styles.container}>
          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, tab === "orders" && styles.activeTab]}
              onPress={() => setTab("orders")}
            >
              <Text style={[styles.tabText, tab === "orders" && styles.activeTabText]}>
                الطلبات
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === "notifications" && styles.activeTab]}
              onPress={() => setTab("notifications")}
            >
              <Text
                style={[styles.tabText, tab === "notifications" && styles.activeTabText]}
              >
                الاشعارات
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {tab === "requests" ? (
          <FlatList
            data={state.requests}

            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <OrderCard item={item} onAccept={handleAccept} onReject={handleReject} onPress={() =>
                handleSelectRequest(item)
              } />
            )}
            contentContainerStyle={{ paddingBottom: PixelPerfect(16), paddingHorizontal: PixelPerfect(16) }}
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            //   onRefresh={() =>{}}
            //   refreshing={isFetching}

            data={state.items}
            keyExtractor={(items, index: number) => index.toString()}
            ItemSeparatorComponent={() => (state.loading ? null : <View style={styles.separator} />)}
            renderItem={({ item }) => {
              return (
                <>
                  {/* {state.loading?
                  <PollLoader height={70}/> */}
                  {/* :  */}
                  <Notification loading={state.loading} item={item} onPress={() => handlePress(item)} />
                  {/* } */}
                </>
              );
            }} />
        )}
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

    separator: {
      height: PixelPerfect(1),
      backgroundColor: theme.border
    },


    container: {
      height: PixelPerfect(40), backgroundColor: theme.white, paddingHorizontal: PixelPerfect(8), marginBottom: PixelPerfect(16)


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