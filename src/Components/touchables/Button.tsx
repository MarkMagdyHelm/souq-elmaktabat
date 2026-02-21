import React, {FC, useContext} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  TouchableOpacity
} from 'react-native';
import LottieView from 'lottie-react-native';

import {TouchableProps} from '../../Constants/interfaces';
import {Colors} from '../../Constants/styleConstants';
import {PixelPerfect} from '../../Constants/styleConstants';
import {ThemeContext} from '../../Constants/theming';

interface Props extends TouchableProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  styleTitle?: StyleProp<TextStyle>;
  loader?: boolean;
  disable?: boolean;
  children?:JSX.Element
}

const Button: FC<Props> = ({
  dark,
  onPress,
  disable,
  title,
  style,
  styleTitle,
  children,
  loader,
}) => {
  const {dir, Fonts, layout, theme} = useContext(ThemeContext);
  return (
    <TouchableOpacity disabled={disable} onPress={onPress}>
      <View
        style={[
          styles.container,
          layout.rowBox,
          {backgroundColor: disable ? theme.disableBtn : theme.button},
          style,
        ]}>
        {children}
        {loader ? (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LottieView
              source={require('../../Assets/Animations/loader.json')}
              autoPlay
              loop
              style={{
                width: PixelPerfect(30),
                height: PixelPerfect(30),
              }}
            />
          </View>
        ) : (
          <Text style={[styles.title, {fontFamily: Fonts.bold}, styleTitle]}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    height: PixelPerfect(52),
    marginBottom: PixelPerfect(20),
    backgroundColor: Colors.mainColor,
    borderRadius: PixelPerfect(8),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: Colors.white,
    fontSize: PixelPerfect(16),
    letterSpacing: 1.2,
    width: '100%',
    textAlign: 'center',
  },
});
