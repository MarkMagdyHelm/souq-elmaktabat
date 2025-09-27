import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ThemeContext } from '../../Constants/theming';
import { PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';
import { Container } from '../../Components/containers/Containers';
import TabBar from '../../Components/TabBar/index';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import OrderCard from '../../Components/Cards/OrderCard';
import Order from '../../Components/Cards/SellesOrders';
import SellesOrder from '../../Components/Cards/SellesOrders';

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
  const ordersData = [
    {
      id: "1",
      name: "احمد محمد",
      rating: "5",
      product: "ورق مرام 80جم",
      quantity: "10 كرتونه",
      price: "1500",
      time: "منذ 15 دقيقة",
      avatar: "https://i.pravatar.cc/100",
    },
    {
      id: "2",
      name: "احمد محمد",
      rating: "5",
      product: "ورق مرام 80جم",
      quantity: "10 كرتونه",
      price: "1500",
      time: "منذ 15 دقيقة",
      avatar: "https://via.placeholder.com/100",
    },
  ];

  const [state, setstate] = useState({
    loading: false,
    items: [{ flag: false }, { flag: false }, { flag: false }, { flag: false }, , { flag: false }]

  });
  const toast = useToast();
  // const toastNotfication = (config: any) => {
  //   toast.hideAll();
  //   toast.show(config.message, {
  //     type: config.type,
  //     duration: 3000,
  //     offset: 50,
  //     animationType: 'slide-in',
  //     placement: 'top',
  //   } as any);
  // }
//   useEffect(() => {
//     getNotifications()
//   }, []);

//   const getNotifications = () => {
//     setstate(old => ({ ...old, loading: true }))
//     dispatch<any>(GetAllNotificationsHandler({}, (res, status) => {
//       if (res.status == 200) {
//         setstate(old => ({ ...old, items: res.data }));
//       } else {
//         toastNotfication({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
//       }
//       setstate(old => ({ ...old, loading: false }));
//     }))
//   };
//   const handlePress = (item) => {
//     switch (item.type) {
//       case 0:
//         navigation.navigate("Home");
//         break;
//       case 1:
//         navigation.navigate("Home")
//         break;
//       case 2:
//         navigation.navigate("Polls")
//         break;

//       default:
//         break;
//     }
//   }
  const [tab, setTab] = useState("orders");
  const handleAccept = (item) => {
    console.log("قبول الطلب:", item);
  };

  const handleReject = (item) => {
    console.log("رفض الطلب:", item);
  };
  return (
    <Container showHint={false}>
      <HeaderWithText title={t("")} />
      <View style={styles.bodyCon}>

      

        {tab === "orders" ? (
          <FlatList
            data={ordersData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Order item={item} onAccept={handleAccept} onReject={handleReject} />
            )}
            contentContainerStyle={{ paddingBottom: PixelPerfect(16), paddingHorizontal: PixelPerfect(16) }}
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            //   onRefresh={() =>{}}
            //   refreshing={isFetching}
            style={styles.list}
            data={state.items}
            keyExtractor={(items, index: number) => index.toString()}
            ItemSeparatorComponent={() => (state.loading ? null : <View style={styles.separator} />)}
            renderItem={({ item }) => {
              return (
                <>
                  {/* {state.loading?
                  <PollLoader height={70}/> */}
                  {/* :  */}
                  <SellesOrder item={item} onAccept={undefined} onReject={undefined}  />
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
    list: {
    },
    separator: {
      height: PixelPerfect(1),
      backgroundColor: theme.border
    },


    container: {
      flex: 1, height: PixelPerfect(40), backgroundColor: theme.white, paddingHorizontal: PixelPerfect(8),
      
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
    activeTab: { backgroundColor: theme.babyBlue  , fontFamily: Fonts.medium  },
    tabText: { fontSize: PixelPerfect(18), color: theme.black , fontFamily: Fonts.medium },
    activeTabText: { color: theme.white, fontFamily: Fonts.medium ,fontSize: PixelPerfect(18) },
  })