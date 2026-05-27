import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';

import { CloseIcon } from '../../Assets/Svg';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ThemeContext } from '../../Constants/theming';
import { PixelPerfect } from '../../Constants/styleConstants';
import Icon from 'react-native-vector-icons/FontAwesome';
import { t } from 'i18next';
import Space from '../../Helper/Space';
import { GetNamesByLang } from '../../Helper';

type Props = {
  visible: boolean,
  item: any,
  onSubmit?: (any: any) => void,
  onClose?: () => void
}

const RatingScreen = (props: Props) => {
  const {
    visible,
    item,
    onSubmit,
    onClose,

  } = props

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  const handleRating = (value) => setRating(value);

  const handleSave = () => {
    onSubmit({ rating, comment });
    onClose();
  };
  console.log("item");
  console.log(item);


  return (

    <Modal transparent visible={visible} animationType="fade">
      <View style={[styles.overlay]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>

              <View style={styles.container1}>
                {/* Header */}
                <View style={[layout.rowBox, styles.header]}>
                  <Text style={[layout.textAlign, styles.title]}>{t("rateSellerTitle")}</Text>
                  <TouchableOpacity onPress={() => onClose()}>
                    <CloseIcon />
                  </TouchableOpacity>
                </View>

                <View style={[layout.rowBox, { marginVertical: PixelPerfect(16), alignItems: "center" }]}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={[styles.imageRound]}
                  />
                  {/* Seller Name */}
                  <Text style={styles.sellerName}>{item.userName}</Text>
                </View>
              </View>
              <Space />
              <View style={[styles.container1]}>
                {/* Stars */}
                <Text style={styles.subtitle}>{t("rateSellerSubtitle")}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                      <Icon
                        name={star <= rating ? 'star' : 'star-o'}
                        size={32}
                        color={star <= rating ? '#FFD700' : '#B0B0B0'} // دهبي للعادية، رمادي للدفولت
                        style={styles.star}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Comment */}
                <Text style={styles.commentLabel}>{t("writeComment")}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={t("rateExperience")}
                  value={comment}
                  onChangeText={setComment}
                  textAlign="right"
                  multiline
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveText}>{t("save")}</Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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

      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: { lineHeight: PixelPerfect(25), fontSize: PixelPerfect(18), fontFamily: Fonts.medium, color: theme.textColor },
    sellerName: { lineHeight: PixelPerfect(25), textAlign: 'right', fontSize: PixelPerfect(18), fontFamily: Fonts.medium, color: theme.black, paddingHorizontal: PixelPerfect(4) },
    subtitle: { lineHeight: PixelPerfect(25), textAlign: 'center', fontSize: PixelPerfect(18), fontFamily: Fonts.medium, marginVertical: PixelPerfect(8), color: theme.textColor },
    starsRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: PixelPerfect(8) },
    star: { marginHorizontal: PixelPerfect(5) },
    commentLabel: { lineHeight: PixelPerfect(25), textAlign: 'right', fontSize: PixelPerfect(18), fontFamily: Fonts.medium, color: theme.black, marginTop: PixelPerfect(32) },
    textInput: {
      borderWidth: PixelPerfect(1),
      borderColor: theme.optionText,
      borderRadius: PixelPerfect(8),
      padding: PixelPerfect(10),
      marginTop: PixelPerfect(6),
      minHeight: PixelPerfect(80),
      color: theme.deactive,
      fontFamily: Fonts.medium
    },
    saveButton: {
      height: PixelPerfect(50),
      backgroundColor: theme.babyBlue,
      borderRadius: PixelPerfect(8),
      paddingVertical: PixelPerfect(16),
      marginVertical: PixelPerfect(16),
    },
    saveText: { lineHeight: PixelPerfect(25), textAlign: 'center', fontSize: PixelPerfect(20), color: theme.white, fontFamily: Fonts.bold },
    imageRound: {
      height: PixelPerfect(32),
      width: PixelPerfect(32),
      borderRadius: PixelPerfect(12),
      marginRight: PixelPerfect(4),
    },
  });

export default RatingScreen;