import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

import BranchsItem from '../../Components/Cards/BranchesItem';

import { GetMyBranches, GetRequests } from '../../Apis/Request';
import CancelOrder from '../../Components/PopUps/CancelOrder';
import { DeleteBranch } from '../../Apis/Appinfo';




type Props = {
      navigation: any;
};

const Index = (props: Props) => {
      const { navigation } = props;
      const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
      const styles = useStyles(Fonts, theme, dark, dir);
      const dispatch = useDispatch();
      const [visibleCancel, setVisibleCancel] = useState(false);
      const [branch, setBranch] = useState({});
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
            branches: [],
            branchesPage: 1,
            hasMoreBranches: true,
            loadingMore: false,
            viewDelete: false
      });


      useEffect(() => {
            getMyBranches();
      }, []);



      const getMyBranches = (page: number = 1, loadMore: boolean = false) => {
            if (loadMore) {
                  setState(old => ({ ...old, loadingMore: true }));
            } else {
                  setState(old => ({ ...old, loading: true }));
            }

            dispatch<any>(

                  GetMyBranches({
                        page: page.toString(), pageSize: "10"
                  }, (res, status) => {
                        setState(old => ({ ...old, loading: false, loadingMore: false }))
                        if (res.status === 200) {
                              const newItems = res.data;
                              setState(old => ({
                                    ...old,
                                    branches: loadMore ? [...old.branches, ...newItems] : newItems,
                                    branchesPage: page,
                                    hasMoreBranches: newItems?.length === 10,
                                    loading: false,
                                    loadingMore: false,
                                    viewDelete: false
                              }));
                        } else {
                              toastNotfication({
                                    type: "error",
                                    message: res?.Message ?? t("Something Went wrong"),
                              });
                              setState(old => ({ ...old, loading: false, loadingMore: false }));
                        }
                  })
            );
      };

      const deleteBranch = (deleteId: any) => {
            setState(old => ({ ...old, loading: true }));
            dispatch<any>(

                  DeleteBranch(
                        deleteId
                  , (res, status) => {
                        setState(old => ({ ...old, loading: false, loadingMore: false }))
                        if (res.status === 200) {
                              getMyBranches()
                              setState(old => ({ ...old, loading: false, }));
                        } else {
                              toastNotfication({
                                    type: "error",
                                    message: res?.Message ?? t("Something Went wrong"),
                              });
                              setState(old => ({ ...old, loading: false, loadingMore: false }));
                        }
                  })
            );
      };



      const handleLoadMore = () => {
            if (!state.loadingMore && state.hasMoreBranches) {
                  getMyBranches(state.branchesPage + 1, true);
            }
      };

      const handleRefresh = () => {
            setState(old => ({ ...old, requests: [] }))
            getMyBranches(1);
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
            navigation.navigate("AddNewBranch", { item });
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
                  <HeaderWithText title={t("branches")} />
                  <CancelOrder visible={visibleCancel}
                        onClose={() => setVisibleCancel(false)} onSubmit={() => {
                              deleteBranch(branch?.branchId)
                              setVisibleCancel(false)
                        }} title={t("DeleteBranch")} 
                        body={t("confirmDeleteBranch")} 
                        cancleText={t("yesDeleteBranch")} />
                  <View style={styles.bodyCon}>

                        {/* Branchs */}
                        <FlatList
                              data={state.branches}
                              initialNumToRender={3}
                              keyExtractor={(item: any) => item.id?.toString()}
                              renderItem={({ item }) => (
                                    <BranchsItem item={item} onDetailsClick={onDetailsClick}
                                          onDeleteClick={() => {
                                                setBranch(item)
                                                setVisibleCancel(true)
                                          }
                                          } />
                              )}
                              contentContainerStyle={{
                                    paddingBottom: PixelPerfect(16),
                                    paddingHorizontal: PixelPerfect(16),

                              }}
                        // onEndReached={handleLoadMore}
                        // onEndReachedThreshold={0.5}
                        // ListFooterComponent={renderFooter}
                        // refreshing={state.loading}
                        // onRefresh={handleRefresh}


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
            footerLoader: {
                  paddingVertical: PixelPerfect(20),
                  alignItems: 'center',
            },
      });