import {  FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container } from '../../Components/containers/Containers'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import { t } from 'i18next'
import { Colors, phoneWidth, PixelPerfect } from '../../Constants/styleConstants'
import { Slider1, Slider2, Slider3, Slider4, Slider5 } from '../../Assets/Svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
import Button from '../../Components/touchables/Button'


type Props = {
    navigation: any
}

const Index = (props: Props) => {
    const {
        navigation
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const ref = useRef() as any;
    const { isLogin } = useSelector((state: RootState) => state.auth);
    const [state, setstate] = useState({

    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const intervalRef = useRef(null);

    // Sample SVG data
    const svgData = [
        {
            id: 1,
            svg: (
                <Slider1 />
            ),
            title: t("title1"),
            des: t("desc1")
        },
        {
            id: 2,
            svg: (
                <Slider2 />
            ),
            title: t("title2"),
            des: t("desc2")
        },
        {
            id: 3,
            svg: (
                <Slider3 />
            ),
            title: t("title3"),
            des: t("desc3")
        },
        {
            id: 4,
            svg: (
                <Slider4 />
            ),
            title: t("title4"),
            des: t("desc4")
        },
        {
            id: 5,
            svg: (
                <Slider5 />
            ),
            title: t("title5"),
            des: t("desc5")
        }
    ];

    // Auto-scroll function
    const startAutoScroll = () => {
        intervalRef.current = setInterval(() => {
            const nextIndex = (currentIndex + 1) % svgData.length;
            goToSlide(nextIndex);
        }, 2000); // 2 seconds
    };

    const stopAutoScroll = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const goToSlide = (index) => {
        flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5
        });
        setCurrentIndex(index);
    };

    useEffect(() => {
        // startAutoScroll();

        // Cleanup on unmount
        return () => stopAutoScroll();
    }, [currentIndex]);

    // Handle manual scroll
    const onScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / phoneWidth);

        if (index !== currentIndex) {
            setCurrentIndex(index);
            // Restart auto-scroll timer when user manually scrolls
            stopAutoScroll();
            //   startAutoScroll();
        }
    };

    const onTouchStart = () => {
        // Pause auto-scroll when user touches the slider
        stopAutoScroll();
    };

    const onTouchEnd = () => {
        // Resume auto-scroll after 5 seconds of user interaction
        setTimeout(() => {
            //   startAutoScroll();
        }, 5000);
    };

    const renderItem = ({ item, index }) => (
        <View
            style={{
                width: phoneWidth,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <View style={{

                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
            }}>
                {item.svg}
            </View>
            <Text style={{
                marginTop: PixelPerfect(24),
                fontSize: PixelPerfect(24),
                fontFamily: Fonts.bold,
                color: theme.textColor,
                textAlign: "center",
                lineHeight: 35
            }}>
                {item.title}
            </Text>
            <Text style={{
                marginTop: PixelPerfect(8),
                fontSize: PixelPerfect(16),
                fontFamily: Fonts.regular,
                color: "#181619",
                textAlign: "center",
                lineHeight: 24
            }}>
                {item.des}
            </Text>
        </View>
    );
    const handlePass = () => {
        navigation.reset({
            index: 0,
            routes: [
                { name: 'Home2' },
            ],
        });
    }
    return (
        <Container showHint={false}>
            <View style={styles.bodyCon}>
                <View style={styles.logoCon}>
                    <Text style={[styles.passTxt, dir == "rtl" ? { left: 0 } : { right: 0 }]}
                        onPress={handlePass}
                    >{t("Pass")}</Text>
                </View>
                <View style={{ flex: 0.7 }}>

                    <FlatList
                        ref={flatListRef}
                        data={svgData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        getItemLayout={(data, index) => ({
                            length: phoneWidth,
                            offset: phoneWidth * index,
                            index,
                        })}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                    />
                </View>

                {/* Pagination Dots */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    padding: 20,
                    alignItems: 'center'
                }}>
                    {svgData.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                goToSlide(index);
                                stopAutoScroll();
                                //   startAutoScroll();
                            }}
                            style={{
                                width: currentIndex === index ? 8 : 6,
                                height: currentIndex === index ? 8 : 6,
                                borderRadius: 5,
                                backgroundColor: currentIndex === index ? theme.textColor : theme.deactive,
                                margin: 5,
                                transition: 'all 0.3s ease',
                            }}
                        />
                    ))}
                </View>
                <View style={styles.btnCon}>
                    <Button
              title={t('Sign in')}
              styleTitle={styles.buttonText}
              onPress={()=>{
                  navigation.reset({
            index: 0,
            routes: [
                { name: 'Signin' },
            ],
        });
              }}
              style={styles.button}
              />
                  <Button
              title={t('signtxt1')}
              styleTitle={styles.buttonText2}
              onPress={()=>{
                  navigation.reset({
            index: 0,
            routes: [
                { name: 'Signup' },
            ],
        });
              }}
              style={styles.button2}
              />
                </View>
            </View>
        </Container>

    )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({

        bodyCon: {
            flex: 1,
            backgroundColor: theme.mainColor,
        },
        logoCon: {
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 0.05,
            paddingHorizontal: PixelPerfect(16)
        },
        passTxt: {
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(20),
        },
        button:{
              backgroundColor:Colors.secondColor,
              height:PixelPerfect(50),
              alignItems:"center",
              justifyContent:"center",
              marginTop:PixelPerfect(16)
            },
            buttonText:{
              fontFamily:Fonts.bold,
              fontSize:PixelPerfect(18),
              color:theme.mainColor,
            },
            btnCon:{
                flex:0.25,
                paddingHorizontal: PixelPerfect(16),
            },
              button2:{
              borderColor:Colors.secondColor,
              height:PixelPerfect(50),
              alignItems:"center",
              justifyContent:"center",
              marginTop:PixelPerfect(16),
              borderWidth:PixelPerfect(0.7)
            },
            buttonText2:{
              fontFamily:Fonts.bold,
              fontSize:PixelPerfect(18),
              color:Colors.secondColor,
            },
    });