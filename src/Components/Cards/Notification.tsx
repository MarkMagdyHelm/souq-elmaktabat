import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, phoneWidth, PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { NotificationIcon } from '../../Assets/Svg'

type Props = {
    item?: any
}

const Notification = (props: Props) => {
    const {
        item
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    return (
        <View style={[layout.rowBox,styles.con]}>
           <View style={styles.iconCon}>
            <NotificationIcon color={Colors.white}/>
           </View>
           <View style={styles.bodyCon}>
              <View style={[layout.rowBox,styles.textsCon]}>
                <Text style={[layout.textAlign,styles.text1]}>{"استطلاع راي "}</Text>
                <Text style={[layout.textAlign,,styles.text2]}>{"09سبتمبر 2024"}</Text>
              </View>
              <Text numberOfLines={1} style={[layout.textAlign,styles.textMessage]}>{"تم اضافة استطلاع راي جديد شارك برايك الان"}</Text>
           </View>
        </View>
    )
}

export default Notification

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
con:{
    paddingHorizontal:PixelPerfect(16),
    // borderBottomColor:theme.border,
    // borderBottomWidth:PixelPerfect(2),
    alignItems:"center",
    paddingVertical:PixelPerfect(16)
},
iconCon:{
    backgroundColor:theme.textColor,
    width:PixelPerfect(40),
    height:PixelPerfect(40),
    borderRadius:PixelPerfect(40)/2,
    alignItems:"center",
    justifyContent:"center"
},
bodyCon:{
    paddingHorizontal:PixelPerfect(4),
    justifyContent:"space-between",
    width:phoneWidth - PixelPerfect(76),
    // height:PixelPerfect(40)
},
textsCon:{
    alignItems:"center",
    justifyContent:"space-between"
},
text1:{
    fontFamily:Fonts.bold,
      color:theme.black,
      fontSize:PixelPerfect(18)
},
text2:{
    fontFamily:Fonts.regular,
      color:theme.timeText,
      fontSize:PixelPerfect(16)
},
textMessage:{
    fontFamily:Fonts.regular,
    color:theme.black,
    fontSize:PixelPerfect(16),
    paddingTop:PixelPerfect(10),
    lineHeight:19.2
}
    });