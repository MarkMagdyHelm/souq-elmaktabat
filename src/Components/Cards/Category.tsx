import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants';

type Props = {}

const Category = (props: Props) => {
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
  return (
    <View style={styles.con}>
      <View style={styles.imageCon}>
        <Image style={styles.image}
        source={require('../../Assets/Images/hospital.png')}
        />
      </View>
        <Text style={styles.text}>Hospital</Text>
    </View>
  )
}

export default Category

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
StyleSheet.create({
    con:{
        backgroundColor:Colors.white,
        borderRadius:PixelPerfect(8),
        height:PixelPerfect(82),
        width:(phoneWidth-PixelPerfect(55))/3,
        alignItems:"center",
        justifyContent:"center",
        marginBottom:PixelPerfect(8)
    },
    imageCon:{
        height:PixelPerfect(30),
        width:PixelPerfect(30),
    },
    image:{
        height:PixelPerfect(30),
        width:PixelPerfect(30),
    },
    text:{
        color: theme.labelText,
        fontSize: PixelPerfect(12),
        fontFamily: Fonts.regular,
        marginVertical:PixelPerfect(7),
    }
});