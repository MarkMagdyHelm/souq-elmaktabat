import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native'


type Props = {
   
}

const Loader = (props: Props) => {
    const {
     
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);

    return (
        <Modal
           backdropOpacity={0.2}
        //    backdropColor='#00000'
        onBackButtonPress={()=>{}}
        onBackdropPress={()=>{}}
            isVisible={true}
            style={{margin:0,justifyContent:"center",alignItems:"center"}}
        >
           <View style={[styles.con]}>
           <LottieView
              source={require('../../Assets/Animations/loader.json')}
              autoPlay
              loop
              style={{
                width: PixelPerfect(30),
                height: PixelPerfect(30),
              }}/>
           </View>
        </Modal>
    )
}

export default Loader

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        con:{
            backgroundColor:Colors.secondColor,
            borderRadius:PixelPerfect(8),
           width:PixelPerfect(70),
           height:PixelPerfect(70),
           alignItems:"center",
           justifyContent:"center"
        },
      
    })