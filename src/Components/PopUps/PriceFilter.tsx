import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, GestureResponderEvent, PanResponder, PanResponderGestureState, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import Button from '../touchables/Button';
import { t } from 'i18next';
import { CloseIcon } from '../../Assets/Svg';

type Props = {
    show: boolean,
    onCloseFn: (val: { min: number, max: number } | false) => void,
    min?: number,
    max?: number,
    initialMin?: number,
    initialMax?: number,
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const PriceFilter = (props: Props) => {
    const { show, onCloseFn, min = 0, max = 1000, initialMin = 0, initialMax = 1000 } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);

    const [trackWidth, setTrackWidth] = useState(1);
    const [minValue, setMinValue] = useState<number>(initialMin);
    const [maxValue, setMaxValue] = useState<number>(initialMax);
    const minX = useRef(new Animated.Value(0)).current;
    const maxX = useRef(new Animated.Value(0)).current;

    const valueToX = (value: number) => ((value - min) / (max - min)) * trackWidth;
    const xToValue = (x: number) => Math.round(min + (clamp(x, 0, trackWidth) / trackWidth) * (max - min));

    // Reset values when modal opens
    useEffect(() => {
        if (show) {
            const defaultMin = 0;
            const defaultMax = 1000;
            setMinValue(defaultMin);
            setMaxValue(defaultMax);
            if (trackWidth > 1) {
                minX.setValue(valueToX(defaultMin));
                maxX.setValue(valueToX(defaultMax));
            }
        }
    }, [show, trackWidth]);

    const onLayoutTrack = (w: number) => {
        setTrackWidth(w);
        // initialize positions
        minX.setValue(valueToX(minValue));
        maxX.setValue(valueToX(maxValue));
    };

    const minThumbPan = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderMove: (_, gestureState: PanResponderGestureState) => {
                    const newX = clamp(valueToX(minValue) + gestureState.dx, 0, valueToX(maxValue));
                    minX.setValue(newX);
                },
                onPanResponderRelease: (_, gestureState) => {
                    const newVal = xToValue(valueToX(minValue) + gestureState.dx);
                    setMinValue(clamp(newVal, min, maxValue));
                },
            }),
        [trackWidth, minValue, maxValue]
    );

    const maxThumbPan = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderMove: (_, gestureState: PanResponderGestureState) => {
                    const newX = clamp(valueToX(maxValue) + gestureState.dx, valueToX(minValue), trackWidth);
                    maxX.setValue(newX);
                },
                onPanResponderRelease: (_, gestureState) => {
                    const newVal = xToValue(valueToX(maxValue) + gestureState.dx);
                    setMaxValue(clamp(newVal, minValue, max));
                },
            }),
        [trackWidth, minValue, maxValue]
    );

    const handleReset = () => {
        setMinValue(min);
        setMaxValue(max);
        minX.setValue(valueToX(min));
        maxX.setValue(valueToX(max));
    };

    const handleSearch = () => {
        onCloseFn && onCloseFn({ min: minValue, max: maxValue });
    };

    return (
        <Modal
            backdropOpacity={0.31}
            onBackButtonPress={() => onCloseFn && onCloseFn(false)}
            onBackdropPress={() => onCloseFn && onCloseFn(false)}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            isVisible={show}
            style={{ margin: 0, justifyContent: 'flex-end' }}
        >
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Pressable style={{paddingHorizontal:PixelPerfect(4)}} onPress={() => onCloseFn && onCloseFn(false)}>
                        <CloseIcon />
                    </Pressable>
                    <Text style={[layout.textAlign, styles.title]}>{t('select_price')}</Text>
                </View>

                {/* Slider */}
                <View
                    style={styles.trackContainer}
                    onLayout={(e) => onLayoutTrack(e.nativeEvent.layout.width)}
                >
                    <View style={styles.track} />
                    {/* Active track between min and max */}
                    <Animated.View
                        style={[
                            styles.activeTrack,
                            {
                                left: minX,
                                width: Animated.subtract(maxX, minX),
                            },
                        ]}
                    />
                    {/* Bubble value over min thumb */}
                    <Animated.View
                        style={[
                            styles.bubbleContainer,
                            {
                                transform: [{ translateX: Animated.add(minX, new Animated.Value(-PixelPerfect(35))) }]
                            }
                        ]}
                    >
                        <View style={[styles.bubble, layout.center]}>
                            <Text style={styles.bubbleText}>{`${minValue} جنيهًا`}</Text>
                        </View>
                        <View style={styles.bubbleTail} />
                    </Animated.View>
                    {/* Bubble value over max thumb */}
                    <Animated.View
                        style={[
                            styles.bubbleContainer,
                            {
                                transform: [{ translateX: Animated.add(maxX, new Animated.Value(-PixelPerfect(35))) }]
                            }
                        ]}
                    >
                        <View style={[styles.bubble, layout.center]}>
                            <Text style={styles.bubbleText}>{`${maxValue} جنيهًا`}</Text>
                        </View>
                        <View style={styles.bubbleTail} />
                    </Animated.View>
                    {/* Min Thumb */}
                    <Animated.View
                        style={[styles.thumb, { transform: [{ translateX: minX }] }]}
                        {...minThumbPan.panHandlers}
                    />
                    {/* Max Thumb */}
                    <Animated.View
                        style={[styles.thumb, { transform: [{ translateX: maxX }] }]}
                        {...maxThumbPan.panHandlers}
                    />
                </View>

                {/* Inputs row */}
                <View style={[layout.dirRow, styles.inputsRow]}>
                    <View style={[styles.pillInput, layout.rowBox]}>
                        <TextInput
                            keyboardType={'numeric'}
                            value={String(minValue)}
                            onChangeText={(txt) => {
                                const v = clamp(parseInt(txt || '0', 10), min, maxValue);
                                setMinValue(v);
                                minX.setValue(valueToX(v));
                            }}
                            placeholder={'0'}
                            style={styles.input}
                            textAlign={dir === 'rtl' ? 'right' : 'left'}
                        />
                        <Text style={styles.inputCurrency}>جنيهًا</Text>
                    </View>

                    <Text style={styles.dash}>-</Text>
                    <View style={[styles.pillInput, layout.rowBox]}>
                        <TextInput
                            keyboardType={'numeric'}
                            value={String(maxValue)}
                            onChangeText={(txt) => {
                                const v = clamp(parseInt(txt || '0', 10), minValue, max);
                                setMaxValue(v);
                                maxX.setValue(valueToX(v));
                            }}
                            placeholder={'0'}
                            style={styles.input}
                            textAlign={dir === 'rtl' ? 'right' : 'left'}
                        />
                        <Text style={styles.inputCurrency}>جنيهًا</Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={[layout.rowBox, styles.actions]}>
                    <TouchableOpacity style={[styles.button, styles.resetBtn]} onPress={handleReset}>
                        <Text style={styles.resetText}>إعادة ضبط</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.serchBtn]} onPress={handleSearch}>
                        <Text style={styles.searchText}>بحث</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default PriceFilter;

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        container: {
            flex: 0.42,
            paddingHorizontal: PixelPerfect(16),
            paddingVertical: PixelPerfect(20),
            backgroundColor: Colors.white,
            borderTopLeftRadius: PixelPerfect(24),
            borderTopRightRadius: PixelPerfect(24),
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: PixelPerfect(70),
        },
        close: {
            fontSize: PixelPerfect(20),
            marginHorizontal: PixelPerfect(10),
        },
        title: {
            flex: 1,
            fontSize: PixelPerfect(18),
            fontFamily: Fonts.bold,
            color: theme.textColor,
        },
        bubbleContainer: {
            position: 'absolute',
            alignItems: 'center',
            top: -PixelPerfect(45),
        },
        bubble: {
            backgroundColor: theme.babyBlue,
            paddingHorizontal: PixelPerfect(18),
            paddingVertical: PixelPerfect(8),
            borderRadius: PixelPerfect(40),
        },
        bubbleTail: {
            width: 0,
            height: 0,
            borderLeftWidth: PixelPerfect(8),
            borderRightWidth: PixelPerfect(8),
            borderTopWidth: PixelPerfect(10),
            borderStyle: 'solid',
            backgroundColor: 'transparent',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: theme.babyBlue,
            alignSelf: 'center',
            marginTop: -PixelPerfect(2),
        },
        bubbleText: {
            color: Colors.white,
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(14),
        },
        trackContainer: {
            height: PixelPerfect(60),
            justifyContent: 'center',
            marginStart: PixelPerfect(26),
            marginEnd: PixelPerfect(60),
            marginBottom: PixelPerfect(16),
        },
        track: {
            position: 'absolute',
            left: 0,
            right: 0,
            height: PixelPerfect(6),
            borderRadius: PixelPerfect(6),
            backgroundColor: '#cfe0ff',

        },
        activeTrack: {
            position: 'absolute',
            height: PixelPerfect(6),
            borderRadius: PixelPerfect(6),
            backgroundColor: theme.babyBlue,

        },
        thumb: {
            position: 'absolute',
            top: PixelPerfect(2),
            width: PixelPerfect(28),
            height: PixelPerfect(28),
            borderRadius: PixelPerfect(14),
            backgroundColor: Colors.white,
            borderWidth: PixelPerfect(3),
            borderColor: theme.babyBlue,
            elevation: 3,
            shadowColor: theme.babyBlue,
            shadowOpacity: 0.12,
            shadowRadius: 4,
        },
        inputsRow: {
            marginTop: PixelPerfect(10),
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        pillInput: {
            flex: 0.45,
            height: PixelPerfect(56),
            borderRadius: PixelPerfect(28),
            borderWidth: PixelPerfect(1.2),
            borderColor: theme.deactive,
            paddingHorizontal: PixelPerfect(18),
            backgroundColor: Colors.white,
            alignItems: "center",

        },
        input: {
            flex: 1,
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(14),
            color: theme.textColor,

        },
        inputCurrency: {
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(12),
            color: theme.deactive,
            marginHorizontal: PixelPerfect(6),
        },
        dash: {
            width: '10%',
            textAlign: 'center',
            color: theme.deactive,
            fontSize: PixelPerfect(18),
        },
        actions: {

            marginTop: PixelPerfect(20),
            alignItems: 'center',
            justifyContent: 'space-between',
            alignContent: "center",
        },
        button: {

            paddingVertical: PixelPerfect(12),
            borderRadius: PixelPerfect(8),
            alignItems: 'center',
            justifyContent: 'center',
        },
        resetBtn: {
            borderWidth: 1,
            borderColor: theme.babyBlue,
            marginRight: PixelPerfect(8),
            width: '47%',
        },

        serchBtn: {
            borderWidth: 1,
            borderColor: theme.babyBlue,
            backgroundColor: theme.babyBlue,
            marginRight: PixelPerfect(8),
            width: '47%',
        },

        resetText: {
            color: theme.babyBlue,
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(16),
        },
        searchText: {
            color: theme.white,
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(16),
        },
    });


