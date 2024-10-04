import { Keyboard, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { Container, Content } from '../../../Components/containers/Containers'
import { Colors, PixelPerfect, phoneHeight } from '../../../Constants/styleConstants'
import { ThemeContext } from '../../../Constants/theming'
import { IFont, ITheme } from '../../../Constants/interfaces'
import { t } from 'i18next'
import Inputs from '../../../Components/inputs/index'
import Button from '../../../Components/touchables/Button';
import {useKeyboard} from '../../../Constants/UseKayboard'
import { AppleIcon, FacebookIcon, GoogleIcon } from '../../../Assets/Svg'
type Props = {
  navigation:any
}

const Index = (props: Props) => {
  const  {
navigation
  }=props;
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  const showKeyboard = useKeyboard();
  return (
    <Container showHint={false}
    isdark={false}
    >
        <Content style={styles.formCon} noPadding>

        </Content>
    </Container>
  )
}

export default Index

const useStyles = (
  Fonts: IFont,
  theme: ITheme,
  darkmode: boolean,
  dir: string,
) =>
  StyleSheet.create({
    formCon: {
      flex: 1,
      backgroundColor: theme.secondColor,
      borderTopRightRadius: PixelPerfect(28),
      borderTopLeftRadius: PixelPerfect(28),
      paddingVertical: PixelPerfect(20),
      paddingHorizontal: PixelPerfect(20)
    },
   
  })