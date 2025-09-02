import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { Container } from '../containers/Containers'
import Button from '../touchables/Button'
import { ContactUsIcon, ShareMoreIcon, SharIcon } from '../../Assets/Svg'
import { useSelector } from 'react-redux'
import { RootState } from '../../Store/store'

type Props = {
    navigation: any
}

const MoreComponnent = (props: Props) => {
  const { isLogin } = useSelector((state:RootState) => state.auth);
  const { appSettings } = useSelector((state:RootState) => state.settings);
   let SignInActive :any={}
   if (appSettings?.length !=0) {
    
     SignInActive= appSettings?.find((el:any)=>el.type == "SignInActive");
   }

    const {
        navigation
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    return (
        <Container>
            <View style={styles.body}>
            <Text style={[layout.textAlign,styles.textsection1]}>{t("MoreText1")}</Text>
          {<>    
          <Button
              title={t('Sign in')}
              styleTitle={styles.buttonText}
              onPress={()=>navigation.navigate("Signin")}
              style={styles.button}
              />
              <View style={styles.seprator}/></>}
              <Pressable style={[layout.rowBox,styles.tapCon,(SignInActive?.status==0||isLogin)&&{marginTop:PixelPerfect(16)}]}
               onPress={()=>navigation.navigate("ContactUs")}
              >
                <ContactUsIcon/>
                <Text style={[layout.textAlign,styles.tapText]}>{t("Contact us")}</Text>
              </Pressable>
              {/* <Pressable style={[layout.rowBox,styles.tapCon]}>
                <ShareMoreIcon/>
                <Text style={[layout.textAlign,styles.tapText]}>{t("Shar")}</Text>
              </Pressable> */}
            </View>
        </Container>
    )
}

export default MoreComponnent

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        body:{
            flex:1,
            paddingHorizontal:PixelPerfect(16),
            paddingVertical:PixelPerfect(16)
        },
        textsection1:{
            fontFamily:Fonts.bold,
            color:theme.active,
            fontSize:PixelPerfect(18)
          },
          button:{
            alignItems:"center",
            justifyContent:"center",
            backgroundColor:theme.textColor,
            marginTop:PixelPerfect(8)
          },
          buttonText:{
            fontFamily:Fonts.bold,
            fontSize:PixelPerfect(20),
            color:Colors.white
          },
          seprator:{
            height:PixelPerfect(2),
            backgroundColor:theme.separator,
            marginBottom:PixelPerfect(16)
          },
          tapCon:{
            alignItems:"center",
            height:PixelPerfect(24),
            marginBottom:PixelPerfect(16)
          },
          tapText:{
            fontFamily:Fonts.regular,
            fontSize:PixelPerfect(16),
            color:theme.black,
            paddingHorizontal:PixelPerfect(8)
          }
    })