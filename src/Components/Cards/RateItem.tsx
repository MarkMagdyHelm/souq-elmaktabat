import { useContext } from "react";
import { ThemeContext } from "../../Constants/theming";
import { IFont, ITheme } from "../../Constants/interfaces";
import { StyleSheet, Text, View } from "react-native";
import { PixelPerfect } from "../../Constants/styleConstants";
import { GrayRate, RateIcone } from "../../Assets/Svg";
import Space from "../../Helper/Space";
import { timeAgo } from "../../Helper";
import Stars from "../../Helper/Stars";

type Props = { item?: any, onPress: () => void }


const RateItem = (props: Props) => {
  const { item, onPress } = props
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);

  return (
    <>
      {/* Review items */}

      <View key={item} style={styles.reviewCard}>

        <View style={[layout.dirRow, { justifyContent: "space-between" }]}>
          <Text style={[layout.textAlign, styles.dateText]}>{timeAgo(item?.creationDate)}</Text>
          <Text style={[layout.textAlign, styles.nameText]}>{item?.fromUserName}</Text>
        </View>


        <View style={[layout.rowBox, styles.starsRow]}>
        <Stars rating={item?.number} rateCount={item?.userRateCount??item.number} />
        </View>

        <Text style={[layout.textAlign, styles.reviewText]}>
          {item?.description}
        </Text>
      </View>



    </>
  )
}

export default RateItem

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string) =>
  StyleSheet.create({

    reviewCard: {
      paddingVertical: PixelPerfect(8),
      paddingHorizontal: PixelPerfect(16),
      borderRadius: PixelPerfect(10),

    },
    dateText: {
      lineHeight: PixelPerfect(20),
      fontSize: PixelPerfect(14),
      color: theme.black,
      fontFamily: Fonts.extraLight
    },
    starsRow: {
      marginTop: PixelPerfect(4),
    },

    nameText: {
      lineHeight: PixelPerfect(20),
      fontSize: PixelPerfect(16),
      color: theme.black,
      fontFamily: Fonts.medium
    },
    reviewText: {
      marginTop: PixelPerfect(6),
      lineHeight: PixelPerfect(20),
      fontSize: PixelPerfect(16),
      color: theme.black,
      fontFamily: Fonts.extraLight
    },
  })
