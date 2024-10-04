import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { Container } from '../../Components/containers/Containers'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import { CoinsIcon, ElectricIcon, PlusIcon, PrescriptionIcon } from '../../Assets/Svg'
import { t } from 'i18next'
import { ColorWithOpacity, Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants'
import TabBar from '../../Components/TabBar/index';
import Category from '../../Components/Cards/Category';
import Appointment from  '../../Components/Cards/Appointment';
let items = [{flag:false},{flag:true},{flag:false},{flag:false},{flag:false},{flag:false}]
type Props = {
    navigation: any
}

const Index = (props: Props) => {
    const {
        navigation
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    return (
        <Container showHint={false}>
            <View style={[{ flex: 0.26, backgroundColor: theme.bodyBackground }]}>
                <View style={[layout.dirRow,styles.welcomCon]}>
                    <ElectricIcon />
                    <View>
                        <Text style={styles.welcomText}>{t('Good morning,')}</Text>
                        <Text style={styles.nameText}>{t('Albert Emil')}</Text>
                    </View>
                </View>
                <View style={[layout.rowBox,styles.pointsCon]}>
               <Pressable style={[layout.rowBox,styles.CoinsCon]}>
                <CoinsIcon/>
                <Text style={styles.PointsText}>3200<Text style={[styles.PointsText,{fontFamily:Fonts.bold}]}> {t('Point')}</Text></Text>
               </Pressable>
               <Pressable style={[layout.rowBox,styles.CoinsCon]}>
               <Text style={styles.PointsText}>280<Text style={[styles.PointsText,{fontFamily:Fonts.bold,fontSize:PixelPerfect(12)}]}>{t('LE')}</Text></Text>
                <PlusIcon/>
               </Pressable>
            </View>
            </View>
           <View style={styles.bodyCon}>
             <View style={[layout.rowBox,styles.presCon]}>
               <PrescriptionIcon/>
               <View style={styles.presTextsCon}>
                <Text style={styles.presText1}>{t('Send prescription')}</Text>
                <Text style={styles.presText2}>{t('Now you can send  prescription !')}</Text>
               </View>
             </View>
             <View style={styles.categoriesCon}>
                <Text style={styles.categoriesTitle}>{t("Categories")}</Text>
                <View>
                <FlatList
              showsVerticalScrollIndicator={false}
            //   onRefresh={() =>{}}
            //   refreshing={isFetching}
            columnWrapperStyle={{justifyContent:"space-between"}}
              style={styles.list}
              data={items}
              numColumns={3}
              keyExtractor={(items, index:number) => index.toString()}
              renderItem={item => {
                return (
                  <>
                    <Category/>
                  </>
                );
              }}/>
                </View>
             </View>
             <View style={[styles.categoriesCon,{paddingHorizontal:0,paddingLeft:PixelPerfect(20)}]}>
                <Text style={styles.categoriesTitle}>{t("Upcoming appointments")}</Text>
                <View>
                <FlatList
              showsVerticalScrollIndicator={false}
            //   onRefresh={() =>{}}
            //   refreshing={isFetching}
            ItemSeparatorComponent={()=>(<View style={{width:PixelPerfect(10)}}/>)}
               horizontal
              style={styles.list}
              data={items}
              keyExtractor={(items, index:number) => index.toString()}
              renderItem={({item}) => {
                return (
                  <>
                    <Appointment item={item}/>
                  </>
                );
              }}/>
                </View>
             </View>
           </View>
           <TabBar/>
        </Container>
    )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
StyleSheet.create({
    welcomCon:{
        alignItems:"center",
        justifyContent:"space-between",
        paddingRight:PixelPerfect(20),
    },
    welcomText:{
        color: theme.inputTextColor,
        fontSize: PixelPerfect(14),
        fontFamily: Fonts.regular,
        marginBottom:PixelPerfect(5)
    },
   nameText:{
        color: Colors.white,
        fontSize: PixelPerfect(28),
        fontFamily: Fonts.bold,
        marginTop:PixelPerfect(5)
    },
    pointsCon:{
        alignSelf:"center",
        backgroundColor:ColorWithOpacity(Colors.white,0.1),
        paddingHorizontal:PixelPerfect(10),
        alignItems:"center",
        justifyContent:"space-between",
        height:PixelPerfect(49),
        borderRadius:PixelPerfect(8),
        marginHorizontal:PixelPerfect(20),
        width:phoneWidth-PixelPerfect(40)
    },
    PointsText:{
        paddingHorizontal:PixelPerfect(7),
        color: Colors.white,
        fontSize: PixelPerfect(18),
        fontFamily: Fonts.medium,
    },
    CoinsCon:{
        alignItems:"center"
    },
    bodyCon:{
        flex:0.66,
        backgroundColor:theme.secondColor,
        alignItems:"center",
        paddingTop:PixelPerfect(20)
    },
    presCon:{
        backgroundColor:Colors.white,
        borderRadius:PixelPerfect(8),
        height:PixelPerfect(82),
        width:phoneWidth-PixelPerfect(40),
        paddingHorizontal:PixelPerfect(20),
        paddingVertical:PixelPerfect(10),
        alignItems:"center"
    },
    presTextsCon:{
     paddingHorizontal:PixelPerfect(20)
    },
    presText1:{
        color: theme.labelText,
        fontSize: PixelPerfect(18),
        fontFamily: Fonts.medium,
    },
    presText2:{
        color: theme.inputTextColor,
        fontSize: PixelPerfect(12),
        fontFamily: Fonts.regular,
        marginTop:PixelPerfect(5)
    },
    categoriesCon:{
        paddingHorizontal:PixelPerfect(20),
        width:"100%"
    },
    categoriesTitle:{
        color: theme.labelText,
        fontSize: PixelPerfect(18),
        fontFamily: Fonts.medium,
        marginVertical:PixelPerfect(15),
    },
    list:{

    }
});