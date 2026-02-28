import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import LinearGradient from 'react-native-linear-gradient';
import { ErrorNOtfiIcon } from '../../Assets/Svg'

type Props = {
 toast: any
}

const ErrorToast = (props: Props) => {
const {
toast
 } = props
const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
 const styles = useStyles(Fonts, theme, dark, dir);
 return (
<View style={styles.notficationCon}>
         <LinearGradient 
        start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
        colors={dir=="rtl"?['#FF011E','#eb001b' ]:['#eb001b','#FF011E']} style={[styles.linearGradient]}>
        <View style={[layout.rowBox,styles.con]}>
         <ErrorNOtfiIcon/>
         <Text style={styles.errorNotificationText}>{toast.message}</Text>
        </View>
    </LinearGradient>
  </View>
 )
}

export default ErrorToast;

const useStyles = (fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
StyleSheet.create({
  con:{
    alignItems:"center",
    width:"100%",
    flex:1,
    paddingHorizontal:PixelPerfect(10)
  },
    notficationCon:{
        width:"90%",
        borderRadius:PixelPerfect(11),
        marginVertical:PixelPerfect(5),
     },
     errorNotificationText:{
        color:Colors.white,
        fontFamily:fonts.medium,
        fontSize:PixelPerfect(12),
        paddingHorizontal:PixelPerfect(10),
        lineHeight:24
     },
     linearGradient:{
        flex:1,
        alignItems:"center",
        borderRadius:PixelPerfect(8),
    height:PixelPerfect(50),
     },
     errorNotificationSmallText:{
       color:"#FFFF",
       fontFamily:fonts.light,
       fontSize:14,
     }
}) 