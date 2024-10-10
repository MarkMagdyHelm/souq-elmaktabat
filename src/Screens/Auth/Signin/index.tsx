import { Image, Keyboard, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { Container, Content } from '../../../Components/containers/Containers'
import { Colors, PixelPerfect, phoneHeight } from '../../../Constants/styleConstants'
import { ThemeContext } from '../../../Constants/theming'
import { IFont, ITheme } from '../../../Constants/interfaces'
import { t } from 'i18next'
import Inputs from '../../../Components/inputs/index'
import Button from '../../../Components/touchables/Button';
import {useKeyboard} from '../../../Constants/UseKayboard'
import { AppleIcon, FacebookIcon, GoogleIcon, LogoIcon } from '../../../Assets/Svg'
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
const handlePass = ()=>{
  navigation.reset({
    index: 0,
    routes: [
      { name: 'Home' },
    ],
  });
}
  return (
    <Container showHint={false}
    fullBackground
    >
        <Content style={styles.formCon} noPadding >
            <View style={styles.logoCon}>
              <Text style={[styles.passTxt,dir=="rtl"?{left:0}:{right:0}]}
              onPress={handlePass}
              >{t("Pass")}</Text>
            <LogoIcon/>
            </View>
            <View style={styles.textCon}>
            <Text style={[layout.textAlign,styles.textsection1]}>{t("signin1")}</Text>
            </View>
               <View style={styles.inputsCon}>
               <Inputs label={t('username')}
                    options={{
                      onBlur: ()=>{},
                      onChangeText: txt => {
                      },
                      placeholder:t("usernamew"),
                      maxLength:30,
                      keyboardType: 'email-address',
                    }}
                    password={false}
              />
              <Inputs label={t('pasword')}
                    options={{
                      onBlur: ()=>{},
                      onChangeText: txt => {
                      },
                      placeholder:t("paswordw"),
                      keyboardType: 'default',
                      maxLength:30,
                    }}
                    password={true}
              />
               </View>
               <View style={styles.forgetPassword}>
                    <Text style={styles.forgetPasswordtxt}>{t("Forget password ?")}</Text>
               </View>
               <View style={{backgroundColor:theme.mainColor}}>
               <Button
              title={t('Sign in')}
              styleTitle={styles.buttonText}
              onPress={()=>navigation.navigate("Signin")}
              style={styles.button}
              />
               </View>
               <Pressable style={styles.signUpCon} onPress={()=>{navigation.navigate("Signup")}}>
                <Text style={styles.signUpText}>{t("Don't have account")}
                <Text style={[styles.signUpText1]}>  {t("Sign up")}</Text>
                </Text>
              </Pressable>
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
      backgroundColor: theme.mainColor,
      paddingVertical: PixelPerfect(20),
      paddingHorizontal: PixelPerfect(20)
    },
    logoCon:{
      alignItems:"center",
      justifyContent:"center",
      backgroundColor:theme.mainColor,
      paddingTop:PixelPerfect(32)
    },
    passTxt:{
      fontFamily:Fonts.medium,
      fontSize:PixelPerfect(20),
      color:theme.black,
      position:"absolute",
      top:0
    },
    textsection1:{
      fontFamily:Fonts.bold,
      color:theme.active,
      paddingHorizontal:PixelPerfect(8),
      fontSize:PixelPerfect(22),
      
    },
    textCon:{
      backgroundColor:theme.mainColor,
      paddingTop:PixelPerfect(32)
    },
    inputsCon:{
      backgroundColor:Colors.white,
      paddingTop:PixelPerfect(32)
    },
    forgetPassword:{
      alignItems:"flex-start",
      backgroundColor:theme.mainColor
    },
    forgetPasswordtxt:{
      fontFamily:Fonts.bold,
      fontSize:PixelPerfect(14),
      color:theme.textColor,
    },
    button:{
      backgroundColor:Colors.secondColor,
      height:PixelPerfect(50),
      alignItems:"center",
      justifyContent:"center",
      marginTop:PixelPerfect(16)
    },
    buttonText:{
      fontFamily:Fonts.bold,
      fontSize:PixelPerfect(18),
      color:theme.mainColor,
    },
    signUpCon:{
      backgroundColor:theme.mainColor,
      paddingTop:PixelPerfect(16),
      alignItems:"center",
      justifyContent:"center"
    },
    signUpText:{
      fontFamily:Fonts.medium,
      fontSize:PixelPerfect(14),
      color:theme.deactive,
    },
    signUpText1:{
      fontFamily:Fonts.bold,
      fontSize:PixelPerfect(16),
      color:Colors.secondColor,
    }
  })