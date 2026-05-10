import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
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
import { GetMyRequests, GetRequests } from '../../Apis/Request';
import { useFocusEffect } from '@react-navigation/native';

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
      animationType: 'slide-in',
      placement: 'top',
    } as any);
  };

  const [state, setState] = useState({
    loading: false,
    requests: [],
    requestsPage: 1,
    hasMoreRequests: true,
    loadingMore: false,
  });

  const [selectedTab, setSelectedTab] = useState(0);
  const { offerRequestStatus } = useSelector(
    (state: RootState) => state.settings,
  );

  const offerStatusWithAll = [
    { id: 0, name: 'All', arName: t('all'), paperOfferRequests: [] },
    ...(offerRequestStatus || []),
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'طلب مقبول':
        return theme.green;
      case 'قيد الانتظار':
        return theme.currenctText;
      case 'طلب جديد':
        return theme.currenctText;
      case 'طلب ملغي':
        return theme.red;
      case 'تم التسليم':
        return theme.textColor;
      case 'طلب منتهي':
        return theme.deactive;
      default:
        return theme.black;
    }
  };

  useEffect(() => {
    getRequests();
  }, [selectedTab]);
useFocusEffect(
  useCallback(() => {
    // call API to get latest request details
    getRequests();
  }, [])
);
  const getRequests = (page: number = 1, loadMore: boolean = false) => {
    if (loadMore) {
      setState(old => ({ ...old, loadingMore: true }));
    } else {
      setState(old => ({ ...old, loading: true }));
    }

    dispatch<any>(
      GetMyRequests(
        {
          statusId: selectedTab == 0 ? null : selectedTab,
          page: page.toString(),
          pageSize: '10',
        },
        (res, status) => {
          if (res.status === 200) {
            // console.log('===============requests=====================');
            // console.log('requests', res.data.items);
            // console.log('====================================');

            const newItems = res.data.items;
            setState(old => ({
              ...old,
              requests: loadMore ? [...old.requests, ...newItems] : newItems,
              requestsPage: page,
              hasMoreRequests: newItems.length === 10,
              loading: false,
              loadingMore: false,
            }));
          } else {
            toastNotfication({
              type: 'error',
              message: res?.Message ?? t('Something Went wrong'),
            });
            setState(old => ({ ...old, loading: false, loadingMore: false }));
          }
        },
      ),
    );
  };

  const handleLoadMore = () => {
    if (!state.loadingMore && state.hasMoreRequests) {
      getRequests(state.requestsPage + 1, true);
    }
  };

  const handleRefresh = () => {
    setState(old => ({ ...old, requests: [] }));
    getRequests(1);
  };

  const renderFooter = () => {
    if (!state.loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.babyBlue} />
      </View>
    );
  };

  const onDetailsClick = (item: any) => {
    navigation.navigate('OrderDetails', {
      item,
      source: 'orders',
    });
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
      <HeaderWithText title={t('myOrders')} />

      <View style={styles.bodyCon}>
        <FlatList
          horizontal
          inverted
          nestedScrollEnabled
          data={offerStatusWithAll}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={
            {
              // paddingRight: PixelPerfect(16),
              // marginHorizontal: PixelPerfect(10),
            }
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === item.id && {
                  backgroundColor: getStatusColor(GetNamesByLang(item, 'rtl')),
                },
              ]}
              onPress={() => {
                setState(old => ({ ...old, requests: [] }));
                setSelectedTab(item.id);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === item.id && { color: theme.white },
                ]}
              >
                {GetNamesByLang(item, 'rtl') === 'طلب جديد'
                  ? 'قيد الانتظار'
                  : GetNamesByLang(item, 'rtl') === 'new order'
                  ? 'pinging'
                  : GetNamesByLang(item, 'rtl')}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* ✅ الطلبات */}
        <FlatList
          data={state.requests}
          initialNumToRender={3}
          // keyExtractor={(item: any) => item.toString()}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            <MyOrderItem item={item} onDetailsClick={onDetailsClick} />
          )}
          contentContainerStyle={{
            paddingBottom: PixelPerfect(16),
            paddingHorizontal: PixelPerfect(16),
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={state.loading}
          onRefresh={handleRefresh}
          style={{
            height: '100%',
          }}
        />
      </View>

      <TabBar />
    </Container>
  );
};

export default Index;

const useStyles = (
  Fonts: IFont,
  theme: ITheme,
  darkmode: boolean,
  dir: string,
) =>
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabText: {
      textAlign: 'center',
      color: theme.black,
      fontSize: PixelPerfect(16),
      fontFamily: Fonts.medium,
    },
    footerLoader: {
      paddingVertical: PixelPerfect(20),
      alignItems: 'center',
    },
  });
