import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Container, Content } from '../../Components/containers/Containers'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import { Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { BackIcon, Edit1Icon, MailIcon, PhonIcon, ShareIcon, SharIcon } from '../../Assets/Svg'
import Stars from '../../Helper/Stars'
import { GetNamesByLang } from '../../Helper'
import { RootState } from '../../Store/store'
import { useDispatch, useSelector } from 'react-redux'
import { GetSellerData } from '../../Apis/HomeApis'
import { useToast } from 'react-native-toast-notifications'
import { imageUrl } from '../../Constants/config'
import HeaderWithText from '../../Components/Headers/HeaderWithText'
import ImageWithFallback from '../../Components/ImageWithFallback/ImageWithFallback'
import { useFocusEffect } from '@react-navigation/native'

type Props = {
    navigation?: any
}

const Index = (props: Props) => {
    const {
        navigation,
  } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme);
    const toast = useToast();
    const dispatch = useDispatch();
     const { isLogin, userdata, isSeller } = useSelector((state: RootState) => state.auth);

    // Debug: Warn if navigated here without valid userdata
    // useEffect(() => {
        // if (!userdata || !userdata.id) {
            // console.error('⚠️ SellerProfile: Navigated without valid userdata!', {
            //     hasUserdata: !!userdata,
            //     isLogin,
            //     isSeller,
            // });
        // }
    // }, []);

    const [state, setstate] = useState({
        loading: false,
        sellerData: null,

    });
    //   console.log(userdata);
    useEffect(() => {
             getSellerData()
    }, [])

    // Refetch seller data when screen is focused (e.g. after editing profile)
    useFocusEffect(
        useCallback(() => {
            // console.log("SellerProfile focused - refetching data");
            getSellerData();
        }, [userdata.id])
    );

        const getSellerData = () => {
            // console.log('📊 SellerProfile: Fetching seller data for userId:', userdata?.id);
            // console.log('🔍 Current userdata state:', {
            //     hasUserdata: !!userdata,
            //     userId: userdata?.id,
            //     userName: userdata?.name,
            //     userEmail: userdata?.email,
            //     hasToken: !!userdata?.token,
            //     hasImageUrl: !!userdata?.imageUrl,
            //     allKeys: userdata ? Object.keys(userdata) : [],
            // });
            
            setstate(old => ({ ...old, loading: true }))
            dispatch<any>(GetSellerData(userdata.id, (res, status) => {
                  if (res.status === 200) {
                        // console.log('✅ SellerProfile: Data loaded successfully');
                        // console.log('📦 Seller data fields:', {
                        //     name: res.data?.name,
                        //     rate: res.data?.rate,
                        //     rateCount: res.data?.rateCount,
                        //     hasInfo: !!res.data?.info,
                        // });
                        setstate(old => ({ ...old, sellerData: res.data, loading: false }))
                  } else {
                        // console.error('❌ SellerProfile: Failed to load data', res);
                        setstate(old => ({ ...old, loading: false }));
                  }
            }))
      };
// console.log('====================================');
// console.log(userdata);
// console.log('====================================');
    return (
        <Container showHint={false}>
            <HeaderWithText title={t("")} isShareVisible={true} isFavVisible={false}  onShareClick={()=>{
                        
                    }}/>
            <Content style={styles.page} noPadding>

                {/* Top white card */}

                <View style={styles.headerCard}>
                    {/* top row: share, back */}
                
                    {/* name block: edit | name & rating | avatar */}
                    <View style={[layout.dirRow, styles.nameRow]}>
                        <Pressable style={styles.editBtn} onPress={()=>{
                                        navigation.navigate("EditProfile",{item:state?.sellerData});
                        }}>
                            <Text style={styles.editText}>{t("edit")}</Text>
                            <Edit1Icon />
                        </Pressable>

                        <View style={styles.nameCol}>
                            <Text style={styles.userName}> {state.sellerData?.name}</Text>

                            <Stars rating={state.sellerData?.rate} rateCount={state.sellerData?.rateCount} />

                        </View>
<ImageWithFallback
                uri={  userdata.imageUrl}
                type={0}//to set default
                style={styles.avatar}
              />
                        {/* <Image source={{ uri:  imageUrl+ userdata.imageUrl} } style={styles.avatar} /> */}
                    </View>
                </View>
               <View><Text style={{fontFamily:Fonts.regular, color:theme.babyBlue, 
                    fontSize:PixelPerfect(16),marginHorizontal:PixelPerfect(16)
                    ,marginBottom:PixelPerfect(8)}}>{t("accountPublishedText")}
                </Text></View>
                
                {/* Stats: two cards */}
               <View style={styles.statsRow}>
                
                    {[{ v: state.sellerData?.offers?.length ?? 0, l: t("offersCountText") },
                     { v: state.sellerData?.offers?.length ?? 0, l: t("ordersCountText") }, 
                     { v: state.sellerData?.rateCount, l: t('ratingsCountText') }]
                        .map((s, i) => (
                            <View key={i} style={styles.statBox}>
                                <Text style={styles.statValue}>{s.v}</Text>
                                <Text style={styles.statLabel}>{s.l}</Text>
                            </View>
                        ))}
                </View>
              
                {/* Account info block */}
                <View style={{ backgroundColor: theme.grayLigth}}>

                <View style={[styles.block,{marginTop:PixelPerfect(12),marginHorizontal:PixelPerfect(10) }]}>
                    <Text style={styles.blockTitle}>{t("accountInfo")}</Text>
                    <View style={[layout.dirRow, { justifyContent: "space-between" }]}>
                        <View style={styles.infoRow}><MailIcon /><Text style={styles.infoText}>{userdata.email}</Text></View>
                        <View style={styles.infoRow}><PhonIcon /><Text style={styles.infoText}>{userdata.phoneNumber}</Text></View>
                    </View>

                </View>
                </View>
                <View style={{ backgroundColor: theme.grayLigth }}>
                    {/* About */}
                    <View style={styles.block}>
                        <Text style={[layout.textAlign, styles.blockTitle]}>{t("aboutCompany")}</Text>
                        <Text style={[layout.textAlign, styles.paragraph]}>
                            {state.sellerData?.info?.description}
                        </Text>
                    </View>


                    {/* Tools - inline separated like design */}
                    <View style={styles.block}>
                        <Text style={[layout.textAlign, styles.blockTitle]}>{t("companyTools")}</Text>

                        <View style={[layout.dirRow, styles.listRow]}>

                            <FlatList
                                horizontal
                                inverted
                                data={state.sellerData?.info?.tools}
                                keyExtractor={(item) => item.id + ""}
                                renderItem={({ item, index }) => {
                                    const isLastItem =
                                        index === state.sellerData?.info?.tools.length - 1;
                                    return (
                                        <View style={[layout.rowBox, styles.listPair]}>
                                            <Text style={[layout.textAlign, styles.listItem]}>
                                                {GetNamesByLang(item, dir)}
                                            </Text>
                                            {!isLastItem && (
                                                <Text style={styles.separatorDot}>·</Text>
                                            )}
                                        </View>
                                    );
                                }}
                            />


                        </View>



                    </View>

                    {/* Activity (outlined box) - inline separated */}
                    <View style={[styles.block]}>
                        <Text style={[layout.textAlign, styles.blockTitle]}>{t("companyActivity")}</Text>

                        <View style={[layout.dirRow, styles.listRow]}>

                            <FlatList
                                horizontal
                                inverted
                                data={state.sellerData?.info?.activities}
                                keyExtractor={(item) => item.id + ""}
                                renderItem={({ item, index }) => {
                                    const isLastItem =
                                        index === state.sellerData?.info?.activities.length - 1;

                                    return (
                                        <View style={[layout.rowBox, styles.listPair]}>
                                            <Text style={[layout.textAlign, styles.listItem]}>
                                                {GetNamesByLang(item, dir)}
                                            </Text>

                                            {!isLastItem && (
                                                <Text style={styles.separatorDot}>·</Text>
                                            )}
                                        </View>
                                    );
                                }}
                            />
                        </View>
                    </View>

                    {/* Payment methods */}
                    <View style={[styles.block]}>
                        <Text style={[layout.textAlign, styles.blockTitle]}>{t("paymentMethods")}</Text>
                        <FlatList
                            data={state.sellerData?.info?.payments}
                            keyExtractor={(item) => item.id + ""}
                            renderItem={({ item }) => (
                                <Text style={[layout.textAlign, styles.bullets]}>• {GetNamesByLang(item, dir)}</Text>
                            )}
                        />


                    </View>


                </View>

            </Content>
      
      
      
        </Container>
    )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme) =>
    StyleSheet.create({
        page: {
            flex: 0.9,
            backgroundColor: theme.mainColor,
         
            paddingBottom: PixelPerfect(20)
        },
        headerCard: {
            backgroundColor: Colors.white,
            borderRadius: PixelPerfect(12),
            paddingVertical: PixelPerfect(12),
            paddingHorizontal: PixelPerfect(16),
            marginBottom: PixelPerfect(16)
        },
        headerRow: {

            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: PixelPerfect(6)
        },
        iconBtn: { width: PixelPerfect(36), height: PixelPerfect(28), alignItems: 'center', justifyContent: 'center' },
        iconText: { color: '#222', fontFamily: Fonts.medium, fontSize: PixelPerfect(16) },
        nameRow: {
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        avatar: { width: PixelPerfect(64), height: PixelPerfect(64), borderRadius: PixelPerfect(32), marginRight: PixelPerfect(8) },
        nameCol: { alignItems: 'flex-end', marginRight: PixelPerfect(4), flexShrink: 1 },
        userName: { fontFamily: Fonts.bold, color: theme.black, fontSize: PixelPerfect(20) },

        stars: { color: '#FFA800', fontFamily: Fonts.medium, fontSize: PixelPerfect(14), marginLeft: PixelPerfect(4) },
        ratingCount: { color: '#8F9BB3', fontFamily: Fonts.regular },
        editBtn: {
            borderWidth: 1,
            borderColor: "#3D4A78",
            borderRadius: PixelPerfect(6    ),
            paddingHorizontal: PixelPerfect(14),
            paddingVertical: PixelPerfect(7),
            backgroundColor: Colors.white,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 0,
            marginRight: 'auto'
        },
        editIcon: { color: theme.active, marginRight: PixelPerfect(6), fontFamily: Fonts.medium },
        editText: { color: "#3D4A78", fontFamily: Fonts.medium, fontSize: PixelPerfect(18) },

        statsRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: PixelPerfect(16) 
            ,marginHorizontal:PixelPerfect(12)},
        statBox: {
            width: (phoneWidth - PixelPerfect(32) - PixelPerfect(60)) / 3,
            backgroundColor: theme.grayLigth,

            borderRadius: PixelPerfect(12),
            alignItems: 'center',
            marginHorizontal: PixelPerfect(8),
            paddingVertical: PixelPerfect(14),
            shadowColor: '#000', shadowOpacity: 0.06,
            shadowRadius: PixelPerfect(6),
            shadowOffset: { width: 0, height: 2 },
            elevation: 0.5
        },
        statBoxUser: {
            width: (phoneWidth - PixelPerfect(32) - PixelPerfect(60)) / 1.8,
            backgroundColor: theme.grayLigth,

            borderRadius: PixelPerfect(12),
            alignItems: 'center',
            marginHorizontal: PixelPerfect(8),
            paddingVertical: PixelPerfect(14),
            shadowColor: '#000', shadowOpacity: 0.06,
            shadowRadius: PixelPerfect(6),
            shadowOffset: { width: 0, height: 2 },
            elevation: 0.5
        },
        statValue: { fontFamily: Fonts.bold, color: "#3D4A78", fontSize: PixelPerfect(16) },
        statLabel: { marginTop: PixelPerfect(4), fontFamily: Fonts.regular, color: '#2C2C2C', fontSize: PixelPerfect(12) },

        block: { backgroundColor: Colors.white, borderRadius: PixelPerfect(12),marginHorizontal:PixelPerfect(10) , paddingVertical: PixelPerfect(14), paddingHorizontal: PixelPerfect(16), marginBottom: PixelPerfect(12) },
        blockTitle: { fontFamily: Fonts.medium, color: "#3D4A78", fontSize: PixelPerfect(16), marginBottom: PixelPerfect(12), textAlign: 'right' },
        infoRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-start', marginBottom: PixelPerfect(12) },
        infoIcon: { marginLeft: PixelPerfect(8), fontSize: PixelPerfect(16), color: '#8F9BB3' },
        infoText: { fontFamily: Fonts.regular, marginEnd:2, color: '#2E3A59', fontSize: PixelPerfect(14) },
        bullet: { fontFamily: Fonts.regular, color: '#2E3A59', fontSize: PixelPerfect(14), textAlign: 'right', marginBottom: PixelPerfect(6) }
        ,
        paragraph: {
            fontFamily: Fonts.regular,
            color: theme.black,
            lineHeight: PixelPerfect(22),
            fontSize: PixelPerfect(14),
        },

        bullets: {
            lineHeight: PixelPerfect(20),
            fontFamily: Fonts.regular,
            color: theme.black,
            fontSize: PixelPerfect(14),

            marginBottom: PixelPerfect(2)
        },
        listRow: {
            width: '100%',
            flexWrap: 'wrap',
            alignItems: 'center'
        },
        listPair: {
            alignItems: 'center',
            marginBottom: PixelPerfect(6)
        },
        listItem: {
            lineHeight: PixelPerfect(20),
            color: theme.black,
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(14),
            marginLeft: PixelPerfect(6)
        },
        separatorDot: {
            lineHeight: PixelPerfect(20),
            color: theme.black,
            fontSize: PixelPerfect(18),
            marginHorizontal: PixelPerfect(4)
        },


    })


