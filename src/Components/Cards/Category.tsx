import { Image, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ColorWithOpacity, Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants';
import { t } from 'i18next';
import {imageUrl} from '../../Constants/config'
type Props = {
  item:any
}

const Category = (props: Props) => {
  const {
    item
  } =props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);

  return (
    <View style={[layout.rowBox,styles.con,]}>
      <View style={[layout.rowBox,{alignItems:"center"}]}>
      <View style={styles.imageCon}>
        <Image style={styles.image}
       
        source={{uri:imageUrl+item?.imageUrl,cache:'reload' }}
        />
      </View>
      <View style={{justifyContent:"center",paddingHorizontal:PixelPerfect(5)}}>
        <Text style={[layout.textAlign,styles.text1]}>{item?.name}</Text>
        <Text style={[layout.textAlign,styles.text2]}>{item?.paperSize}</Text>
      </View>
      </View>
      
        <Text style={styles.currency}>{item?.price} {t("LE")}</Text>
    </View>
  )
}

export default Category

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
StyleSheet.create({
    con:{
      paddingLeft:PixelPerfect(5),
        borderRadius:PixelPerfect(8),
        height:PixelPerfect(60),
        width:(phoneWidth-PixelPerfect(29))/2,
        alignItems:"center",
        backgroundColor:Colors.white,
        marginBottom:PixelPerfect(16),
       borderColor:ColorWithOpacity(theme.black,0.25),
       borderWidth:PixelPerfect(0.7),
       borderRaduis:PixelPerfect(4),
       justifyContent:"space-between",
       elevation: 1,
       shadowColor: '#000',
       shadowOffset: {width: 0, height: 1},
       shadowOpacity: 0.3,
       shadowRadius: 1,
    },
    imageCon:{
        height:PixelPerfect(50),
        width:PixelPerfect(50),
    },
    image:{
        height:PixelPerfect(50),
        width:PixelPerfect(50),
        borderRadius:PixelPerfect(10),
        resizeMode:"contain"
    },
    text1:{
        color: theme.textColor,
        fontSize: PixelPerfect(16),
        fontFamily: Fonts.bold,
    },
    text2:{
      color: theme.black,
      fontSize: PixelPerfect(12),
      fontFamily: Fonts.light,
    },
    currency:{
      color: theme.currenctText,
      fontSize: PixelPerfect(18),
      fontFamily: Fonts.bold,
       paddingHorizontal:PixelPerfect(4)
      }
});