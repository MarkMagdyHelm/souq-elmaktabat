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
  const {
    navigation
  }=props
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  const showKeyboard = useKeyboard();
console.log('====================================');
console.log(Fonts.medium);
console.log('====================================');
  return (
    <Container showHint={false}>
      <View style={{ flex: showKeyboard?0:0.25, backgroundColor: theme.bodyBackground }}>

      </View>
      <View style={[styles.formContainner,{flex:showKeyboard?1:0.75}]}>
        <Content style={styles.formCon} noPadding>
          <View style={{ backgroundColor: theme.secondColor }}>
            <Text style={styles.label}>{t('Sign up')}</Text>
            <View style={styles.form}>
              <Inputs label={t('Email')}
                    options={{
                      onBlur: ()=>{},
                      onChangeText: txt => {
                       
                      },
                      maxLength:30,
                      keyboardType: 'email-address',
                    }}
                    password={false}
              />
               <Inputs label={t('Password')}
                    options={{
                      onBlur: ()=>{},
                      onChangeText: txt => {
                       
                      },
                      keyboardType: 'default',
                      maxLength:30,
                    }}
                    password={true}
              />
               <Inputs label={t('Confirm password')}
                    options={{
                      onBlur: ()=>{},
                      onChangeText: txt => {
                       
                      },
                      keyboardType: 'default',
                      maxLength:30,
                    }}
                    password={true}
              />
            </View>
            <Button
            title={t('Sign up')}
            />
             <Pressable style={styles.forgetPasswordCon}  onPress={()=>navigation.goBack()}>
                <Text style={styles.forgetPasswordText}>{t("Already have account")}
                <Text style={[styles.forgetPasswordText,{color:theme.signuoText}]}>  {t("Sign in")}</Text>
                </Text>
              </Pressable>
              <View style={styles.seperator}/>
              <Text style={styles.orText}>{t('Or Sign up with')}</Text>
              <View style={[layout.rowBox,styles.socialCon]}>
                  <Pressable style={styles.social}>
                    <GoogleIcon/>
                  </Pressable>
                  <Pressable style={styles.social}>
                    <FacebookIcon/>
                  </Pressable>
                {Platform.OS==="ios" &&
                  <Pressable style={styles.social}>
                    <AppleIcon/>
                  </Pressable>}
              </View>
          </View>
        </Content>
      </View>
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
    formContainner: {
      flex: 0.64,
      backgroundColor: theme.bodyBackground,
    },
    formCon: {
      flex: 1,
      backgroundColor: theme.secondColor,
      borderTopRightRadius: PixelPerfect(28),
      borderTopLeftRadius: PixelPerfect(28),
      paddingVertical: PixelPerfect(20),
      paddingHorizontal: PixelPerfect(20)
    },
    label: {
      color: theme.labelText,
      fontSize: PixelPerfect(32),
      fontFamily: Fonts.bold
    },
    form:{
      paddingVertical:PixelPerfect(25)
    },
    forgetPasswordCon:{
      alignItems:"center",
      justifyContent:"center"
    },
    forgetPasswordText:{
      color: theme.textTitle,
      fontSize: PixelPerfect(14),
      fontFamily: Fonts.regular
    },
    seperator:{
      height:PixelPerfect(1),
      backgroundColor:theme.inputTextColor,
      width:PixelPerfect(273),
      alignSelf:"center",
      marginVertical:PixelPerfect(20)
    },
    orText:{
      color: theme.orText,
      fontSize: PixelPerfect(18),
      fontFamily: Fonts.medium,
      textAlign:"center"
    },
    socialCon:{
      alignItems:"center",
      justifyContent:"space-evenly",
      marginTop:PixelPerfect(20)
    },
    social:{
      backgroundColor:theme.social,
      width:PixelPerfect(60),
      height:PixelPerfect(52),
      alignItems:"center",
      justifyContent:"center",
      borderRadius:PixelPerfect(8)
    }
  })