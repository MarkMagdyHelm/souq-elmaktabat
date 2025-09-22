import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, phoneWidth, PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { AddressIcon, NotificationIcon } from '../../Assets/Svg'
import moment from 'moment'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

type Props = {
    item?: any,
    onPress: () => void,
    loading: boolean
}

const SellerBranches = (props: Props) => {
    const {
        item,
        onPress,
        loading
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    console.log('====================================');
    console.log(item);
    console.log('====================================');
    return (
        <View style={[styles.con]}>
            <View style={[layout.rowBox, styles.bodyCon]}>
                <View style={styles.iconCon}>
                    <AddressIcon color={Colors.white} />
                </View>

                {loading ?
                    <SkeletonPlaceholder backgroundColor={Colors.secondColor}>
                        <SkeletonPlaceholder.Item alignSelf='flex-end' height={PixelPerfect(20)}
                            width={250}></SkeletonPlaceholder.Item></SkeletonPlaceholder>
                    : <Text style={[layout.textAlign, styles.textTitle]}>{"القاهرة / مصر الجديدة"}</Text>}
            </View>
            {loading ?
                <SkeletonPlaceholder backgroundColor={Colors.secondColor}>
                    <SkeletonPlaceholder.Item alignSelf='flex-end' height={PixelPerfect(20)}
                        width={250}></SkeletonPlaceholder.Item></SkeletonPlaceholder>
                : <Text style={[layout.textAlign, styles.textBody]}>{"٢١ش الخليفة المأمون مصر الجديده امام سوق العصر اعلى راديو شاك"}</Text>}

        </View>
    )
}

export default SellerBranches

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        con: {
            paddingVertical: PixelPerfect(4)
        },

        iconCon: {
            width: PixelPerfect(24),
            height: PixelPerfect(24),

            alignItems: "center",
            justifyContent: "center"
        },
        bodyCon: {
            alignContent: "center", alignItems: "center"

        },


        textTitle: {
            fontFamily: Fonts.regular,
            color: theme.black,
            fontSize: PixelPerfect(16),
            marginHorizontal: PixelPerfect(5)
        },
          textBody: {
            fontFamily: Fonts.extraLight,
            color: theme.black,
            fontSize: PixelPerfect(14),
            marginVertical:PixelPerfect(8)
        }
    });