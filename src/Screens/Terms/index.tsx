import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import {  PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { Container, Content } from '../../Components/containers/Containers'
import HeaderWithText from '../../Components/Headers/HeaderWithText'

type Props = {
    navigation: any
}

const Index = (props: Props) => {
    const {
        navigation
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const [state, setstate] = useState({
      loading:false,
    });
   
    
    return (
        <Container showHint={false}
            fullBackground
        >
          <Content>
          <HeaderWithText
                title={t("terms")}
            />

            <Text style={styles.text}>
              {t("termsData")}
            </Text>
          
          </Content>
         
        </Container>
    )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
      
   
      
          text:{
            fontFamily:Fonts.regular,
            fontSize:PixelPerfect(16),
            lineHeight: PixelPerfect(24),
            marginVertical:PixelPerfect(12),
            color:theme.black,
          },
        
    })