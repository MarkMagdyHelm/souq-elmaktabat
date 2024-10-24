import { Keyboard, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Container, Content } from '../../../Components/containers/Containers'
import { Colors, PixelPerfect, phoneHeight } from '../../../Constants/styleConstants'
import { ThemeContext } from '../../../Constants/theming'
import { IFont, ITheme } from '../../../Constants/interfaces'
import { t } from 'i18next'
import Inputs from '../../../Components/inputs/index'
import Button from '../../../Components/touchables/Button';
import {useKeyboard} from '../../../Constants/UseKayboard'
import { AppleIcon, ArrowDownIcon, FacebookIcon, GoogleIcon } from '../../../Assets/Svg'
import DropDowenMenu from '../../../Components/DropDowenMenus/DropDowenMenu'
import Loader from '../../../Components/PopUps/Loader'
import { useDispatch } from 'react-redux'
import { useToast } from 'react-native-toast-notifications'
import { GetCitiesHandler } from '../../../Apis/Appinfo'
import { Formik } from 'formik'
import { validationSchema } from '../../../Validation/Signup'
import { roles } from '../../../Helper'
import axios from 'axios'
import { mainUrl } from '../../../Constants/config'
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
  const [state, setstate] = useState({
    showGovernemnts:false,
    forms: { City: "", Role: "" },
    selectedGoverenmet: { name:"",arName: "", id: "" },
    goverements:[],
    loading:false,
    selectedRole: { name:"",arName: "", id: "" }as any,
    roles:roles,
    showRols:false,
    loadingSignin:false
  });
  const dispatch = useDispatch();
  useEffect(() => {
  getCites();
  }, [])
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
  const getCites = ()=>{
    setstate(old=>({...old,loading:true}))
   dispatch<any>(GetCitiesHandler((res,status)=>{
     if (res.status == 200) {
      setstate(old=>({...old,goverements:res.data}))
      
     }else{
      toastNotfication({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
     }
     setstate(old=>({...old,loading:false}))
   }))
  };
  const signUp = async(body:any)=>{
    setstate(old => ({
      ...old, loadingSignin:false
    }));
    try {
      const bodyFormData = new FormData();
      bodyFormData.append('Name', body.Name);
      bodyFormData.append('Address', body.Address);
      bodyFormData.append('Email', body.Email);
      bodyFormData.append('Password', body.Password);
      bodyFormData.append('PhoneNumber', body.PhoneNumber);
      bodyFormData.append('City', body.City);
      bodyFormData.append('Role', body.Role);
      
      axios.post(mainUrl+"api/User/SignUp", bodyFormData, {
        headers: {
          Accept: 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
    'Access-Control-Allow-Headers':
      'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
    'Content-Type': 'multipart/form-data',
    'Accept-Language': dir == "rtl" ? 'ar' : 'en',
    // Authorization: `bearer ${userdata.Token}`,
        },
     
    }
).then((res:any) => {
    console.log(res.data);
    console.log(res.status);
    setstate(old => ({
      ...old, loadingSignin:false
    }));
    if (res.data.status == 200) {
      toastNotfication({type:'ok',message:res.data.message });  
      navigation.navigate("Signin");
    } else {
      toastNotfication({type:'error',message:res.data.message ??t("Something Went wrong") });  
    }
})
.catch((err:any) => {
    console.log(err);
    setstate(old => ({
      ...old, loadingSignin:false
    }));
    toastNotfication({type:'error',message:t("Something Went wrong") });  
});
    } catch (error) {
      
    }
  }
  return (
    <Container showHint={false}>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          Name:"",
          Address:"",
          Email:"",
          Password:"",
          ConfirmPassword:"",
          PhoneNumber:"",
          City:"",
          Role:"",
          }}
        onSubmit={(values)=>{
          
          signUp(values)}} >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue,setFieldTouched }) => {
          console.log('====================================');
          console.log(errors);
          console.log('====================================');
          return (
            <>
      {state.loading&&<Loader/>}
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
                      onBlur: handleBlur("Name"),
                      onChangeText: handleChange("Name"),
                      placeholder:t("fullnamew"),
                      maxLength:100,
                      keyboardType: 'default',
                    }}
                    password={false}
                    showErrorr={(errors.Name && touched.Name) as boolean }
                    error={errors.Name as any}
              />
                <Inputs label={t('Email')}
                    options={{
                      onBlur: handleBlur("Email"),
                      onChangeText: handleChange("Email"),
                      placeholder:t("Emailw"),
                      maxLength:30,
                      keyboardType: 'email-address',
                    }}
                    password={false}
                    showErrorr={(errors.Email && touched.Email) as boolean }
                    error={errors.Email as any}
              />
              <Inputs label={t('Phone')}
                    options={{
                      onBlur: handleBlur("PhoneNumber"),
                      onChangeText: handleChange("PhoneNumber"),
                      placeholder:t("Phonew"),
                      maxLength:11,
                      keyboardType: Platform.OS === 'android' ? "numeric" : "number-pad",
                    }}
                    password={false}
                    isPhone={true}
                    input={{width:"75%"}}
                    showErrorr={(errors.PhoneNumber && touched.PhoneNumber) as boolean }
                    error={errors.PhoneNumber as any}
              />
              <Pressable style={styles.selectMenueCon} onPress={()=>{ setstate(old => ({...old, showRols: true}));}}>
                <Text style={[layout.textAlign,styles.label]}>{t("AccountType")}</Text>
                <View style={[layout.rowBox,styles.selectMenue]}>
                <Text style={styles.textselectmenu}>{typeof state.selectedRole.id !="string"?
                (dir=="rtl"? state.selectedRole.arName:state.selectedRole.name):t("AccountTypew")}</Text>
                <ArrowDownIcon/>
                </View>
                {state.forms.Role.length !=0&& <Text style={styles.errorText}>{t(state.forms.Role)}</Text>}
              </Pressable>
             {state.selectedRole.id==9&&<Inputs label={t('')}
                    options={{
                      onBlur: handleBlur("Name"),
                      onChangeText: handleChange("Name"),
                      placeholder:t(""),
                      maxLength:100,
                      keyboardType: 'default',
                    }}
                    
                    password={false}
                    showErrorr={(errors.Name && touched.Name) as boolean }
                    error={errors.Name as any}
              />}
              <Pressable style={styles.selectMenueCon} onPress={()=>{ setstate(old => ({...old, showGovernemnts: true}));}}>
                <Text style={[layout.textAlign,styles.label]}>{t('Government')}</Text>
                <View style={[layout.rowBox,styles.selectMenue]}>
                <Text style={styles.textselectmenu}>{typeof state.selectedGoverenmet.id !="string"?
                (dir=="rtl"? state.selectedGoverenmet.arName:state.selectedGoverenmet.name):t("Governmentw")}</Text>
                <ArrowDownIcon/>
                </View>
                {state.forms.City.length !=0&& <Text style={styles.errorText}>{t(state.forms.City)}</Text>}
              </Pressable>
                <Inputs label={t('adress')}
                    options={{
                      onBlur: handleBlur("Address"),
                      onChangeText: handleChange("Address"),
                      numberOfLines:2,
                      placeholder:t("adressw"),
                      maxLength:250,
                      keyboardType: 'default',
                      multiline:true,
                    }}
                     inputCon={{height:PixelPerfect(74),paddingTop:PixelPerfect(17)}}
                     input={{height:PixelPerfect(74),verticalAlign:"top"}}
                    password={false}
                    showErrorr={(errors.Address && touched.Address) as boolean }
                    error={errors.Address as any}
              />
 <Inputs label={t('pasword')}
                    options={{
                      onBlur: handleBlur("Password"),
                      onChangeText: handleChange("Password"),
                      placeholder:t("paswordw"),
                      keyboardType: 'default',
                      maxLength:30,
                    }}
                    password={true}
                    showErrorr={(errors.Password && touched.Password) as boolean }
                    error={errors.Password as any}
              />
               <Inputs label={t('confirmpasword')}
                    options={{
                      onBlur: handleBlur("ConfirmPassword"),
                      onChangeText: handleChange("ConfirmPassword"),
                      placeholder:t("confirmpaswordw"),
                      keyboardType: 'default',
                      maxLength:30,
                    }}
                    password={true}
                    showErrorr={(errors.ConfirmPassword && touched.ConfirmPassword) as boolean }
                    error={errors.ConfirmPassword as any}
              />
                  <View style={{backgroundColor:theme.mainColor}}>
               <Button
              title={t('Sign in')}
              loader={state.loadingSignin}
              styleTitle={styles.buttonText}
              onPress={()=>{
                handleSubmit();
                if (
                  state.forms.City.length == 0 ||
                  state.forms.Role.length == 0
                  ) {    
                  setstate(old=>({...old,forms:{
                      Role:state.selectedGoverenmet.id.length == 0?"You must pick a role!":"",
                      City:state.selectedGoverenmet.id.length == 0?"You must pick a city!":""
                   }}));
              }
              }}
              style={styles.button}
              />
               </View>
               <Pressable style={styles.signUpCon} onPress={()=>{navigation.navigate("Signin")}}>
                <Text style={styles.signUpText}>{t("Don't have account")}
                <Text style={[styles.signUpText1]}>  {t("Sign up")}</Text>
                </Text>
                </Pressable>
          </View>
        </Content>
        { state.showGovernemnts&& <DropDowenMenu 
          onCloseFn={(val) => {
          console.log('================val====================');
          console.log(val);
          console.log('====================================');
            if (typeof val?.id == 'string') {
              setstate(old => ({
                ...old, showGovernemnts: false, forms: {
                  ...state.forms, City: "You must pick a city!"
                }
              }));
            } else {
              setFieldValue("City",val.id);
              setstate(old => ({
                ...old, showGovernemnts: false, selectedGoverenmet: val, forms: {
                  ...state.forms, City: ""
                }
              }));
            }
            
          }}
          title={t('Choose City')}
          currentFilter={state.selectedGoverenmet}
          items={state.goverements}
          style={{ flex:0.7,}}
        />}
            { state.showRols&& <DropDowenMenu 
          onCloseFn={(val) => {
          console.log('====================================');
          console.log(val);
          console.log('====================================');
            if (typeof val?.id == 'string') {
              setstate(old => ({
                ...old, showRols: false, forms: {
                  ...state.forms, Role: "You must pick a role!"
                }
              }));
            } else {
              setFieldValue("Role",val.id);
              setstate(old => ({
                ...old, showRols: false, selectedRole: val, forms: {
                  ...state.forms, Role: ""
                }
              }));
            }
            
          }}
          title={t('Choose Account Type')}
          currentFilter={state.selectedRole}
          items={state.roles}
          style={{ flex:0.3,}}
        />}
            </>
            )
          }}
          
        </Formik>
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
      fontSize:PixelPerfect(22),
      lineHeight:30
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
  },
  errorText:{
    fontFamily:Fonts.regular,
    fontSize:PixelPerfect(14),
    color:theme.red_yellow,
    textAlign:dir==="rtl"?"right":"left",
    marginBottom:PixelPerfect(10),
    paddingHorizontal:PixelPerfect(10)
}
  })