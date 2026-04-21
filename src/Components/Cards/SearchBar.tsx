import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { PixelPerfect } from '../../Constants/styleConstants';
import Icon from 'react-native-vector-icons/Ionicons';
import { t } from 'i18next';
type Props = {
  onPress: () => void;
  onPressSearch: (val: any) => void;
};

const SearchBar = (props: any) => {
  const { onPress, onPressSearch } = props;
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  const [text, settext] = useState('');
  return (
    <View style={styles.container}>
      {/* Filter Icon */}
      <Icon
        name="options-outline"
        size={22}
        color="#555"
        onPress={() => {
          onPress();
        }}
      />

      {/* Input */}
      <TextInput
        onChangeText={txt => {
          settext(txt);
          onPressSearch(txt);
        }}
        style={styles.input}
        placeholder={t('search')}
        placeholderTextColor="#999"
        textAlign="right" // Arabic right alignment
      />

      {/* Search Icon */}
      <Icon
        name="search-outline"
        size={22}
        color="#555"
        onPress={() => {
          onPressSearch(text);
        }}
      />
    </View>
  );
};

export default SearchBar;

const useStyles = (
  Fonts: IFont,
  theme: ITheme,
  darkmode: boolean,
  dir: string,
) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',

      borderRadius: PixelPerfect(15),
      paddingHorizontal: PixelPerfect(10),

      marginVertical: PixelPerfect(8),
      marginHorizontal: PixelPerfect(8),
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4, // Android shadow
      height: PixelPerfect(52),
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontFamily: Fonts.regular,
      marginHorizontal: PixelPerfect(8),
      color: '#000',
      height: PixelPerfect(50),
    },
  });
