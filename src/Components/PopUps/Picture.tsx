import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, ColorWithOpacity, phoneHeight, phoneWidth, PixelPerfect } from '../../Constants/styleConstants'
import Modal from 'react-native-modal';
type Props = {
 show: boolean,
 onCloseFn:()=>void,
 image:string
}

const BigImage = (props: Props) => {
const {
show,
image,
onCloseFn
 } = props
 const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
 const styles = useStyles(Fonts, theme, dark, dir);
 
 return (
    <Modal
    backdropOpacity={0.7}
    backdropColor='#00000'
 onBackButtonPress={()=>{
     onCloseFn&&onCloseFn()
 }}
 onBackdropPress={()=>{
  onCloseFn&&onCloseFn()
 }}
     isVisible={show}
     style={{margin:0,justifyContent:"center"}}
 >
  <Pressable style={styles.con} onPress={()=>  onCloseFn&&onCloseFn()}>
  <Image
  source={{uri:image}}
   resizeMode='stretch'
  style={{height:phoneHeight- PixelPerfect(200),width:phoneWidth-PixelPerfect(36),borderRadius:PixelPerfect(20)}}
  >
  </Image>  

  </Pressable>
 </Modal>
 )
}

export default BigImage

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
StyleSheet.create({
    con:{
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:ColorWithOpacity(theme.black,0.5),
        borderRadius:PixelPerfect(16),
        paddingVertical:PixelPerfect(32),
        // marginHorizontal:PixelPerfect(23)
        flex:1
    },
    title:{
        fontFamily:Fonts.bold,
        fontSize:PixelPerfect(24),
        color:Colors.secondColor,
        paddingTop:PixelPerfect(16)
    },
    mess1:{
        fontFamily:Fonts.regular,
        fontSize:PixelPerfect(18),
        color:theme.black,
        textAlign:"center",
        paddingHorizontal:PixelPerfect(30),
        paddingTop:PixelPerfect(16)
    },
    button:{
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:Colors.secondColor,
        marginTop:PixelPerfect(8),
        width:"75%"
      },
      buttonText:{
        fontFamily:Fonts.bold,
        fontSize:PixelPerfect(20),
        color:Colors.white
      },
      button2:{
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:Colors.white,
        marginTop:PixelPerfect(8),
        width:"75%",
        height:PixelPerfect(22)
      },
      buttonText2:{
        fontFamily:Fonts.bold,
        fontSize:PixelPerfect(20),
        lineHeight:30,
        color:Colors.secondColor
      },
})