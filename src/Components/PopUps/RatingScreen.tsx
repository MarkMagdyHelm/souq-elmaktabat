import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
  Modal
} from 'react-native';

import { EyeIcon, StareIcon } from '../../Assets/Svg';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ThemeContext } from '../../Constants/theming';
import { PixelPerfect } from '../../Constants/styleConstants';

const RatingScreen = ({ visible, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  const handleRating = (value) => setRating(value);

  const handleSave = () => {
    onSubmit({ rating, comment });
    onClose();
  };

  return (

    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>

        <View style={styles.container}>
          <View style={styles.container1}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>تقييم البائع</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={[layout.rowBox, { marginVertical: PixelPerfect(16), alignItems: "center" }]}>
              <Image
                source={{ uri: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg" }}
                style={[styles.imageRound]}
              />
              {/* Seller Name */}
              <Text style={styles.sellerName}>مكتبة النور</Text>
            </View>
          </View>
          <View style={{ height: PixelPerfect(8), backgroundColor: theme.accordianBody, }}></View>
          <View style={[styles.container1, { marginTop: PixelPerfect(10) }]}>
            {/* Stars */}
            <Text style={styles.subtitle}>قيم البائع</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                  <StareIcon
                    name={star <= rating ? 'star' : 'star-o'}
                    size={PixelPerfect(32)}
                    color="#f5b50a"
                    style={styles.star}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Comment */}
            <Text style={styles.commentLabel}>اكتب تعليقك (اختياري)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="قيم تجربتك"
              value={comment}
              onChangeText={setComment}
              textAlign="right"
              multiline
            />

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>حفظ</Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    </Modal >

  );
};

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: "flex-end",
      alignItems: 'center',

    },
    container: {
      backgroundColor: theme.white,
      width: '100%',
      borderRadius: PixelPerfect(12),

      padding: PixelPerfect(18)
    },

    container1: {
      backgroundColor: theme.white,

    },
    header: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: { fontSize: PixelPerfect(18), fontFamily: Fonts.medium, color: theme.textColor },
    close: { fontSize: PixelPerfect(24), color: theme.deactive },
    sellerName: { textAlign: 'right', fontSize: PixelPerfect(18), fontFamily: Fonts.medium, color: theme.black, paddingHorizontal: PixelPerfect(4) },
    subtitle: { textAlign: 'center', fontSize: PixelPerfect(18), fontFamily: Fonts.medium, marginVertical: PixelPerfect(8), color: theme.textColor },
    starsRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: PixelPerfect(8) },
    star: { marginHorizontal: PixelPerfect(5) },
    commentLabel: { textAlign: 'right', fontSize: PixelPerfect(18), fontFamily: Fonts.medium, color: theme.black, marginTop: PixelPerfect(32) },
    textInput: {
      borderWidth: PixelPerfect(1),
      borderColor: theme.optionText,
      borderRadius: PixelPerfect(8),
      padding: PixelPerfect(10),
      marginTop: PixelPerfect(6),
      minHeight: PixelPerfect(70),
      color: theme.deactive,
      fontFamily: Fonts.medium
    },
    saveButton: {
      backgroundColor: theme.babyBlue,
      borderRadius: PixelPerfect(8),
      paddingVertical: PixelPerfect(16),
      marginVertical: PixelPerfect(16),
    },
    saveText: { textAlign: 'center', fontSize: PixelPerfect(14), color: theme.white, fontFamily: Fonts.bold },
    imageRound: {
      height: PixelPerfect(32),
      width: PixelPerfect(32),
      borderRadius: PixelPerfect(12),
      marginRight: PixelPerfect(4),
    },
  });

export default RatingScreen;