import { GrayRate, RateIcone, RateIcone1 } from "../Assets/Svg";

import { useContext } from "react";
import { ThemeContext } from "../Constants/theming";
import { Platform, StyleSheet, Text, View } from "react-native";
import { IFont, ITheme } from "../Constants/interfaces";
import { PixelPerfect } from "../Constants/styleConstants";

type Props = {
      rating: number; rateCount: number
}

const Stars = ({ rating, rateCount }: Props) => {
      const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
      const styles = useStyles(Fonts, theme, dark, dir);

      return (
            <View style={[layout.rowBox, { alignItems: "center" }]}>
                  {/* {[...Array(Math.floor(rating))].map((_, index) => (
                        <RateIcone key={index} />
                  ))} */}

            
                        {[...Array(5)].map((_, i) => {
                              if (i + 1 <= Math.floor(Math.floor(rating))) {
                                    // ⭐ نجمة كاملة
                                    return (
                                          <RateIcone
                                                key={i}
                                                width={PixelPerfect(20)}
                                                height={PixelPerfect(20)}
                                          />
                                    );
                              }
                              // ☆ نجمة فاضية
                              return (
                                    <GrayRate
                                          key={i}
                                          width={PixelPerfect(20)}
                                          height={PixelPerfect(20)}
                                    />
                              );
                        })}
             

                  <Text style={[layout.textAlign, styles.text]}>
                        {"(" + rateCount + ")"}
                  </Text>
            </View>
      )
}

export default Stars;

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
      StyleSheet.create({
            text: {
                  color: theme.currenctText,
                  fontSize: PixelPerfect(14),
                  fontFamily: Fonts.medium,
                  textAlign: "right",
                  marginHorizontal:PixelPerfect(4),
                  marginTop: Platform.OS == "ios" ? 3 : 0
            },
      })