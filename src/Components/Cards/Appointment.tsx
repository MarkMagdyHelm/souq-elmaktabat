import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ColorWithOpacity, Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants';

type Props = {
    item
}

const Appointment = (props: Props) => {
    const {
        item
    } = props;
    console.log('====================================');
    console.log(item);
    console.log('====================================');
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    return (
        <View style={[layout.rowBox, styles.con, { backgroundColor: item?.flag ? theme.appointment : theme.mainColor, }]}>
            <View style={styles.DateCon}>
                <Text style={styles.dateText1}>Friday</Text>
                <Text style={styles.dateText1}>13-9</Text>
            </View>
            <View style={styles.DetailsCon}>
                <View>
                <Text style={styles.detailsText1}>12:30 PM</Text>
                <Text style={styles.detailsText2}>Dr. Marwa ahmed</Text>
                </View>
                <Text style={styles.detailsText1}>Dental</Text>
            </View>
        </View>
    )
}

export default Appointment

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        con: {
            borderRadius: PixelPerfect(8),
            height: PixelPerfect(83),
            width: (phoneWidth - PixelPerfect(25)) / 1.5,
            alignItems: "center",
            marginBottom: PixelPerfect(8),
            paddingHorizontal: PixelPerfect(10)
        },
        DateCon:{
            borderRadius:PixelPerfect(8),
            width:PixelPerfect(63),
            height:PixelPerfect(62),
            backgroundColor:ColorWithOpacity(Colors.white,0.2),
            alignItems:"center",
            justifyContent:"center"
        },
        dateText1:{
            color: Colors.white,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.medium,
            marginBottom:PixelPerfect(5),
        },
        dateText2:{
            color: Colors.white,
            fontSize: PixelPerfect(12),
            fontFamily: Fonts.medium,
        },
        DetailsCon:{
            justifyContent:"space-between",
            paddingHorizontal:PixelPerfect(20),
            height:PixelPerfect(62),
        },
        detailsText1:{
            color: Colors.white,
            fontSize: PixelPerfect(12),
            fontFamily: Fonts.light,
        },
        detailsText2:{
            color: Colors.white,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.bold,
            marginTop:PixelPerfect(5)
        }
    });