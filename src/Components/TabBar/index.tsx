import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';
import { BoursaIcon, HomeIcon, MoreIcon, NotificationIcon, PollsIcon, SellersIcone, } from '../../Assets/Svg';
import { DrawerActions, useNavigation, useRoute } from '@react-navigation/native';
import { useDrawerStatus } from '@react-navigation/drawer';
import { RootState } from '../../Store/store';
import { useSelector } from 'react-redux';

type Props = {
}

const index = (props: Props) => {
    const route = useRoute();
    const { isLogin, userdata, isSeller } = useSelector((state: RootState) => state.auth);

    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    // const isDrawerOpen = useDrawerStatus() === 'open'

    const navigation = useNavigation();
    const onPress = (name: string) => {
        if (isLogin) {
           handleNavigation(name)
        } else {
            if (name!= "Market"&&name!= "Boursa" ) {
                     navigation.reset({
                              index: 0,
                              routes:[
          
                                  { name: "Signin" } as any,
                              ],
                          });
            }else{
                navigation.reset({
                              index: 0,
                              routes:[
          
                                  { name: name } as any,
                              ],
                          });
                  }
            }
    }
const handleNavigation =(name)=>{
 if (name != route.name) {
                navigation.reset({
                    index: 0,
                    routes: name == "Market" ? [
                        { name: name } as any,
                    ] : [

                        { name: name } as any,
                    ],
                });
                // navigation.navigate(name)

            }
}
    return (
        <View style={[layout.rowBox, styles.containner]}>
            <Pressable style={styles.tapcon} onPress={() => onPress("Market")}>
                <HomeIcon color={(route.name === "Market") ? theme.active : theme.deactive} />
                <Text style={[styles.tabText, {
                    color: (route.name === "Market") ? theme.active : theme.deactive,
                    fontFamily: (route.name === "Market") ? Fonts.bold : Fonts.regular,
                }]}>{t('market')}</Text>
            </Pressable>
            <Pressable style={styles.tapcon} onPress={() => onPress("Sellers")}>
                <SellersIcone color={(route.name === "Sellers") ? theme.active : theme.deactive} />
                <Text style={[styles.tabText, {
                    color: (route.name === "Sellers") ? theme.active : theme.deactive,
                    fontFamily: (route.name === "Sellers") ? Fonts.bold : Fonts.regular,
                }]}>{t('sellers')}</Text>
            </Pressable>

            <Pressable style={styles.tapcon} onPress={() => onPress("Boursa")}>
                <BoursaIcon color={(route.name === "Boursa") ? theme.active : theme.deactive} />
                <Text style={[styles.tabText, {
                    color: (route.name === "Boursa") ? theme.active : theme.deactive,
                    fontFamily: (route.name === "Boursa") ? Fonts.bold : Fonts.regular,
                }]}>{t('Boursa')}</Text>
            </Pressable>
            <Pressable style={styles.tapcon} onPress={() => onPress("Notifications")}>
                <NotificationIcon color={(route.name === "Notifications") ? theme.active : theme.deactive} />
                <Text style={[styles.tabText, {
                    color: (route.name === "Notifications") ? theme.active : theme.deactive,
                    fontFamily: (route.name === "Notifications") ? Fonts.bold : Fonts.regular,
                }]}>{t('Notifications')}</Text>
            </Pressable>
        </View>
    )
}

export default index;

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        containner: {
            alignItems: "center",
            flex: 0.1,
            backgroundColor: Colors.white,
            borderTopLeftRadius: PixelPerfect(14),
            borderTopRightRadius: PixelPerfect(14),
            shadowColor: "#000",
            shadowRadius: PixelPerfect(14),
            shadowOpacity: 0.1,
            shadowOffset: {
                width: 0.3,
                height: 0.3
            },
            elevation: 7
        },
        tapcon: {
            flex: 1 / 4,
            alignItems: "center",
            justifyContent: "center",

        },
        tabText: {
            paddingTop: PixelPerfect(1),
            fontSize: PixelPerfect(15),
            fontFamily: Fonts.regular,
            lineHeight: 19
        },
        wedgit: {
            width: 7,
            height: 7,
            backgroundColor: "red",
            borderRadius: 3.5,
            top: 11,
            left: 13
        }
    });