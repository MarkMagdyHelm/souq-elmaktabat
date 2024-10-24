import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ThemeContext } from '../../Constants/theming';
import { PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';
import { Container } from '../../Components/containers/Containers';
import TabBar from '../../Components/TabBar/index';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import Notification from '../../Components/Cards/Notification';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import { GetAllNotificationsHandler } from '../../Apis/Notification';
import PollLoader from '../../Components/SkeltonLoaders/PollLoader';

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
 const dispatch = useDispatch();
 const [state, setstate] = useState({
    loading:false,
    items : [{flag:false},{flag:false},{flag:false},{flag:false},,{flag:false}]

 });
 const toast = useToast();
 const toastNotfication = (config:any) => {
     toast.hideAll();
     toast.show(config.message, {
         type: config.type,
         duration: 3000,
         offset: 50,
         animationType: 'slide-in',
         placement: 'top',
     } as any);
 }
 useEffect(() => {
  getNotifications()
 }, []);
 
 const getNotifications = ()=>{
   setstate(old=>({...old,loading:true}))
  dispatch<any>(GetAllNotificationsHandler({},(res,status)=>{
    if (res.status == 200) {
     setstate(old=>({...old,items:res.data}));
    }else{
     toastNotfication({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
    }
    setstate(old=>({...old,loading:false}));
  }))
 };
const handlePress =(item)=>{
  switch (item.type) {
    case 0:
      navigation.navigate("Home");
      break;
      case 1:
        navigation.navigate("Home")
      break;
      case 2:
        navigation.navigate("Polls")
      break;
  
    default:
      break;
  }
}
 return (
    <Container showHint={false}>
        <HeaderWithText  title={t("Notifications")}/>
        <View style={styles.bodyCon}>
        <FlatList
              showsVerticalScrollIndicator={false}
            //   onRefresh={() =>{}}
            //   refreshing={isFetching}
              style={styles.list}
              data={state.items}
              keyExtractor={(items, index:number) => index.toString()}
              ItemSeparatorComponent={()=>(state.loading?null:<View style={styles.separator}/>)}
              renderItem={({item}) => {
                return (
                  <>
                  {/* {state.loading?
                  <PollLoader height={70}/> */}
                  {/* :  */}
                  <Notification loading={state.loading} item={item} onPress={()=>handlePress(item)}/>
                  {/* } */}
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