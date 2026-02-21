import { PixelPerfect } from "../Constants/styleConstants"
import { useContext } from "react";
import { ThemeContext } from "../Constants/theming";
import { View } from "react-native";

type Props = {
}

const Space = (props: Props) => {
      const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
      return (
            <View style={{
                  backgroundColor: theme.accordianBody, marginVertical: PixelPerfect(10),
                  height: PixelPerfect(15)
            }}>

            </View>
      )
}

export default Space;