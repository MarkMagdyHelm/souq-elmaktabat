import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import { GetAllNotificationsHandler } from '../../Apis/Notification';
import PollLoader from '../../Components/SkeltonLoaders/PollLoader';
import OrderCard from '../../Components/Cards/OrderCard';
import { GetRequests } from '../../Apis/Request';
import MyOrderItem from '../../Components/Cards/MyOrderItem';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
  navigation: any;
};

const Index = (props: Props) => {
  const { navigation } = props;
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  const dispatch = useDispatch();

  const [state, setstate] = useState({
    loading: false,
    items: [],
    requests: [],
    // Pagination states
    requestsPage: 1,
    hasMoreRequests: true,
    loadingMore: false,
  });
  const [tab, setTab] = useState('notifications');
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

  useEffect(() => {
    getNotifications();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      console.log('📍 Market screen focused');

      handleRefresh();
      // return () => {

      // };
    }, []),
  );

  useEffect(() => {
   const onBackPress = () => {
     if (navigation.canGoBack()) {
       navigation.goBack();
       return true;
     }
 
       navigation.reset({
         index: 0,
         routes: [{ name: "Market" }],
       })
 
     return true;
   };
 
   const subscription = BackHandler.addEventListener(
     "hardwareBackPress",
     onBackPress
   );
 
   return () => subscription.remove();
 }, []);
  const getNotifications = () => {
    setstate(old => ({ ...old, loading: true }));
    dispatch<any>(
      GetAllNotificationsHandler({}, (res, status) => {
        console.log(
          '=============GetAllNotificationsHandler=======================',
        );
        console.log('GetAllNotificationsHandler', res);
        console.log('====================================');
        if (res.status == 200) {
          setstate(old => ({ ...old, items: res.data }));
        } else {
          toastNotfication({
            type: 'error',
            message: res?.Message ?? t('Something Went wrong'),
          });
        }
        setstate(old => ({ ...old, loading: false }));
      }),
    );
  };
  const getRequests = (page: number = 1, loadMore: boolean = false) => {
    if (loadMore) {
      setstate(old => ({ ...old, loadingMore: true }));
    } else {
      setstate(old => ({ ...old, loading: true }));
    }

    dispatch<any>(
      GetRequests({ page: page.toString(), pageSize: '10' }, (res, status) => {
        if (res.status === 200) {
          console.log('===============requests=====================');
          console.log(res.data.items);
          console.log('====================================');

          const newItems = res.data.items;
          setstate(old => ({
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
          setstate(old => ({ ...old, loading: false, loadingMore: false }));
        }
      }),
    );
  };

  const handleLoadMore = () => {
    if (!state.loadingMore && state.hasMoreRequests) {
      getRequests(state.requestsPage + 1, true);
    }
  };

  const handleRefresh = () => {
    setstate(old => ({ ...old, requests: [] }));
    getRequests(1);
  };

  const handlePress = item => {
    switch (item.type) {
      case 0:
      case 1:
        navigation.navigate('Home');
        break;
      case 2:
        navigation.navigate('Polls');
        break;
      default:
        break;
    }
  };

  const handleSelectRequest = (item: any) => {
    navigation.navigate('OrderDetails', { item: item });
  };

  const renderFooter = () => {
    if (!state.loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.babyBlue} />
      </View>
    );
  };

  return (
    <Container showHint={false}>
      <HeaderWithText title={t('notifications')} hasNotBack={true} />
      <View style={styles.bodyCon}>
        <View style={styles.container}>
          {/* Tabs */}
          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, tab === 'requests' && styles.activeTab]}
              onPress={() => {
                setTab('requests');
                if (state.requests.length === 0) {
                  getRequests(1);
                }
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === 'requests' && styles.activeTabText,
                ]}
              >
                {t('requests')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, tab === 'notifications' && styles.activeTab]}
              onPress={() => {
                setTab('notifications');
                if (state.items.length === 0) {
                  getNotifications();
                }
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === 'notifications' && styles.activeTabText,
                ]}
              >
                {t('notifications')}
              </Text>
            </Pressable>
          </View>
        </View>

        {tab === 'requests' ? (
          <FlatList
            data={state.requests}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <MyOrderItem
                item={item}
                onDetailsClick={() => handleSelectRequest(item)}
              />
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
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            //   onRefresh={() =>{}}
            //   refreshing={isFetching}

            data={state.items}
            keyExtractor={(items, index: number) => index.toString()}
            ItemSeparatorComponent={() =>
              state.loading ? null : <View style={styles.separator} />
            }
            renderItem={({ item }) => {
              return (
                <>
                  {/* {state.loading?
                  <PollLoader height={70}/> */}
                  {/* :  */}
                  <Notification
                    loading={state.loading}
                    item={item}
                    onPress={() => handlePress(item)}
                  />
                  {/* } */}
                </>
              );
            }}
          />
        )}
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
    separator: {
      height: PixelPerfect(1),
      backgroundColor: theme.border,
    },
    container: {
      height: PixelPerfect(40),
      backgroundColor: theme.white,
      paddingHorizontal: PixelPerfect(8),
      marginBottom: PixelPerfect(16),
    },
    tabs: {
      flexDirection: 'row',
      height: PixelPerfect(40),
    },
    tab: {
      height: PixelPerfect(50),
      marginHorizontal: PixelPerfect(4),
      flex: 1,
      borderRadius: PixelPerfect(8),
      alignItems: 'center',
      backgroundColor: theme.gray2,
      justifyContent: 'center',
    },
    activeTab: {
      backgroundColor: theme.babyBlue,
    },
    tabText: {
      fontSize: PixelPerfect(18),
      color: theme.black,
      fontFamily: Fonts.medium,
    },
    activeTabText: {
      color: theme.white,
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(18),
    },
    footerLoader: {
      paddingVertical: PixelPerfect(20),
      alignItems: 'center',
    },
  });
