import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import { Container } from '../../Components/containers/Containers'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import { t } from 'i18next'
import { ColorWithOpacity, Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants'
import TabBar from '../../Components/TabBar/index';
import Category from '../../Components/Cards/Category';
import { CallIcon, PaperIcon, SharIcon } from '../../Assets/Svg'
import moment from 'moment';
import 'moment/locale/ar'  // without this line it didn't work
import  ViewShot  from "react-native-view-shot";
import Share from 'react-native-share';

let items = [{flag:false},{flag:true},{flag:false},{flag:false},{flag:false},{flag:false},{flag:false},{flag:true},{flag:false},{flag:false},{flag:false},{flag:false},,{flag:false}]
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
    const handleScreenShot = ()=>{
      ref.current.capture().then((uri:any) => {
        Share.open({url:uri})
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    err && console.log(err);
  });
        console.log("do something with ", uri);
      });
    }
    return (
      <ViewShot style={{flex:1}} ref={ref} options={{ fileName: "Your-File-Name", format: "jpg", quality: 0.9 }}>
        <Container showHint={false}>
           <View style={styles.bodyCon}>

              <View style={[layout.rowBox,styles.section1]}>
              <PaperIcon/>
              <Text style={styles.textsection1}>{t("hometext1")}</Text>
              </View>

              <View style={[layout.rowBox,styles.section2]}>
                <View style={[layout.rowBox,]}>
              <CallIcon/>
              <Text style={styles.textsection2}>{moment().locale("ar").format('dddd')} {moment().locale("en").format('DD-MM-YYYY')}</Text>
                </View>
                <Pressable style={[layout.rowBox,styles.sharButton]}
                onPress={handleScreenShot}
                >
                  <SharIcon/>
                  <Text style={styles.sharText}>{t('Share')}</Text>
                </Pressable>
              </View>
              <View style={styles.listCon}>
              <FlatList
              showsVerticalScrollIndicator={false}
            //   onRefresh={() =>{}}
            //   refreshing={isFetching}
            columnWrapperStyle={{justifyContent:"space-between"}}
              style={styles.list}
              data={items}
              numColumns={2}
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
           <TabBar/>
        </Container>
        </ViewShot>
    )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
StyleSheet.create({
   
    bodyCon:{
        flex:0.9,
        backgroundColor:theme.mainColor,
        paddingTop:PixelPerfect(18),
        paddingHorizontal:PixelPerfect(10)
    },
    section1:{
      alignItems:"center",
      flex:0.05
    },
    textsection1:{
      fontFamily:Fonts.bold,
      color:theme.active,
      paddingHorizontal:PixelPerfect(8),
      fontSize:PixelPerfect(22)
    },
    section2:{
      alignItems:"center",
      marginTop:PixelPerfect(15),
      justifyContent:"space-between",
      flex:0.05
    },
    textsection2:{
      fontFamily:Fonts.regular,
      // fontWeight:"700",
      color:theme.textColor,
      paddingHorizontal:PixelPerfect(8),
      fontSize:PixelPerfect(20),
      lineHeight:24
    },
    sharButton:{
      padding:PixelPerfect(10),
      height:PixelPerfect(40),
      width:PixelPerfect(100),
      borderRadius:PixelPerfect(8),
      borderColor:theme.active,
      borderWidth:PixelPerfect(1),
      alignItems:"center",
      justifyContent:"space-between"
    },
    sharText:{
      fontFamily:Fonts.bold,
      color:theme.active,
      fontSize:PixelPerfect(16),
      lineHeight:22
    },
    listCon:{
      flex:0.9,
      paddingVertical:PixelPerfect(15),
    },
    list:{

    }
});