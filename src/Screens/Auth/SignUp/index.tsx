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
import { AppleIcon, ArrowDownIcon, FacebookIcon, GoogleIcon } from '../../../Assets/Svg'
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
  const handlePass = ()=>{
    navigation.reset({
      index: 0,
      routes: [
        { name: 'Home' },
      ],
    });
  }
  return (
    <Container showHint={false}>
        <Content style={styles.formCon} noPadding>
          <View style={{ backgroundColor: theme.mainColor }}>
          <View style={[layout.rowBox,styles.section1]}>
              <Text style={styles.textsection1}>{t("signtxt1")}</Text>
              <Text style={[styles.passTxt,dir=="rtl"?{left:0}:{right:0}]}
              onPress={handlePass}
              >{t("Pass")}</Text>
              </View>
              <Inputs label={t('fullname')}
                    options={{
                      onBlur: ()=>{},
                      onChangeText: txt => {
                      },
                      placeholder:t("fullnamew"),
                      maxLength:100,
                      keyboardType: 'default',
                    }}
                    password={false}
              />
                <Inputs label={t('Email')}
                    options={{
                      onBlur: ()=>{},
                      onChangeText: txt => {
                      },
                      placeholder:t("Emailw"),
                      maxLength:30,
                      keyboardType: 'email-address',
                    }}
                    password={false}
              />
              <Inputs label={t('Phone')}
                    options={{
                      onBlur: ()=>{},
                      onChangeText: txt => {
                      },
                      placeholder:t("Phonew"),
                      maxLength:30,
                      keyboardType: Platform.OS === 'android' ? "numeric" : "number-pad",
                    }}
                    password={false}
                    isPhone={true}
                    input={{width:"75%"}}
              />
              <Pressable style={styles.selectMenueCon}>
                <Text style={[layout.textAlign,styles.label]}>{t("AccountType")}</Text>
                <View style={[layout.rowBox,styles.selectMenue]}>
                <Text style={styles.textselectmenu}>{t("AccountTypew")}</Text>
                <ArrowDownIcon/>
                </View>
              </Pressable>
              <Pressable style={styles.selectMenueCon}>
                <Text style={[layout.textAlign,styles.label]}>{t("Government")}</Text>
                <View style={[layout.rowBox,styles.selectMenue]}>
                <Text style={styles.textselectmenu}>{t("Governmentw")}</Text>
                <ArrowDownIcon/>
                </View>
              </Pressable>
                <Inputs label={t('adress')}
                    options={{
                      onBlur: ()=>{},
                      onChangeText: txt => {
                      },
                      numberOfLines:2,
                      placeholder:t("adressw"),
                      maxLength:250,
                      keyboardType: 'default',
                      multiline:true,
                    }}
                     inputCon={{height:PixelPerfect(74),paddingTop:PixelPerfect(17)}}
                     input={{height:PixelPerfect(74),verticalAlign:"top"}}
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
               <Inputs label={t('confirmpasword')}
                    options={{
                      onBlur: ()=>{},
                      onChangeText: txt => {
                      },
                      placeholder:t("confirmpaswordw"),
                      keyboardType: 'default',
                      maxLength:30,
                    }}
                    password={true}
              />
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
          </View>
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
      paddingHorizontal: PixelPerfect(19)
    },
    section1:{
      marginBottom:PixelPerfect(18),
      alignItems:"center",
      justifyContent:"space-between"
    },
    textsection1:{
      fontFamily:Fonts.bold,
      color:theme.active,
      fontSize:PixelPerfect(22)
    },
    passTxt:{
      fontFamily:Fonts.medium,
      fontSize:PixelPerfect(20),
      color:theme.black,
    }, 
    selectMenueCon:{
    
    },
    label:{
      fontFamily:Fonts.medium,
      fontSize:PixelPerfect(18),
      color:theme.black,
      marginBottom:PixelPerfect(10)
  },
  selectMenue:{
    justifyContent:"space-between",
    backgroundColor:Colors.white,
    height:PixelPerfect(50),
    alignItems:"center",
    borderRadius:PixelPerfect(8),
    paddingHorizontal:PixelPerfect(10),
    marginBottom:PixelPerfect(20),
    borderWidth:PixelPerfect(1),
    borderColor:theme.optionText
  },
  textselectmenu:{
    fontFamily:Fonts.medium,
    fontSize:PixelPerfect(16),
    color:theme.deactive,
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
    justifyContent:"center",
    marginBottom:PixelPerfect(50)
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