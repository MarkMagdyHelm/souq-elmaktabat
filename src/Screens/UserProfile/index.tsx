import React, { useContext } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Container, Content } from '../../Components/containers/Containers'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import { Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants'
import { t } from 'i18next'

type Props = {
    navigation?: any
}

const Index = (props: Props) => {
    const { Fonts, theme } = useContext(ThemeContext)
    const styles = useStyles(Fonts, theme)

    return (
        <Container showHint={false}>
            <Content style={styles.page} noPadding>
                {/* Top white card */}
                <View style={styles.headerCard}>
                    {/* top row: share, back */}
                    <View style={styles.headerRow}>
                        <Pressable style={styles.iconBtn}><Text style={styles.iconText}>↗</Text></Pressable>
                        <Pressable style={styles.iconBtn}><Text style={styles.iconText}>←</Text></Pressable>
                    </View>

                    {/* name block: edit | name & rating | avatar */}
                    <View style={styles.nameRow}>
                        <Pressable style={styles.editBtn}>
                            <Text style={styles.editIcon}>✎</Text>
                            <Text style={styles.editText}>{t("edit")}</Text>
                        </Pressable>

                        <View style={styles.nameCol}>
                            <Text style={styles.userName}>احمد محمد</Text>
                            <View style={styles.ratingRow}>
                                <Text style={styles.ratingCount}>(125)</Text>
                                <Text style={styles.stars}>★★★★★</Text>
                            </View>
                        </View>

                        <Image source={{ uri: 'https://i.pravatar.cc/200' }} style={styles.avatar} />
                    </View>
                </View>

                {/* Stats: two cards */}
                <View style={styles.statsRow}>
                    {[{ v: '10', l: t('ordersCountText') }, { v: '10', l: t('ratingsCountText') }].map((s, i) => (
                        <View key={i} style={styles.statBox}>
                            <Text style={styles.statValue}>{s.v}</Text>
                            <Text style={styles.statLabel}>{s.l}</Text>
                        </View>
                    ))}
                </View>

                {/* Account info block */}
                <View style={styles.block}>
                    <Text style={styles.blockTitle}>{t("accountInfo")}</Text>
                    <View style={styles.infoRow}><Text style={styles.infoIcon}>📞</Text><Text style={styles.infoText}>01123456789</Text></View>
                    <View style={styles.infoRow}><Text style={styles.infoIcon}>✉️</Text><Text style={styles.infoText}>email@gmail.com</Text></View>
                    <View style={styles.infoRow}><Text style={styles.infoIcon}>🗺️</Text><Text style={styles.infoText}>{t("cairo")} - {t("ainShams")}</Text></View>
                </View>

                {/* Interested markets */}
                <View style={styles.block}>
                    <Text style={styles.blockTitle}>{t("interestedMarkets")}</Text>
                    {[t('paper'), t('inks'), t('printing')].map((txt, idx)=> (
                        <Text key={idx} style={styles.bullet}>· {txt}</Text>
                    ))}
                </View>
            </Content>
        </Container>
    )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme) =>
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
            paddingVertical: PixelPerfect(12),
            paddingHorizontal: PixelPerfect(16),
            marginBottom: PixelPerfect(16)
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: PixelPerfect(6)
        },
        iconBtn: { width: PixelPerfect(36), height: PixelPerfect(28), alignItems: 'center', justifyContent: 'center' },
        iconText: { color: '#222', fontFamily: Fonts.medium, fontSize: PixelPerfect(16) },
        nameRow: {
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        avatar: { width: PixelPerfect(64), height: PixelPerfect(64), borderRadius: PixelPerfect(32), marginRight: PixelPerfect(8) },
        nameCol: { alignItems: 'flex-end', marginRight: PixelPerfect(4), flexShrink: 1 },
        userName: { fontFamily: Fonts.bold, color: theme.active, fontSize: PixelPerfect(20) },
        ratingRow: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: PixelPerfect(2) },
        stars: { color: '#FFA800', fontFamily: Fonts.medium, fontSize: PixelPerfect(14), marginLeft: PixelPerfect(4) },
        ratingCount: { color: '#8F9BB3', fontFamily: Fonts.regular },
        editBtn: {
            borderWidth: 1,
            borderColor: theme.active,
            borderRadius: PixelPerfect(10),
            paddingHorizontal: PixelPerfect(14),
            paddingVertical: PixelPerfect(7),
            backgroundColor: Colors.white,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 0,
            marginRight: 'auto'
        },
        editIcon: { color: theme.active, marginRight: PixelPerfect(6), fontFamily: Fonts.medium },
        editText: { color: theme.active, fontFamily: Fonts.medium, fontSize: PixelPerfect(14) },

        statsRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: PixelPerfect(16) },
        statBox: {
            width: (phoneWidth - PixelPerfect(32) - PixelPerfect(12)) / 2,
            backgroundColor: Colors.white,
            borderRadius: PixelPerfect(12),
            alignItems: 'center',
            paddingVertical: PixelPerfect(14),
            shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: PixelPerfect(6), shadowOffset: { width: 0, height: 2 }, elevation: 2
        },
        statValue: { fontFamily: Fonts.bold, color: theme.active, fontSize: PixelPerfect(16) },
        statLabel: { marginTop: PixelPerfect(4), fontFamily: Fonts.regular, color: '#8F9BB3', fontSize: PixelPerfect(12) },

        block: { backgroundColor: Colors.white, borderRadius: PixelPerfect(12), paddingVertical: PixelPerfect(14), paddingHorizontal: PixelPerfect(16), marginBottom: PixelPerfect(12) },
        blockTitle: { fontFamily: Fonts.medium, color: theme.active, fontSize: PixelPerfect(16), marginBottom: PixelPerfect(12), textAlign: 'right' },
        infoRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-start', marginBottom: PixelPerfect(12) },
        infoIcon: { marginLeft: PixelPerfect(8), fontSize: PixelPerfect(16), color: '#8F9BB3' },
        infoText: { fontFamily: Fonts.regular, color: '#2E3A59', fontSize: PixelPerfect(14) },
        bullet: { fontFamily: Fonts.regular, color: '#2E3A59', fontSize: PixelPerfect(14), textAlign: 'right', marginBottom: PixelPerfect(6) }
    })


