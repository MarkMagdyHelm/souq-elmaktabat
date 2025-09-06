import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { BackIcon } from '../../Assets/Svg'
import { useNavigation } from '@react-navigation/native'

type Props = {
    title: any
}

const HeaderWithText = (props: Props) => {
    const {
        title
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const navigation = useNavigation();
    return (
        <View style={[layout.rowBox,styles.con]}>
            <Pressable style={styles.backcon} onPress={()=>navigation.canGoBack()&&navigation.goBack()}>
            <BackIcon/>
            </Pressable>
            <Text style={styles.title}>{title}</Text>
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
            paddingHorizontal:PixelPerfect(19),
            // backgroundColor:"red"
        },
        title:{
            fontFamily:Fonts.medium,
            color:theme.active,
            fontSize:PixelPerfect(22),
            lineHeight:PixelPerfect(30)
        },
        backcon:{
           height:"100%",
           width:"20%",
            left:19,
            alignItems:"flex-end",
            justifyContent:"center",
            position:"absolute"
        }
    })