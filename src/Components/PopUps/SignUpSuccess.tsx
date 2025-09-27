import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import Modal from 'react-native-modal';
import { SuccessIcon } from '../../Assets/Svg'
import Button from '../touchables/Button'
type Props = {
  show: boolean,
  onCloseFn?: () => void
}

const SignUpSuccess = (props: Props) => {
  const {
    show,
    onCloseFn,
    
  } = props
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);

  return (
    <Modal
      backdropOpacity={0.2}
      //    backdropColor='#00000'
      onBackButtonPress={() => {
        //  onCloseFn&&onCloseFn()
      }}
      onBackdropPress={() => {
          // onCloseFn&&onCloseFn()
      }}
      isVisible={show}
      style={{ margin: 0, justifyContent: "center" }}
    >
      <View style={[styles.con]}>
        <SuccessIcon />
        <Text style={styles.title}>{t("regtxt8")}</Text>
      </View>
    </Modal>
  )
}

export default SignUpSuccess

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
  StyleSheet.create({
    con: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.white,
      borderRadius: PixelPerfect(16),
      paddingVertical: PixelPerfect(64),
      marginHorizontal: PixelPerfect(23)
    },
    title: {
      fontFamily: Fonts.bold,
      fontSize: PixelPerfect(24),
      color: Colors.secondColor,
      paddingTop: PixelPerfect(16)
    },
  
  })