import React, { useContext, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Container, Content } from '../../Components/containers/Containers'
import HeaderWithText from '../../Components/Headers/HeaderWithText'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import { Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants'
import Product from '../../Components/Cards/Product'

type Props = { navigation?: any }

const Index = ({ navigation }: Props) => {
    const { Fonts, theme } = useContext(ThemeContext)
    const styles = useStyles(Fonts, theme)

    const [tab, setTab] = useState<'offers' | 'sellers'>('offers')

    // demo data
    const products = Array.from({ length: 6 }).map((_, i) => ({ id: `p${i}`, name: 'ورق A4 جم80', price: '500', seller: 'مكتبة وصفه', image: '' }))
    const sellers = Array.from({ length: 3 }).map((_, i) => ({ id: `s${i}`, name: 'مكتبة النور', city: 'مصر', area: 'القاهرة', rating: 5, ratingCount: 125, items: 67 }))

    return (
        <Container showHint={false}>
            <Content style={styles.page} noPadding>
                <HeaderWithText title={'القائمة المفضلة'} />

                {/* Tabs */}
                <View style={styles.tabsRow}>
                    <Pressable style={[styles.tab, tab === 'offers' ? styles.tabActive : styles.tabInactive]} onPress={() => setTab('offers')}>
                        <Text style={[styles.tabText, tab === 'offers' ? styles.tabTextActive : styles.tabTextInactive]}>العروض</Text>
                    </Pressable>
                    <Pressable style={[styles.tab, tab === 'sellers' ? styles.tabActive : styles.tabInactive]} onPress={() => setTab('sellers')}>
                        <Text style={[styles.tabText, tab === 'sellers' ? styles.tabTextActive : styles.tabTextInactive]}>البائعين</Text>
                    </Pressable>
                </View>

                {tab === 'offers' ? (
                    <FlatList
                        key={`list-${tab}`}
                        data={products}
                        numColumns={2}
                        keyExtractor={(item) => item.id}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        renderItem={({ item }) => (
                            <View style={styles.cardWrap}>
                                <Product item={item as any} onPress={() => { }} />
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled
                    />
                ) : (
                    <FlatList
                        key={`list-${tab}`}
                        data={sellers}
                        numColumns={2}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.sellerCard}>
                                <View style={styles.sellerHeader}>
                                    <Text style={styles.heart}>♥</Text>
                                    <Text style={styles.sellerName}>{item.name}</Text>
                                    <Text style={styles.location}>{item.area} / {item.city}</Text>
                                </View>
                                <View style={styles.sellerBody}>
                                    <Text style={styles.ratingCount}>({item.ratingCount})</Text>
                                    <Text style={styles.stars}>★★★★★</Text>
                                </View>
                                <Text style={styles.desc}>متخصصون في ورق الطباعة والكتابة عالي الجودة</Text>
                                <Text style={styles.count}>67 : المنتجات عدد</Text>
                                <Pressable style={styles.detailsBtn}><Text style={styles.detailsText}>عرض التفاصيل</Text></Pressable>
                            </View>
                        )}
                        ItemSeparatorComponent={() => <View style={{ height: PixelPerfect(12) }} />}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled
                    />
                )}
            </Content>
        </Container>
    )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme) => StyleSheet.create({
    page: { flex: 1, backgroundColor: theme.mainColor, paddingHorizontal: PixelPerfect(16), paddingBottom: PixelPerfect(20) },
    tabsRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: PixelPerfect(12) },
    tab: { flex: 1, height: PixelPerfect(40), borderRadius: PixelPerfect(10), alignItems: 'center', justifyContent: 'center' },
    tabActive: { backgroundColor: theme.active },
    tabInactive: { backgroundColor: '#D9D9D9' },
    tabText: { fontFamily: Fonts.medium, fontSize: PixelPerfect(16) },
    tabTextActive: { color: Colors.white },
    tabTextInactive: { color: '#2E3A59' },

    cardWrap: { width: (phoneWidth - PixelPerfect(32)) / 2, marginBottom: PixelPerfect(12) },

    sellerCard: { backgroundColor: Colors.white, borderRadius: PixelPerfect(12), padding: PixelPerfect(12), shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: PixelPerfect(6), shadowOffset: { width: 0, height: 2 }, elevation: 2 },
    sellerHeader: { flexDirection: 'row-reverse', alignItems: 'center' },
    heart: { color: theme.active, marginLeft: PixelPerfect(6) },
    sellerName: { color: theme.active, fontFamily: Fonts.medium, fontSize: PixelPerfect(16), marginLeft: PixelPerfect(6) },
    location: { color: '#8F9BB3', fontFamily: Fonts.regular, fontSize: PixelPerfect(12) },
    sellerBody: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: PixelPerfect(6) },
    stars: { color: '#FFA800', marginLeft: PixelPerfect(6) },
    ratingCount: { color: '#8F9BB3' },
    desc: { textAlign: 'center', color: '#2E3A59', marginTop: PixelPerfect(8) },
    count: { textAlign: 'center', color: theme.active, marginTop: PixelPerfect(6) },
    detailsBtn: { marginTop: PixelPerfect(10), backgroundColor: theme.active, borderRadius: PixelPerfect(10), height: PixelPerfect(36), alignItems: 'center', justifyContent: 'center' },
    detailsText: { color: Colors.white, fontFamily: Fonts.medium }
})


