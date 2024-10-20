import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
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
import { Formik } from 'formik'
import { validationSchema } from '../../Validation/contacus'
import { useToast } from 'react-native-toast-notifications'
import { useDispatch } from 'react-redux'
import { ContactUsHandler } from '../../Apis/Appinfo'

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
    const dispatch = useDispatch();
      const toast = useToast();
      const toastNotfication = (config:any) => {
          toast.hideAll();
          toast.show(config.message, {
              type: config.type,
              duration: 3000,
              offset: 50,
              animationType: 'slide-in',
              placement: 'top',
          } as any);
      }
      const contactus = (body:any)=>{
        setstate(old=>({...old,loading:true}))
       dispatch<any>(ContactUsHandler(body,{},(res,status)=>{
         if (res.status == 200) {
          toastNotfication({ type: 'ok', message: res?.Message ?? t("Message sent successfully") });
         }else{
          toastNotfication({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
         }
         setstate(old=>({...old,loading:false}))
       }))
      };
    return (
        <Container showHint={false}
            fullBackground
        >
            <HeaderWithText
                title={t("contactus")}
            />
             <Formik
        validationSchema={validationSchema}
        initialValues={{
          name:"",
          email:"",
          message:"",
          }}
        onSubmit={(values)=>{
          contactus(values);
         }} >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue,setFieldTouched }) => {
          console.log('====================================');
          console.log(errors);
          console.log('====================================');
          return (
            <>
            <Content style={styles.formCon} noPadding >
                <View style={styles.body}>

            <Inputs label={t('fullname')}
                    options={{
                      onBlur: handleBlur("name"),
                      onChangeText: handleChange("name"),
                      placeholder:t("fullnamew"),
                      maxLength:100,
                      keyboardType: 'default',
                    }}
                    password={false}
                    showErrorr={(errors.name && touched.name) as boolean }
                    error={errors.name as any}
              />
                <Inputs label={t('Email')}
                    options={{
                      onBlur: handleBlur("email"),
                      onChangeText: handleChange("email"),
                      placeholder:t("Emailw"),
                      maxLength:30,
                      keyboardType: 'email-address',
                    }}
                    password={false}
                    showErrorr={(errors.email && touched.email) as boolean }
                    error={errors.email as any}
              />
                <Inputs label={t('message')}

                    options={{
                      onBlur: handleBlur("message"),
                      onChangeText: handleChange("message"),
                      numberOfLines:5,
                      placeholder:t("messagew"),
                      maxLength:250,
                      keyboardType: 'default',
                      multiline:true,
                    }}
                     inputCon={{height:PixelPerfect(142),paddingTop:PixelPerfect(17)}}
                     input={{height:PixelPerfect(142),verticalAlign:"top"}}
                    password={false}
                    showErrorr={(errors.message && touched.message) as boolean }
                    error={errors.message as any}
              />
                <Button
              title={t('Send')}
              styleTitle={styles.buttonText}
              loader={state.loading}
              onPress={handleSubmit}
              style={styles.button}
              />
              <View style={{paddingTop:PixelPerfect(2)}}>
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
            </>
            )
          }}
          
        </Formik>
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
            backgroundColor:theme.white,
            paddingBottom:PixelPerfect(20)
        },
        button:{
            backgroundColor:Colors.secondColor,
            height:PixelPerfect(50),
            alignItems:"center",
            justifyContent:"center",
            marginTop:PixelPerfect(10)
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