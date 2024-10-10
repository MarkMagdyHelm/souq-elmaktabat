import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'

type Props = {
    title: any
}

const HeaderWithText = (props: Props) => {
    const {
        title
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    return (
        <View style={styles.con}>
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
            justifyContent: "center"
        },
        title:{
            fontFamily:Fonts.bold,
            color:theme.active,
            paddingHorizontal:PixelPerfect(8),
            fontSize:PixelPerfect(22),
            lineHeight:PixelPerfect(30)
        }
    })