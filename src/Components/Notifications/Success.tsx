import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, PixelPerfect } from '../../Constants/styleConstants'
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
          colors={[theme.mainColor,theme.secondColor]} style={[styles.linearGradient]}>
          <View style={[layout.rowBox,styles.con]}>
           <Check name='check-circle-fill' color={Colors.white} size={25} />
             <Text style={styles.errorNotificationText}>{toast.message}</Text>
          </View>
      </LinearGradient>
    </View>
 )
}

export default Error;

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