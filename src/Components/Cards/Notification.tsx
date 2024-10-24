import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, phoneWidth, PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { NotificationIcon } from '../../Assets/Svg'
import moment from 'moment'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

type Props = {
    item?: any,
    onPress:()=>void,
    loading:boolean
}

const Notification = (props: Props) => {
    const {
        item,
        onPress,
        loading
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    // console.log('====================================');
    // console.log(item);
    // console.log('====================================');
    return (
        <Pressable style={[layout.rowBox,styles.con]} onPress={onPress}>
           <View style={styles.iconCon}>
            <NotificationIcon color={Colors.white}/>
           </View>
           <View style={styles.bodyCon}>
              <View style={[layout.rowBox,styles.textsCon]}>
              {loading?
                <SkeletonPlaceholder backgroundColor={Colors.secondColor}> 
              <SkeletonPlaceholder.Item backgroundColor={Colors.secondColor} marginBottom={8}   height={PixelPerfect(20)}
              width={150}></SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
              :  <Text style={[layout.textAlign,styles.text1]} numberOfLines={1}>{item?.title}</Text>}
                {loading?
                <SkeletonPlaceholder backgroundColor={Colors.secondColor}> 
              <SkeletonPlaceholder.Item backgroundColor={Colors.secondColor} marginBottom={8}    height={PixelPerfect(20)}
              width={150}/>
              </SkeletonPlaceholder>
              : <Text style={[layout.textAlign,,styles.text2]}>{moment().locale("en").format('DD')} {moment().locale("ar").format('MMM')} {moment().locale("en").format('YYYY')}</Text>}
              </View>
              {loading?
             <SkeletonPlaceholder backgroundColor={Colors.secondColor}> 
                <SkeletonPlaceholder.Item  alignSelf='flex-end'   height={PixelPerfect(20)}
              width={250}></SkeletonPlaceholder.Item></SkeletonPlaceholder>
              : <Text numberOfLines={1} style={[layout.textAlign,styles.textMessage]}>{item?.description}</Text>}
           </View>
        </Pressable>
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
      fontSize:PixelPerfect(18),
      width:"60%"
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