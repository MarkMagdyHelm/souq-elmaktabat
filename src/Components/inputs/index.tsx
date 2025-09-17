import { Platform, Pressable, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle, } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import { EyeIcon, EyeOpenIcon, FlagIcon, SmallArrowDownIcon } from '../../Assets/Svg';
import { t } from 'i18next';

type Props = {
    label?: string,
    password:boolean,
    options?: TextInputProps & { ref?: (ref: any) => void },
    inputCon?:ViewStyle,
    input?:TextStyle,
    isPhone?:boolean,
    showErrorr?:boolean,
    error?:any
}

export default function Index(props: Props) {
    const {
        label,
        password,
        options,
        inputCon,
        input,
        isPhone,
        showErrorr,
        error,
    } = props;
    const [state, setstate] = useState({
        showPassword:false
    });
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const onPress=()=>{
        if (state.showPassword) {
            setstate(old=>({...old,showPassword:false}));
        } else {
            setstate(old=>({...old,showPassword:true}));
        }
    }

    return (
        <>
            <Text style={[layout.textAlign,styles.label]}>{label}</Text>
        <View style={[layout.rowBox,styles.inputContainner,inputCon]}>
            {isPhone&&
            <View style={[layout.rowBox,styles.phoneCon]}>
               <FlagIcon/>
               <Text style={styles.phonecodetext}>{"+02"}</Text>
               <SmallArrowDownIcon/>
            </View>
            }
            <TextInput
          selectionColor={Colors.secondColor}
          style={[ styles.textInputContainer,input ]}
          placeholderTextColor={theme.inputTextColor}
       
          secureTextEntry={password && !state.showPassword ? true : false}
          textContentType={'none'}
          {...options}
        />
        {password&&<Pressable style={styles.eyecon}
        onPress={onPress}
        >
            {state.showPassword?<EyeOpenIcon/>:<EyeIcon/>}
        </Pressable>}
        </View>
        {showErrorr&& <Text style={styles.errorText}>{t(error)}</Text>}
        </>
    )
}

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        inputContainner:{
            
            backgroundColor:Colors.white,
            height:PixelPerfect(50),
            alignItems:"center",
            borderRadius:PixelPerfect(8),
            paddingHorizontal:PixelPerfect(10),
            marginBottom:PixelPerfect(20),
            borderWidth:PixelPerfect(1),
            borderColor:theme.optionText
        },
        label:{
            fontFamily:Fonts.medium,
            fontSize:PixelPerfect(18),
            color:theme.black,
            marginBottom:PixelPerfect(10)
        },
        textInputContainer:{
        width:"95%",
        height:PixelPerfect(49),
        fontFamily:Fonts.medium,
        fontSize:PixelPerfect(16),
        color:theme.deactive,
        textAlign:dir==="rtl"?"right":"left",
        },
        eyecon:{
            alignItems:"center",
            justifyContent:"center",
            width:"5%",
        },
        phoneCon:{
            alignItems:"center",
            justifyContent:"space-between",
            height:PixelPerfect(50),
           borderLeftWidth:1,
           paddingRight:PixelPerfect(8),
           marginRight:PixelPerfect(8),
           borderLeftColor:theme.optionText,
           width:"27%"
        },
        phonecodetext:{
            marginTop:5,
            fontFamily:Fonts.medium,
            fontSize:PixelPerfect(16),
            color:theme.deactive,
            paddingHorizontal:PixelPerfect(5)
        },
        errorText:{
            fontFamily:Fonts.regular,
    fontSize:PixelPerfect(14),
    color:theme.red_yellow,
    textAlign:dir==="rtl"?"right":"left",
    marginBottom:PixelPerfect(10),
    paddingHorizontal:PixelPerfect(10)
        }
    });