import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { PixelPerfect } from '../../Constants/styleConstants'
import { changeLanguage, t } from 'i18next'
import { Container, Content } from '../../Components/containers/Containers'
import HeaderWithText from '../../Components/Headers/HeaderWithText'
import { ChangeLangRoundCheckedIcon, ChangeLangRoundIcon } from '../../Assets/Svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Store/store'

import { ChangeLanguageHandler } from '../../Apis/CommonApi'

type Props = {
  navigation: any
}

const Index = (props: Props) => {
  const {
    navigation
  } = props
  const { Fonts, dir, layout, theme, dark, toggleDir } = useContext(ThemeContext);
  const { langauge } = useSelector((state: RootState) => state.settings);

  const [check, setCheck] = useState(false);
  const position = useRef(new Animated.Value(0)).current;
  const newValue = langauge == "en" ? 40 : 1;
  const styles = useStyles(Fonts, theme, dark, dir);
  const [state, setstate] = useState({
    loading: false,
  });
  const dispatch = useDispatch()
  useEffect(() => {
    if (langauge === "ar") {
      setCheck(true)
    } else {
      setCheck(false)
    }
  }, [])
  const toggleLanguage = (lang) => {

    Animated.timing(position, {
      toValue: newValue,
      duration: 200,
      useNativeDriver: false,
    }).start();

    toggleDir(lang == "ar" ? "rtl" : "ltr");
    dispatch<any>(ChangeLanguageHandler(lang == "ar" ? "ar" : "en"))

  };

  return (
    <Container showHint={false}
      fullBackground
    >
      <HeaderWithText
        title={t("Change Language")}
      />


      <Text style={styles.textChaneLang}>{t("Change Language")}</Text>

      <Pressable style={[layout.rowBox, !check ? styles.changeLanguageView : styles.changeLanguageViewChecked]} onPress={() => {
        toggleLanguage("ar")
        setCheck(!check)
      }}>
        {check ? <ChangeLangRoundCheckedIcon /> : <ChangeLangRoundIcon />}
        <Text style={styles.text}>
          {t("اللغة العربية")}
        </Text>
      </Pressable>

      <Pressable style={[layout.rowBox, check ? styles.changeLanguageView : styles.changeLanguageViewChecked]} onPress={() =>
        {
          toggleLanguage("en")
           setCheck(!check)}}>
        {!check ? <ChangeLangRoundCheckedIcon /> : <ChangeLangRoundIcon />}
        <Text style={styles.text}>
          {t("English")}
        </Text>
      </Pressable>


    </Container>
  )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string) =>
  StyleSheet.create({

    changeLanguageView: {
      alignItems: "center",
      gap: PixelPerfect(5),
      borderColor: "#888888",
      borderWidth: PixelPerfect(1),
      paddingVertical: PixelPerfect(15),
      paddingHorizontal: PixelPerfect(16),
      marginHorizontal: PixelPerfect(16),
      marginVertical: PixelPerfect(10),
      borderRadius: PixelPerfect(6)
    },
    changeLanguageViewChecked: {
      alignItems: "center",
      gap: PixelPerfect(5),
      borderColor: "#3D4A78",
      borderWidth: PixelPerfect(1),
      paddingVertical: PixelPerfect(15),
      paddingHorizontal: PixelPerfect(16),
      marginHorizontal: PixelPerfect(16),
      marginVertical: PixelPerfect(10),
      borderRadius: PixelPerfect(6)
    }

    ,

    textChaneLang: {
      marginHorizontal: PixelPerfect(18),
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(16),
      color: "#3D4A78",
    },
    text: {
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(16),
      color: theme.black,
    },

  })