import React, { useContext } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Container, Content } from '../../Components/containers/Containers'
import HeaderWithText from '../../Components/Headers/HeaderWithText'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import { Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants'
import { t } from 'i18next'

type Props = {
    navigation?: any
}

const Index = (props: Props) => {
    const { Fonts, layout, theme, dark } = useContext(ThemeContext)
    const styles = useStyles(Fonts, theme, dark)

    return (
        <Container showHint={false}>
            <Content style={styles.page} noPadding>
                <HeaderWithText title={t("sellerProfile")} />

                {/* Top card with avatar, name, rating and verified note */}
                <View style={styles.headerCard}>
                    <View style={styles.headerRow}>
                        {/* right side back */}
                        <Pressable style={styles.iconBtn}>
                            <Text style={styles.iconText}>←</Text>
                        </Pressable>
                        {/* left side share */}
                        <Pressable style={[styles.iconBtn, styles.shareBtn]}>
                            <Text style={styles.iconText}>↗</Text>
                        </Pressable>
                    </View>

                    {/* avatar, name, edit in one horizontal row */}
                    <View style={styles.nameRow}>
                        {/* With row-reverse, order children as: editBtn, nameCol, avatar to show: avatar | name | edit */}
                        <Pressable style={styles.editBtn}>
                            <Text style={styles.editIcon}>✎</Text>
                            <Text style={styles.editText}>{t("edit")}</Text>
                        </Pressable>
                        <View style={styles.nameCol}>
                            <Text style={styles.sellerName}>مكتبة النور</Text>
                            <Text style={styles.rating}>★★★★★ <Text style={styles.ratingCount}>(125)</Text></Text>
                        </View>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/200' }}
                            style={styles.avatar}
                        />
                    </View>

                    <Text style={styles.verified}>{t("accountPublished")}</Text>
                </View>

                {/* Stats row */}
                <View style={styles.statsRow}>
                    {[
                        { v: '10', l: t('ratingsCount') },
                        { v: '10', l: t('ordersCount') },
                        { v: '10', l: t('offersCount') },
                    ].map((s, i) => (
                        <View key={i} style={styles.statBox}>
                            <Text style={styles.statValue}>{s.v}</Text>
                            <Text style={styles.statLabel}>{s.l}</Text>
                        </View>
                    ))}
                </View>

                {/* Account info */}
                <View style={styles.block}>
                    <Text style={styles.blockTitle}>{t("accountInfo")}</Text>
                    <View style={styles.infoRow2}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoText}>email@gmail.com</Text>
                            <Text style={styles.infoIcon}>✉️</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoText}>01123456789</Text>
                            <Text style={styles.infoIcon}>📞</Text>
                        </View>
                    </View>
                </View>

                {/* About */}
                <View style={styles.block}>
                    <Text style={styles.blockTitle}>{t("aboutCompany")}</Text>
                    <Text style={styles.paragraph}>
                        {t("specializedIn")} {t("specializedIn")}
                    </Text>
                </View>

                {/* Tools - inline separated like design */}
                <View style={styles.block}>
                    <Text style={styles.blockTitle}>{t("companyTools")}</Text>
                    <View style={styles.listRow}>
                        {[t('paper'), t('inks'), t('photocopyMachines'), t('officeSupplies')].map((txt, idx, arr)=> (
                            <View key={idx} style={styles.listPair}>
                                <Text style={styles.listItem}>{txt}</Text>
                                {idx !== arr.length - 1 && <Text style={styles.separatorDot}>·</Text>}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Activity (outlined box) - inline separated */}
                <View style={[styles.block, styles.outlined]}> 
                    <Text style={styles.blockTitle}>{t("companyActivity")}</Text>
                    <View style={styles.listRow}>
                        {[t('libraries'), t('supplyCompanies'), t('printing')].map((txt, idx, arr)=> (
                            <View key={idx} style={styles.listPair}>
                                <Text style={styles.listItem}>{txt}</Text>
                                {idx !== arr.length - 1 && <Text style={styles.separatorDot}>·</Text>}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Payment methods */}
                <View style={styles.block}>
                    <Text style={styles.blockTitle}>{t("paymentMethods")}</Text>
                    <Text style={styles.bullets}>• {t("bankCard")}</Text>
                    <Text style={styles.bullets}>• {t("electronicWallets")}</Text>
                    <Text style={styles.bullets}>• {t("cashOnDelivery")}</Text>
                </View>
            </Content>
        </Container>
    )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean) =>
    StyleSheet.create({
        page: {
            flex: 1,
            backgroundColor: theme.mainColor,
            paddingHorizontal: PixelPerfect(16),
            paddingBottom: PixelPerfect(20)
        },
        headerCard: {
            backgroundColor: Colors.white,
            borderRadius: PixelPerfect(12),
            paddingVertical: PixelPerfect(14),
            alignItems: 'center',
            marginBottom: PixelPerfect(12)
        },
        headerRow: {
            width: '100%',
            paddingHorizontal: PixelPerfect(12),
            flexDirection: 'row-reverse',
            justifyContent: 'space-between'
        },
        iconBtn: {
            width: PixelPerfect(40),
            height: PixelPerfect(28),
            alignItems: 'center',
            justifyContent: 'center'
        },
        shareBtn: {
        },
        iconText: {
            color: '#222',
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(16)
        },
        avatar: {
            width: PixelPerfect(70),
            height: PixelPerfect(70),
            borderRadius: PixelPerfect(35),
            marginBottom: PixelPerfect(8)
        },
        nameRow: {
            width: '100%',
            paddingHorizontal: PixelPerfect(16),
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: PixelPerfect(4)
        },
        nameCol: {
            alignItems: 'flex-end',
            marginRight: PixelPerfect(6)
        },
        sellerName: {
            fontFamily: Fonts.bold,
            color: theme.active,
            fontSize: PixelPerfect(20)
        },
        rating: {
            marginTop: PixelPerfect(4),
            color: '#FFA800',
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(14)
        },
        ratingCount: {
            color: '#8F9BB3',
            fontFamily: Fonts.regular
        },
        verified: {
            marginTop: PixelPerfect(6),
            color: theme.active,
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(14)
        },
        editBtn: {
            alignSelf: 'center',
            marginTop: 0,
            marginLeft: PixelPerfect(8),
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.active,
            borderRadius: PixelPerfect(10),
            paddingHorizontal: PixelPerfect(10),
            paddingVertical: PixelPerfect(6),
            backgroundColor: Colors.white
        },
        editIcon: {
            color: theme.active,
            marginRight: PixelPerfect(6),
            fontFamily: Fonts.medium
        },
        editText: {
            color: theme.active,
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(14)
        },
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: PixelPerfect(12)
        },
        statBox: {
            width: (phoneWidth - PixelPerfect(32)) / 3,
            backgroundColor: Colors.white,
            borderRadius: PixelPerfect(12),
            alignItems: 'center',
            paddingVertical: PixelPerfect(12),
            // subtle shadow like card
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: PixelPerfect(6),
            shadowOffset: { width: 0, height: 2 },
            elevation: 2
        },
        statValue: {
            fontFamily: Fonts.bold,
            color: theme.active,
            fontSize: PixelPerfect(16)
        },
        statLabel: {
            marginTop: PixelPerfect(4),
            fontFamily: Fonts.regular,
            color: theme.deactive,
            fontSize: PixelPerfect(12)
        },
        block: {
            backgroundColor: Colors.white,
            borderRadius: PixelPerfect(12),
            paddingVertical: PixelPerfect(12),
            paddingHorizontal: PixelPerfect(14),
            marginBottom: PixelPerfect(12)
        },
        outlined: {
            borderWidth: 0,
            backgroundColor: Colors.white
        },
        blockTitle: {
            fontFamily: Fonts.medium,
            color: theme.active,
            fontSize: PixelPerfect(16),
            marginBottom: PixelPerfect(10)
        },
        paragraph: {
            fontFamily: Fonts.regular,
            color: '#2E3A59',
            lineHeight: PixelPerfect(22)
        },
        inlineList: {
            fontFamily: Fonts.regular,
            color: '#2E3A59',
            fontSize: PixelPerfect(14)
        },
        bullets: {
            fontFamily: Fonts.regular,
            color: '#2E3A59',
            fontSize: PixelPerfect(14),
            textAlign: 'right',
            marginBottom: PixelPerfect(2)
        },
        listRow:{
            width:'100%',
            flexDirection:'row-reverse',
            flexWrap:'wrap',
            alignItems:'center'
        },
        listPair:{
            flexDirection:'row-reverse',
            alignItems:'center',
            marginBottom: PixelPerfect(6)
        },
        listItem:{
            color:'#2E3A59',
            fontFamily:Fonts.regular,
            fontSize:PixelPerfect(14),
            marginLeft: PixelPerfect(6)
        },
        separatorDot:{
            color:'#2E3A59',
            fontSize: PixelPerfect(18),
            marginHorizontal: PixelPerfect(4)
        },
        infoRow: {
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: PixelPerfect(10)
        },
        infoRow2: {
            flexDirection: 'row-reverse',
            alignItems: 'stretch',
            justifyContent: 'space-between'
        },
        infoItem: {
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'transparent',
            borderWidth: 0,
            paddingHorizontal: PixelPerfect(4),
            paddingVertical: PixelPerfect(4),
            width: '48%'
        },
        infoIcon: {
            marginLeft: PixelPerfect(8),
            fontSize: PixelPerfect(16),
            color: '#8F9BB3'
        },
        infoText: {
            fontFamily: Fonts.regular,
            color: '#2E3A59',
            fontSize: PixelPerfect(14)
        }
    })


