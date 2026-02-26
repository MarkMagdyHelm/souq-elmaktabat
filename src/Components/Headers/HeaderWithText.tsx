import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { BackIcon, FavoriteIcon, HeartIcon, ShareIcon, SharIcon } from '../../Assets/Svg'
import { useNavigation } from '@react-navigation/native'

type Props = {
    title: any,
    isShareVisible?: any,
    isFavVisible?: any,
    onFavClick?: () => any,
    onShareClick?: () => any,
    style?: ViewStyle,
    hasNotBack?: boolean
    isFaverouit?: boolean
}

const HeaderWithText = (props: Props) => {
    const {
        title,
        isShareVisible,
        isFavVisible,
        onFavClick,
        onShareClick,
        style,
        hasNotBack,
        isFaverouit
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const navigation = useNavigation();
    return (
        <View style={[layout.rowBox, styles.con, style]}>
            {!hasNotBack && <Pressable style={styles.backcon} onPress={() => navigation.canGoBack() && navigation.goBack()}>
                <BackIcon
                    transform={dir != "rtl" ? [{ rotateY: "180deg" }] : undefined} />
            </Pressable>}
            <Text style={styles.title}>{title}</Text>
            {isShareVisible && <View style={[layout.rowBox, styles.view]}>
                {isFavVisible && <Pressable onPress={() => onFavClick()}>
                    <HeartIcon
                        color={isFaverouit ? theme.red : theme.white}
                    />
                </Pressable>
                }
                <Pressable style={{ paddingHorizontal: PixelPerfect(12) }}
                    onPress={() => onShareClick()}>
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
            paddingHorizontal: PixelPerfect(19)

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
            [dir != "rtl" ? "left" : "right"]: 10,
            alignSelf: "center",
            alignItems: dir === "ltr" ? "flex-start" : "flex-end",
            justifyContent: "center",
            position: "absolute"
        },
        view: {
            height: "100%",
            width: "20%",
            [dir == "rtl" ? "left" : "right"]: 10,
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            position: "absolute"
        }
    })