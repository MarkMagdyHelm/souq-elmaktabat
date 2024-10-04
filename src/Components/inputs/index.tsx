import { Platform, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import { EyeIcon } from '../../Assets/Svg';

type Props = {
    label: string,
    password:boolean,
    options?: TextInputProps & { ref?: (ref: any) => void };
}

export default function Index(props: Props) {
    const {
        label,
        password,
        options
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
    console.log('====================================');
    console.log(Platform.OS,dir);
    console.log('====================================');
    return (
        <View style={[styles.inputContainner]}>
            <TextInput
          selectionColor={Colors.secondColor}
          style={[ styles.textInputContainer, ]}
          placeholderTextColor={theme.inputTextColor}
        placeholder={label}
          secureTextEntry={password && !state.showPassword ? true : false}
          textContentType={'none'}
          {...options}
        />
        {password&&<Pressable style={styles.eyecon}
        onPress={onPress}
        >
            <EyeIcon/>
        </Pressable>}
        </View>
    )
}

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        inputContainner:{
            flexDirection:"row",
            backgroundColor:Colors.white,
            height:PixelPerfect(46),
            alignItems:"center",
            borderRadius:PixelPerfect(8),
            paddingHorizontal:PixelPerfect(15),
            marginBottom:PixelPerfect(20)
        },
        label:{
            fontFamily:Fonts.medium,
            fontSize:PixelPerfect(16),
            color:theme.inputTextColor,
         
        },
        textInputContainer:{
        width:"95%",
        height:PixelPerfect(46),
        fontFamily:Fonts.medium,
        fontSize:PixelPerfect(16),
        color:theme.inputTextColor,
        textAlign:dir==="rtl"?"right":"left"
        },
        eyecon:{
            alignItems:"center",
            justifyContent:"center",
            width:"5%",
        }
    });