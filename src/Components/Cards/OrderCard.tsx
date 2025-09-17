import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { PixelPerfect } from '../../Constants/styleConstants';
type Props = {
  item: any, onAccept: any, onReject: any
}

const OrderCard = (props: Props) => {
  const {
    item, onAccept, onReject
  } = props;
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  const [show, setshow] = useState(false);
  return (
    <View style={styles.card}>

      <View style={[layout.dirRow, styles.row]}>
        <View style={styles.con1}>
          <View style={[layout.dirRow, { justifyContent: "space-between", alignItems: "center" }]}>
            <Text style={[styles.time]}>{item.time}</Text>
            <View style={[layout.rowBox, { alignItems: "center" }]}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={[layout.flexStart, { paddingHorizontal: PixelPerfect(8) }]}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
              </View>
            </View>
          </View>



          <Text style={styles.product}>{item.product}</Text>
          <View style={[layout.rowBox, styles.actions]}>
            <Text style={styles.quantity}>الكمية: {item.quantity}</Text>
            <Text style={styles.price}>{item.price} جنيه</Text>
          </View>

        </View>
      </View>



      <View style={[layout.dirRow, styles.actions]}>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => onReject(item)}>
          <Text style={styles.rejectText}>✗ رفض</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(item)}>
          <Text style={styles.acceptText}>✓ قبول</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default OrderCard

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.white,
      borderRadius: PixelPerfect(10),
      padding: PixelPerfect(12),
      marginVertical: PixelPerfect(8),
      borderWidth: PixelPerfect(1),
      borderColor: theme.grayLigth,
    },
    time: { fontSize: PixelPerfect(14), textAlign: "left", color: theme.deactive, fontFamily: Fonts.medium },
    row: { alignItems: "center" },
    avatar: { width: PixelPerfect(40), height: PixelPerfect(40), borderRadius: PixelPerfect(20) },
    name: { fontSize: PixelPerfect(18), fontFamily: Fonts.bold, color: theme.black },
    rating: { fontSize: PixelPerfect(12), color: theme.currenctText, paddingEnd: PixelPerfect(8) },
    product: { fontSize: PixelPerfect(14), marginTop: PixelPerfect(8), color: theme.black, fontFamily: Fonts.bold },
    quantity: { fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.medium },
    con1: { flex: 1, marginHorizontal: PixelPerfect(8) },
    price: { fontSize: PixelPerfect(14), color: theme.textColor, fontFamily: Fonts.bold },

    actions: { justifyContent: "space-between", marginTop: PixelPerfect(8) },
    acceptBtn: {
      flex: 1,
      marginLeft: PixelPerfect(5),
      backgroundColor: theme.babyBlue,
      borderRadius: PixelPerfect(6),
      padding: PixelPerfect(10),
      alignItems: "center",
    },
    rejectBtn: {
      flex: 1,
      marginRight: PixelPerfect(5),
      borderWidth: PixelPerfect(1),
      borderColor: theme.youtube,
      borderRadius: PixelPerfect(6),
      padding: PixelPerfect(10),
      alignItems: "center",
    },
    acceptText: {
      fontSize: PixelPerfect(16),
      fontFamily: Fonts.bold,
      color: theme.white
    },
    rejectText: { fontSize: PixelPerfect(16), color: theme.youtube, fontFamily: Fonts.bold, },
  });