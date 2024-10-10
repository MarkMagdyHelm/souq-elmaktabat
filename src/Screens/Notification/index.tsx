import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ThemeContext } from '../../Constants/theming';
import { PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';
import { Container } from '../../Components/containers/Containers';
import TabBar from '../../Components/TabBar/index';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import Notification from '../../Components/Cards/Notification';

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
 return (
    <Container showHint={false}>
        <HeaderWithText  title={t("Notifications")}/>
        <View style={styles.bodyCon}>
        <FlatList
              showsVerticalScrollIndicator={false}
            //   onRefresh={() =>{}}
            //   refreshing={isFetching}
              style={styles.list}
              data={items}
              keyExtractor={(items, index:number) => index.toString()}
              ItemSeparatorComponent={()=>(<View style={styles.separator}/>)}
              renderItem={item => {
                return (
                  <>
                   <Notification/>
                  </>
                );
              }}/>
        </View>
   <TabBar/>
</Container>
 )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
StyleSheet.create({
    bodyCon:{
        flex:0.8,
        backgroundColor:theme.mainColor,
    },
    list:{
    },
    separator:{
        height:PixelPerfect(1),
        backgroundColor:theme.border
    }
})