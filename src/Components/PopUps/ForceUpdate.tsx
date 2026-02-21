import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import Modal from 'react-native-modal';
import { ForceUpdateIcon } from '../../Assets/Svg'
import Button from '../touchables/Button'
type Props = {
  show: boolean,
  isForceUpdateOptional: boolean,
  onCloseFn: () => void
}

const ForceUpdate = (props: Props) => {
  const {
    show,
    onCloseFn,
    isForceUpdateOptional
  } = props
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);

  return (
    <Modal
      backdropOpacity={0.2}
      //    backdropColor='#00000'
      onBackButtonPress={() => {
        //  onCloseFn&&onCloseFn(state.selectFilter)
      }}
      onBackdropPress={() => {
        //   onCloseFn&&onCloseFn(state.selectFilter)
      }}
      isVisible={show}
      style={{ margin: 0, justifyContent: "center" }}
    >
      <View style={[styles.con]}>
        <ForceUpdateIcon />
        <Text style={styles.title}>{t("forcetitle")}</Text>
        <Text style={styles.mess1}>{t("forceMessage")}</Text>
        <Button
          title={t('forcetxt1')}
          styleTitle={styles.buttonText}
          onPress={() => { }}
          style={styles.button}
        />
        {isForceUpdateOptional && <Button
          title={t('forcetxt2')}
          styleTitle={styles.buttonText2}
          onPress={() => { onCloseFn && onCloseFn() }}
          style={styles.button2}
        />}
      </View>
    </Modal>
  )
}

export default ForceUpdate

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
  StyleSheet.create({
    con: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.white,
      borderRadius: PixelPerfect(16),
      paddingVertical: PixelPerfect(32),
      marginHorizontal: PixelPerfect(23)
    },
    title: {
      fontFamily: Fonts.bold,
      fontSize: PixelPerfect(24),
      color: Colors.secondColor,
      paddingTop: PixelPerfect(16)
    },
    mess1: {
      fontFamily: Fonts.regular,
      fontSize: PixelPerfect(18),
      color: theme.black,
      textAlign: "center",
      paddingHorizontal: PixelPerfect(30),
      marginTop: PixelPerfect(16),
     
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.secondColor,
      marginTop: PixelPerfect(8),
      width: "75%"
    },
    buttonText: {
      fontFamily: Fonts.bold,
      fontSize: PixelPerfect(20),
      color: Colors.white
    },
    button2: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.white,
      marginTop: PixelPerfect(8),
      width: "75%",
      height: PixelPerfect(22)
    },
    buttonText2: {
      fontFamily: Fonts.bold,
      fontSize: PixelPerfect(20),
     lineHeight:PixelPerfect(25),
      color: Colors.secondColor
    },
  })