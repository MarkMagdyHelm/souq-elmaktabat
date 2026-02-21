import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import { AddressIcon, Call2Icon, CancelIcon, EditIcon } from '../../Assets/Svg';
import { t } from 'i18next';
import Stars from '../../Helper/Stars';
import SellerBranches from './SellerBranches';
type Props = {
    item: any, onDetailsClick: any,onDeleteClick:any
}




const BranchsItem = (props: Props) => {
    const {
        item, onDetailsClick,onDeleteClick
    } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir, item.status);

    return (
        <View style={styles.card}>

            <TouchableOpacity onPress={()=>onDetailsClick()}>
                <View style={[styles.con]}>
                    <View style={[layout.rowBox, styles.bodyCon]}>
                        <View style={styles.iconCon}>
                            <AddressIcon color={Colors.white} />
                        </View>
                        <Text style={[layout.textAlign, styles.textTitle]}>
                            {item?.countryName + "/" + item?.regionName}</Text>
                    </View>
                    <Text style={[layout.textAlign, styles.textBody]}>{item?.branchName}</Text>
                </View>

                <View style ={[layout.rowBox,{ gap: 10 }]}>
                       <TouchableOpacity style={[layout.rowBox, styles.editBtn]} onPress={() => 
                     onDetailsClick()   
                    } >
                        <View style={[styles.icon]}>
                            <EditIcon />
                        </View>
                        <Text style={[layout.textAlign, styles.editText]}>{t("edit")}</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={[layout.rowBox, styles.cancelBtn]} onPress={() => 
                     onDeleteClick()   
                    } >
                        <View style={[styles.icon]}>
                            <CancelIcon />
                        </View>
                        <Text style={[layout.textAlign, styles.cancelText]}>{t("delete")}</Text>

                    </TouchableOpacity>
                 
                </View>


            </TouchableOpacity>


        </View>
    )
}

export default BranchsItem

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string, status: any) =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.white,
            borderRadius: PixelPerfect(10),
            padding: PixelPerfect(12),
            marginVertical: PixelPerfect(8),
            borderWidth: PixelPerfect(1),
            borderColor: theme.grayLigth,
        },
        con: { paddingVertical: PixelPerfect(4) },
        iconCon: {
            width: PixelPerfect(24),
            height: PixelPerfect(24), alignItems: "center", justifyContent: "center"
        },
        bodyCon: { alignContent: "center", alignItems: "center" },
        textTitle: { lineHeight: PixelPerfect(25), fontFamily: Fonts.medium, color: theme.textColor, fontSize: PixelPerfect(16), marginHorizontal: PixelPerfect(5) },
        textBody: { lineHeight: PixelPerfect(25), fontFamily: Fonts.regular, color: theme.black, fontSize: PixelPerfect(14), marginVertical: PixelPerfect(4) },
      

        cancelBtn: {
            flex: 1,
            height: PixelPerfect(50),
            borderWidth: 1,
            borderColor: theme.red,
            borderRadius: PixelPerfect(6),
            paddingVertical: PixelPerfect(10),
            alignItems: "center",
            justifyContent: "center"
        },
    
        cancelText: {
            lineHeight: PixelPerfect(25),
            fontSize: PixelPerfect(16),
            fontFamily: Fonts.bold,
            color: theme.red
        },
        editBtn: {
            flex: 1,
            height: PixelPerfect(50),
            backgroundColor:theme.babyBlue,
            borderRadius: PixelPerfect(6),
            paddingVertical: PixelPerfect(10),
            alignItems: "center",
            justifyContent: "center"
        },
        editText: {
            lineHeight: PixelPerfect(25),
            fontSize: PixelPerfect(16),
            fontFamily: Fonts.bold,
            color: theme.white
        },
        icon: {
            paddingHorizontal: PixelPerfect(2)
        },

    });