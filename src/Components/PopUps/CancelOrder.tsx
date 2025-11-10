import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Alert,
    Image,
    Modal
} from 'react-native';

import { EyeIcon, StareIcon } from '../../Assets/Svg';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ThemeContext } from '../../Constants/theming';
import { PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';

const CancelOrder = ({ visible, onClose, onSubmit }) => {

    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
  

    return (

        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>

                <View style={styles.container}>

                    {/* Header */}
                    <View style={[layout.rowBox, styles.header]}>
                        <Text style={styles.title}>{t("cancelOrder")}</Text>
                        <TouchableOpacity onPress={() => { onClose()}}>
                            <Text style={styles.close}>✕</Text>
                        </TouchableOpacity>
                    </View>


                    {/* Seller Name */}
                    <Text style={styles.closeTitle}>{t("confirmCancelOrder")}</Text>

                    <View style={[layout.dirRow, styles.actions]}>

                        <TouchableOpacity style={[layout.rowBox, styles.cancelBtn]} onPress={() => { onSubmit()}}>

                            <Text style={styles.cancelText}>{t("yesCancelOrder")}</Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={[layout.rowBox, styles.backBtn]} onPress={() => { onClose()}}>

                            <Text style={styles.backText}>{t("noGoBack")}</Text>

                        </TouchableOpacity>
                    </View>


                </View>


            </View>


        </Modal >

    );
};

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: "center",
            alignItems: 'center',
             paddingHorizontal: PixelPerfect(32)

        },
        container: {
            backgroundColor: theme.white,
            width: '100%',
            borderRadius: PixelPerfect(12),

            padding: PixelPerfect(16)
        },

        actions: { marginTop: PixelPerfect(8), paddingVertical: PixelPerfect(16) },
        cancelBtn: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme.red,
            borderRadius: PixelPerfect(6),
            height: PixelPerfect(40),
            alignItems: "center",
            justifyContent: "center",
            marginStart: PixelPerfect(8)
        },
        backBtn: {
            flex: 1,
            backgroundColor: theme.deactive,
            borderRadius: PixelPerfect(6),
            height: PixelPerfect(40),
            marginEnd: PixelPerfect(8),
            alignItems: "center",
            justifyContent: "center"
        },
        cancelText: {
            fontSize: PixelPerfect(16),
            fontFamily: Fonts.medium,
            color: theme.red
        },

        backText: {
            fontSize: PixelPerfect(16),
            fontFamily: Fonts.bold,
            color: theme.white
        },
        header: {
            paddingVertical: PixelPerfect(8),
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        title: { textAlign: 'center', flex: 1, fontSize: PixelPerfect(16), fontFamily: Fonts.bold, color: theme.red },
        close: { fontSize: PixelPerfect(24), color: theme.deactive },
        closeTitle: { textAlign: 'center', fontSize: PixelPerfect(16), fontFamily: Fonts.regular, color: theme.black, paddingHorizontal: PixelPerfect(4) },
     
    });

export default CancelOrder;