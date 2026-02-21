import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ColorWithOpacity, Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GrayRate, HeartIcon, RateIcone } from '../../Assets/Svg';
import { t } from 'i18next';
import Stars from '../../Helper/Stars';
import { imageUrl } from '../../Constants/config';

type Props = {
      item: any, onPress: () => void,
      onFavPress: () => void,
      isOfffer: any
}

const SellerItem = (props: Props) => {
      const {
            item,
            isOfffer,
            onPress,
            onFavPress
      } = props;
      const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
      const styles = useStyles(Fonts, theme, dark, dir);
   
   
      return (
            <Pressable
                
            >
                  <View style={[styles.con]}>
                        {!isOfffer && <Pressable style={{ padding: 8 }} onPress={onFavPress}>
                              <HeartIcon style={styles.heart}
                                    color={item.isFavourite ?   theme.red:theme.white}
                              />
                        </Pressable>
                        }

                        <View style={[layout.rowBox]}>      
                              <Image
                                    source={{ uri: imageUrl+(item.userImages??item.imageURL) }}
                                    style={[styles.imageRound]}
                              />
                              <View style={{ marginHorizontal: PixelPerfect(4) }}>
                                    <Text style={[layout.textAlign, styles.seller]}>{(item.userName??item.name)}</Text>
                                    <Text style={[styles.text2]}>{(item.countryName??item.companyName)}</Text>
                              </View>
                        </View>
                        <View style={[layout.rowBox, { marginTop: PixelPerfect(4) }]}>
                              <Stars rating={(item.userRateAverage??item.rate)} rateCount={(item.userRateCount??item.rateCount)} />
                        </View>

                        <Text style={[layout.textAlign, styles.text]} 
                        numberOfLines={1}
                         ellipsizeMode="tail">{item.description}</Text>

                        <Text style={[layout.textAlign, styles.orderNum]}>{t("product_number") + (item.min??item?.offersCount)}</Text>

                        <TouchableOpacity   onPress={onPress}
                              style={[styles.con1]} >
                              <Text style={[styles.text3]}>{t("viewDetails")}</Text>
                        </TouchableOpacity>
                  </View>
            </Pressable>
      )
}

export default SellerItem

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
      StyleSheet.create({

            con: {
                  width:(phoneWidth- PixelPerfect(32+30))/2,
                  minHeight: PixelPerfect(220),
                  backgroundColor: theme.white,
                  borderRadius: PixelPerfect(12),
                  padding: PixelPerfect(12),
                  marginHorizontal: PixelPerfect(6),
                  marginVertical: PixelPerfect(2),
                  shadowColor: theme.black,
                  shadowOpacity: PixelPerfect(0.05),
                  shadowRadius: PixelPerfect(8),
                  elevation: PixelPerfect(2),
            },

            con1: {
                  height: PixelPerfect(36),
                  backgroundColor: theme.active,
                  paddingHorizontal: PixelPerfect(10),
                  borderRadius: PixelPerfect(4),
                  marginTop: PixelPerfect(10),
                  justifyContent: "center",
                  alignItems: "center",

            },




            imageRound: {
                  height: PixelPerfect(24),
                  width: PixelPerfect(24),
                  borderRadius: PixelPerfect(12),
                  marginRight: PixelPerfect(4),
            },
            text: {
                  lineHeight: PixelPerfect(18),
                  color: theme.black,
                  fontSize: PixelPerfect(14),
                  fontFamily: Fonts.extraLight,
                  marginTop: PixelPerfect(4)
            },
            seller: {
                  color: theme.black,
                  fontSize: PixelPerfect(16),
                  fontFamily: Fonts.medium,
                  lineHeight: PixelPerfect(20)
            },

            orderNum: {
                  lineHeight: PixelPerfect(20),
                  color: theme.textColor,
                  fontSize: PixelPerfect(14),
                  fontFamily: Fonts.medium
            },

            text2: {
                  lineHeight: PixelPerfect(20),
                  color: theme.black,
                  fontSize: PixelPerfect(12),
                  fontFamily: Fonts.extraLight,
            },
            text3: {
                  color: theme.white,
                  fontSize: PixelPerfect(14),
                  lineHeight: PixelPerfect(28),
                  fontFamily: Fonts.bold,
                  alignItems: "center",
                  alignContent: "center"
            },
            heart: {
                  position: 'absolute',
                  zIndex: 1,
                  color: theme.active
            },

            starsRow: {

                  gap: PixelPerfect(1),
            },
            countText: {
                  marginEnd: PixelPerfect(8),
                  fontSize: PixelPerfect(12),
                  color: theme.orange,
                  fontFamily: Fonts.regular,


            },
      });