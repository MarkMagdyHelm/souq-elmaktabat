import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';
import {  HomeIcon,  MoreIcon,  NotificationIcon,  PollsIcon,   } from '../../Assets/Svg';
import { DrawerActions, useNavigation, useRoute } from '@react-navigation/native';
import { useDrawerStatus } from '@react-navigation/drawer';

type Props = {
}

const index = (props: Props) => {
    const route = useRoute();
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const isDrawerOpen = useDrawerStatus() === 'open'

    const navigation = useNavigation();
    const onPress = (name : string)=>{
        if (name != route.name) {      
            navigation.reset({
                index:name == "Home"? 0:1,
                routes: name == "Home"?[
                    { name: name }as any,
                  ]:[
                    { name: "Home" }as any,
                  { name: name }as any,
                ],
              });
             
        }
}    

    return (
        <View style={[layout.rowBox, styles.containner]}>
            <Pressable style={styles.tapcon} onPress={()=>onPress("Home")}>
                <HomeIcon color={(!isDrawerOpen&&route.name === "Home") ? theme.active : theme.deactive} />
                <Text style={[styles.tabText, { color: (!isDrawerOpen&&route.name === "Home") ? theme.active : theme.deactive,
                        fontFamily:(!isDrawerOpen&&route.name === "Home")? Fonts.bold : Fonts.regular,
                 }]}>{t('Home')}</Text>
            </Pressable>
            <Pressable style={styles.tapcon}  onPress={()=>onPress("Polls")}>
                <PollsIcon color={(!isDrawerOpen&&route.name === "Polls") ? theme.active : theme.deactive}/>
                <Text style={[styles.tabText, { color: (!isDrawerOpen&&route.name === "Polls") ? theme.active : theme.deactive,
                      fontFamily:(!isDrawerOpen&&route.name === "Polls")? Fonts.bold : Fonts.regular,
                 }]}>{t('Opinion poll')}</Text>
            </Pressable>
            <Pressable style={styles.tapcon} onPress={()=>onPress("Notifications")}>
                <NotificationIcon color={(!isDrawerOpen&&route.name === "Notifications") ? theme.active : theme.deactive} />
                <Text style={[styles.tabText, { color: (!isDrawerOpen&&route.name === "Notifications") ? theme.active : theme.deactive,
                     fontFamily:(!isDrawerOpen&&route.name === "Notifications")? Fonts.bold : Fonts.regular,
                 }]}>{t('Notifications')}</Text>
            </Pressable>
            <Pressable style={styles.tapcon} onPress={()=>{
                navigation.dispatch(DrawerActions.openDrawer());
               
            }}>
                <MoreIcon color={(isDrawerOpen) ? theme.active : theme.deactive} />
                <Text style={[styles.tabText, { color: (isDrawerOpen) ? theme.active : theme.deactive,
                     fontFamily:(isDrawerOpen)? Fonts.bold : Fonts.regular,
                 }]}>{t('More')}</Text>
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
            borderTopLeftRadius:PixelPerfect(14),
            borderTopRightRadius:PixelPerfect(14),
            shadowColor:"#000",
            shadowRadius:PixelPerfect(14),
            shadowOpacity:0.1,
            shadowOffset:{
                width:0.3,
                height:0.3
            },
            elevation:7
        },
        tapcon: {
            flex: 1 / 4,
            alignItems: "center",
            justifyContent: "center",
           
        },
        tabText: {
            paddingTop: PixelPerfect(1),
            fontSize: PixelPerfect(16),
            fontFamily: Fonts.regular,
            lineHeight:19
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