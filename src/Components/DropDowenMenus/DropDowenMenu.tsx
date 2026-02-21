import { FlatList, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import Modal from 'react-native-modal';
import { CloseIcon } from '../../Assets/Svg'

type Props = {
    onCloseFn: (val: any) => void,
    currentFilter: any,
    items: any,
    title: string,
    style: ViewStyle
}

const DropDowenMenu = (props: Props) => {
    const {
        onCloseFn,
        currentFilter,
        items,
        title,
        style
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const [state, setstate] = useState({
        items: items,
        selectFilter: currentFilter,

    })
    const handelCheck = (index: number) => {
        let res = state.items

        setstate(old => ({ ...old, items: res, selectFilter: res[index] }))
        // setTimeout(() => {
        onCloseFn && onCloseFn(res[index])
        // }, 800);
    }

    return (
        <Modal
            backdropOpacity={0.2}
            //    backdropColor='#00000'
            onBackButtonPress={() => {
                onCloseFn && onCloseFn(state.selectFilter)
            }}
            onBackdropPress={() => {
                onCloseFn && onCloseFn(state.selectFilter)
            }}
            isVisible={true}
            style={{ margin: 0, justifyContent: "flex-end" }}
        >
            <View style={[styles.con, style]}>
                <View style={[layout.rowBox, styles.headerCon]}>
                    <Text style={styles.title}>{title}</Text>
                    <Pressable style={styles.CloseCon}
                        unstable_pressDelay={100}
                        onPress={() => { onCloseFn && onCloseFn(state.selectFilter) }}>
                        <CloseIcon />
                    </Pressable>
                </View>
                <View style={styles.listCon}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        //   onRefresh={() =>{}}
                        //   refreshing={isFetching}
                        style={styles.list}
                        data={items}
                        keyExtractor={(items, index: number) => index.toString()}
                        ItemSeparatorComponent={() => (<View style={{ height: PixelPerfect(18) }} />)}
                        renderItem={({ item, index }) => {

                            return (
                                <Pressable style={[layout.rowBox, styles.filterCon]} onPress={() => { handelCheck(index) }}>
                                    {/* <View style={styles.checkCon}>
                       {(typeof state?.selectFilter?.ID!= 'string'&&item.ID == state?.selectFilter?.ID) && <View style={styles.check}/>}
                      </View> */}
                                    <Text style={styles.filterText}>
                                        {dir === "rtl"
                                            ? item?.arName ?? item?.branchName??item?.name 
                                            : item?.name ?? item?.branchName}
                                    </Text>
                                </Pressable>
                            );
                        }}
                        ListFooterComponent={() => (<View style={{ height: PixelPerfect(50) }} />)}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default DropDowenMenu

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        con: {

            backgroundColor: Colors.white,
            borderTopRightRadius: PixelPerfect(8),
            borderTopLeftRadius: PixelPerfect(8),
            paddingVertical: PixelPerfect(20)
        },
        title: {
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(20),
            color: theme.black,
            marginBottom: PixelPerfect(20),
            textAlign: dir == "rtl" ? "right" : "left",
            lineHeight: PixelPerfect(25)
        },
        filterCon: {
            alignItems: "center",
            marginBottom: PixelPerfect(10),
            paddingHorizontal: PixelPerfect(24),
            paddingVertical: PixelPerfect(3),
        },
        filterText: {
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(16),
            color: theme.black,
            // paddingHorizontal:PixelPerfect(16)
        },
        listCon: {

        },
        list: {

        },
        headerCon: {
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: PixelPerfect(16),
        },
        CloseCon: {
            height: PixelPerfect(50),
            width: PixelPerfect(50)
        }
    })