import { RateIcone, RateIcone1 } from "../Assets/Svg";

import { useContext } from "react";
import { ThemeContext } from "../Constants/theming";
import { Platform, StyleSheet, Text, View } from "react-native";
import { IFont, ITheme } from "../Constants/interfaces";
import { PixelPerfect } from "../Constants/styleConstants";

type Props = {
      rating: number;
}

const Stars = ({rating}: Props) => {
      const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
      const styles = useStyles(Fonts, theme, dark, dir);

      return (
            <View style={[layout.rowBox, { alignItems: "center" }]}>
                  {[...Array(Math.floor(rating))].map((_, index) => (
                        <RateIcone key={index} />
                  ))}
                  <Text style={[layout.textAlign, styles.text]}>
                        {"(" + rating + ")"}
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
                  marginTop: Platform.OS == "ios" ? 3 : 0
              },
      })