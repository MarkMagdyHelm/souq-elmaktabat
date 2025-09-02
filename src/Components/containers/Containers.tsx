import React, { createRef, FC, useContext, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleProp,
  ViewStyle,
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import { ThemeContext } from '../../Constants/theming';

interface containerProps {
  children?: JSX.Element[] | JSX.Element | boolean | any;
  style?: StyleProp<ViewStyle>;
  fullBackground?: boolean;
  showHint?: boolean;
  confirmPassword?: boolean;
  isdark?:boolean,
  color?:any,
  noSafeArea?:boolean
}
interface contentProps {
  controls?: (arg: any) => void;
  noPadding?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  paddingVertical?: boolean;
  children?: JSX.Element[] | JSX.Element | any;
  refreshControl?: any;
  scrollEnabled?:boolean
}
export const Container: FC<containerProps> = ({
  children,
  style,
  fullBackground,
  showHint = false,
  isdark,
  color,
  noSafeArea
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <StatusBar
        backgroundColor={isdark?theme.mainColor:theme.mainColor}
        barStyle={isdark ? 'light-content' : 'dark-content'}
        // hidden
      />
    <SafeAreaView style={{ flex:0, backgroundColor:isdark?theme.mainColor:theme.mainColor}} />
    
      <KeyboardAvoidingView
        style={{ flex: 1 ,borderColor:Colors.white,
          backgroundColor:isdark?theme.mainColor:theme.mainColor}}
        keyboardVerticalOffset={50}
        // behavior='padding'
    // behavior='height'
    {...(showHint && {
      // enabled: true,
      // behavior: 'height',
      // keyboardVerticalOffset: PixelPerfect(200),
    })}>
    {children}
  </KeyboardAvoidingView>
      {!noSafeArea&&<SafeAreaView
      style={[
        { flex: 0, backgroundColor: Colors.white },
        style,
        fullBackground && {
          backgroundColor: color?? Colors.white,
        },
      ]}>
    </SafeAreaView>}
    </>
  );
};
export const Content: FC<contentProps> = ({
  controls,
  children,
  noPadding,
  style,
  contentContainerStyle,
  paddingVertical,
  refreshControl,
  scrollEnabled
}) => {
  const { theme } = useContext(ThemeContext);

  const ContentRef = createRef();
  useEffect(() => {
    controls && controls(ContentRef?.current);
  }, []);
  return (
    <ScrollView
    automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
      ref={ContentRef as any}
      style={style}
      scrollEnabled={scrollEnabled}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        // { backgroundColor: theme.secondColor },
        paddingVertical && { paddingVertical: PixelPerfect(30) },
        contentContainerStyle,
      ]}>
      <View
        style={{
          paddingHorizontal: noPadding ? undefined : PixelPerfect(21),
        }}>
        {children}
      </View>
    </ScrollView>
  );
};
