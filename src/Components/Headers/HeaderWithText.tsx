import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { BackIcon, FavoriteIcon, ShareIcon, SharIcon } from '../../Assets/Svg'
import { useNavigation } from '@react-navigation/native'

type Props = {
    title: any,
    isShareVisible?: any,
    onFavClick?:()=>any,
    onShareClick?:()=>any
}

const HeaderWithText = (props: Props) => {
    const {
        title,
        isShareVisible,
        onFavClick,
        onShareClick
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const navigation = useNavigation();
    return (
        <View style={[layout.rowBox, styles.con]}>
            <Pressable style={styles.backcon} onPress={() => navigation.canGoBack() && navigation.goBack()}>
                <BackIcon />
            </Pressable>
            <Text style={styles.title}>{title}</Text>
            {isShareVisible && <View style={[layout.rowBox, styles.view]}>
                <Pressable onPress={() => onFavClick()}>
                    <FavoriteIcon />
                </Pressable>
                <Pressable style={{ paddingHorizontal: PixelPerfect(12) }} 
                onPress={() => onShareClick() }>
                    <ShareIcon />
                </Pressable>
            </View>
            }

        </View>
    )
}

export default HeaderWithText

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        con: {
            flex: 0.1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: PixelPerfect(19),

        },
        title: {
            fontFamily: Fonts.medium,
            color: theme.active,
            fontSize: PixelPerfect(22),
            lineHeight: PixelPerfect(30)
        },
        backcon: {
            height: "100%",
            width: "20%",
            left: 19,
            alignItems: "flex-end",
            justifyContent: "center",
            position: "absolute"
        },
        view: {
            height: "100%",
            width: "20%",
            right: 10,

            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            position: "absolute"
        }
    })