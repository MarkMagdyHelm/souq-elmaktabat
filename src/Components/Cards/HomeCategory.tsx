import { Image,  Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext,  } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import { GetNamesByLang } from '../../Helper';

type Props = {
    item: any
}

const HomeCategory = (props: Props) => {
    const {
        item
    } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
 
    return (
        <Pressable   
            onPress={() =>{}}
        >
            <View
                style={[styles.con]}
            >
                <Image style={styles.image}

                    source={{ uri: item?.image, cache: 'reload' }}
                />
                <Text style={styles.text}>{GetNamesByLang(item,dir)}</Text>
            </View>
        </Pressable>
    )
}

export default HomeCategory

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({

 

        con: {
            borderRadius: PixelPerfect(10),
            height: PixelPerfect(86),
            width: PixelPerfect(96),
            alignItems: "center",
            backgroundColor: Colors.whiteGray,
            justifyContent: 'center',
        },

       

        image: {
            height: PixelPerfect(48),
            width: PixelPerfect(48),
            borderRadius: PixelPerfect(10),
            resizeMode: "contain"
        },
        text: {
            color: theme.black,
            fontSize: PixelPerfect(12),
            fontFamily: Fonts.medium,
        },


    });