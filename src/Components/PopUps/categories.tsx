import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ThemeContext } from '../../Constants/theming';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';
import Modal from 'react-native-modal';
import { CloseIcon } from '../../Assets/Svg';
import { useNavigation } from '@react-navigation/native';

type Props = {
  onCloseFn: () => void;
  items: any;
  title: string;
  style: ViewStyle;
};

const CategoriesPopup = (props: Props) => {
  const { onCloseFn, items, title, style } = props;
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  const [state, setstate] = useState({
    items: items,
  });
  const navigation = useNavigation() as any;

  const handelCheck = (index: number) => {
    let res = state.items;
    setstate(old => ({ ...old, items: res, selectFilter: res[index] }));
    // setTimeout(() => {
    onCloseFn && onCloseFn();
    // }, 800);
  };

  return (
    <Modal
      backdropOpacity={0.2}
      //    backdropColor='#00000'
      onBackButtonPress={() => {
        onCloseFn && onCloseFn();
      }}
      onBackdropPress={() => {
        onCloseFn && onCloseFn();
      }}
      isVisible={true}
      style={{ margin: 0, justifyContent: 'flex-end' }}
    >
      <View style={[styles.con, style]}>
        <View style={[layout.rowBox, styles.headerCon]}>
          <Text style={styles.title}>{title}</Text>
          <Pressable
            style={styles.CloseCon}
            unstable_pressDelay={100}
            onPress={() => {
              onCloseFn && onCloseFn();
            }}
          >
            <CloseIcon />
          </Pressable>
        </View>
        <FlatList
          data={items}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          style={{
            paddingHorizontal: PixelPerfect(16),
            paddingTop: PixelPerfect(5),
          }}
          renderItem={({ item }) => (
            <Pressable
              style={[layout.rowBox, styles.conitem]}
              onPress={() => {
                onCloseFn && onCloseFn();
                navigation.navigate('AddOffer', {
                  item: item,
                  type: item.name,
                });
              }}
            >
              <Image
                style={styles.img}
                source={
                  item?.id == 1
                    ? require('../../Assets/Images/PaperDef1.png')
                    : item?.id == 2
                    ? require('../../Assets/Images/InkDef1.png')
                    : require('../../Assets/Images/printDef1.png')
                }
              />
              {/* <Image
                                source={{ uri: item.image }}
                                style={styles.img}
                            /> */}
              <Text style={[layout.textAlign, styles.itemtxt]}>
                {dir == 'rtl' ? item.arName : item.name}
              </Text>
            </Pressable>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ paddingVertical: PixelPerfect(8) }} />
          )}
        />
      </View>
    </Modal>
  );
};

export default CategoriesPopup;

const useStyles = (
  Fonts: IFont,
  theme: ITheme,
  darkmode: boolean,
  dir: string,
) =>
  StyleSheet.create({
    con: {
      backgroundColor: Colors.white,
      borderTopRightRadius: PixelPerfect(8),
      borderTopLeftRadius: PixelPerfect(8),
      paddingVertical: PixelPerfect(20),
    },
    headerCon: {
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: PixelPerfect(16),
    },
    CloseCon: {
      height: PixelPerfect(50),
      width: PixelPerfect(50),
    },
    title: {
      fontFamily: Fonts.bold,
      fontSize: PixelPerfect(16),
      color: theme.black,
      marginBottom: PixelPerfect(20),
      textAlign: dir == 'rtl' ? 'right' : 'left',
      lineHeight: PixelPerfect(25),
    },
    conitem: {
      alignItems: 'center',
      backgroundColor: theme.categorypopupitemBg,
      paddingHorizontal: PixelPerfect(11),
      paddingVertical: PixelPerfect(10),
      borderRadius: PixelPerfect(8),
      shadowColor: theme.black,
      shadowOpacity: 0.1,
      shadowRadius: PixelPerfect(4),

      boxShadow: '0px 0px 1px 0px #00000040',
    },
    img: {
      height: PixelPerfect(48),
      width: PixelPerfect(48),
    },
    itemtxt: {
      fontFamily: Fonts.bold,
      fontSize: PixelPerfect(18),
      color: theme.textColor,
      paddingHorizontal: PixelPerfect(14),
    },
  });
