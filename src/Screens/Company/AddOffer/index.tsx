import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext,  useState } from 'react';
import { IFont, ITheme } from '../../../Constants/interfaces';
import { ThemeContext } from '../../../Constants/theming';
import { Colors, PixelPerfect } from '../../../Constants/styleConstants';
import { t } from 'i18next';
import { Container, Content } from '../../../Components/containers/Containers';
import Inputs from '../../../Components/inputs';
import Button from '../../../Components/touchables/Button';
import {  useDispatch } from 'react-redux';
import useToastNotification from '../../../Components/CustomHooks/useToastNotification';
import HeaderWithText from '../../../Components/Headers/HeaderWithText';
import { Formik } from 'formik';
import { validationSchema } from '../../../Validation/Signup';
import {  useRoute } from '@react-navigation/native';
import { ForgetPasswordHandler } from '../../../Apis/User';
import { AddOfferICon } from '../../../Assets/Svg';

type Props = {
    navigation: any
};

const Index = (props: Props) => {
    const { navigation } = props;
    //   const {  } = useRoute().params as any;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);


    const styles = useStyles(Fonts, theme, dark, dir);
    const [state, setstate] = useState({
        showRols: false,
        loading: false
    });
    const dispatch = useDispatch();
    const showToast = useToastNotification();

const handleSubmit = (values)=>{
    setstate(old=>({...old,loading:true}))

}
    return (
        <Container showHint={false}>
            <HeaderWithText title={t("addoffer1")} />
            <View style={styles.con}>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                       
                    }}
                    onSubmit={handleSubmit} >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => {
                       
                        return (
                            <>
                             
                            </>
                        )
                    }}

                </Formik>
                
            </View>
        </Container>
    );
};

export default Index;

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string) =>
    StyleSheet.create({
        con: {
            flex: 0.9,
            paddingHorizontal: PixelPerfect(16)
        },
        conhit1: {
        marginTop: PixelPerfect(27),
        },
        txthit1: {
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(16),
            color: theme.black,
        },
        body: {
            marginTop: PixelPerfect(30),
            flex:0.9
        },
        button: {
            backgroundColor: Colors.secondColor,
            height: PixelPerfect(50),
            alignItems: "center",
            justifyContent: "center",
            marginTop: PixelPerfect(16)
        },
        buttonText: {
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(18),
            color: theme.mainColor,
        },
        signUpCon: {
            backgroundColor: theme.mainColor,
            paddingTop: PixelPerfect(16),
            alignItems: "center",
            justifyContent: "center",
            marginBottom: PixelPerfect(50)
        },
        signUpText: {
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(14),
            color: theme.deactive,
        },
        signUpText1: {
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(16),
            color: Colors.secondColor,
        },
    });