import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import LinearGradient from 'react-native-linear-gradient';
import Check from 'react-native-vector-icons/Octicons';

type Props = {
 toast: any
}

const Error = (props: Props) => {
const {
toast
 } = props
const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
 const styles = useStyles(Fonts, theme, dark, dir);
 return (
<View style={styles.notficationCon}>
         <LinearGradient 
        start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
        colors={dir=="rtl"?['#1BAB1F','#2FF235']:['#2FF235' ,'#1BAB1F']} style={[styles.linearGradient,layout.rowBox]}>
         <Check name='check-circle-fill' color={"#fff"} size={25} />
    <Text style={styles.errorNotificationText}>{toast.message}</Text>
    {toast.smallMessage&& <Text style={[styles.errorNotificationSmallText,dir=="rtl"?{
      position:"absolute",
      right:10,
    }:{ position:"absolute",
    left:10,}]}>{toast.smallMessage}</Text>}
    </LinearGradient>
  </View>
 )
}

export default Error;

const useStyles = (fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
StyleSheet.create({
    notficationCon:{
        backgroundColor:theme.appointment,
        width:"90%",
        borderRadius:PixelPerfect(11),
        marginVertical:PixelPerfect(5)
     },
     errorNotificationText:{
        color:"#FFFF",
        fontFamily:fonts.medium,
        fontSize:14,
        paddingHorizontal:PixelPerfect(10),
        textAlign : dir=="rtl"?"right":"left",
        shadowColor:theme.appointment
     },
     linearGradient:{
        flex:1,
       
        alignItems:"center",
        paddingHorizontal:PixelPerfect(10),
        paddingVertical:PixelPerfect(10),
        borderRadius:PixelPerfect(8),
    
     },
     errorNotificationSmallText:{
       color:"#FFFF",
       fontFamily:fonts.light,
       fontSize:14,
    //    ...commonStyles.boxShadownom,
       shadowColor:theme.appointment,
      
     }
})