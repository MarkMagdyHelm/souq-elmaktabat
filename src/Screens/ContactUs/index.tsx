import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { Container, Content } from '../../Components/containers/Containers'
import TabBar from '../../Components/TabBar/index';
import HeaderWithText from '../../Components/Headers/HeaderWithText'
import Inputs from '../../Components/inputs/index'
import Button from '../../Components/touchables/Button'
import { FaceBookIcon, GmailIcon, PhoneIcon } from '../../Assets/Svg'

type Props = {
    navigation: any
}

const Index = (props: Props) => {
    const {
        navigation
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    return (
        <Container showHint={false}
            fullBackground
        >
            <HeaderWithText
                title={t("contactus")}
            />
            <Content style={styles.formCon} noPadding >
                <View style={styles.body}>

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
                <Inputs label={t('message')}

                    options={{
                      onBlur: ()=>{},
                      onChangeText: txt => {
                      },
                      numberOfLines:5,
                      placeholder:t("messagew"),
                      maxLength:250,
                      keyboardType: 'default',
                      multiline:true,
                    }}
                     inputCon={{height:PixelPerfect(142),paddingTop:PixelPerfect(17)}}
                     input={{height:PixelPerfect(142),verticalAlign:"top"}}
                    password={false}
              />
                <Button
              title={t('Send')}
              styleTitle={styles.buttonText}
              onPress={()=>{}}
              style={styles.button}
              />
              <View style={{paddingTop:PixelPerfect(32)}}>
                <Text style={[layout.textAlign,styles.lable]}>{t("message1")}</Text>
                <View style={[layout.rowBox,styles.infoCon]}>
                    <PhoneIcon/>
                    <Text style={styles.text}>01234567890</Text>
                </View>
                <View style={[layout.rowBox,styles.infoCon]}>
                    <GmailIcon/>
                    <Text style={styles.text}>souq el maktabat@gmail.com</Text>
                </View>
                <View style={[layout.rowBox,styles.infoCon]}>
                    <FaceBookIcon/>
                    <Text style={styles.text}>سوق المكتبات</Text>
                </View>
              </View>
                </View>
            </Content>
        </Container>
    )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        formCon: {
            flex: 0.9,
            backgroundColor: theme.mainColor,
            paddingVertical: PixelPerfect(20),
            paddingHorizontal: PixelPerfect(20)
        },
        body:{
            backgroundColor:theme.white
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
          infoCon:{
            alignItems:"center",
            marginBottom:PixelPerfect(18)
          },
          text:{
            fontFamily:Fonts.medium,
            fontSize:PixelPerfect(18),
            color:theme.black,
            paddingHorizontal:PixelPerfect(8)
          },
          lable:{
            fontFamily:Fonts.bold,
            fontSize:PixelPerfect(18),
            color:theme.textColor,
            marginBottom:PixelPerfect(17)
          }
    })