import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import Modal from 'react-native-modal';


type Props = {
   onCloseFn:(val:any)=>void,
   currentFilter:any,
   title:string,
   items:any
}

const FilterOrder = (props: Props) => {
    const {
        onCloseFn,
        currentFilter,
        title,
        items
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const [state, setstate] = useState({
        items:items,
        selectFilter:currentFilter
    })
    console.log('=============currentFilter=======================');
    console.log(currentFilter);
    console.log('====================================');
    useEffect(() => {
    // handelCurrentFiltter()
    }, [])
   const handelCurrentFiltter = ()=>{
    if (currentFilter.name.length !=0) {
        let res = state.items.map(el=>{
            if (currentFilter.name == el.name) {
                el.flag = true;
            }else{
                el.flag = false;
            }
            return el;
        })
        setstate(old=>({...old,items:res}))
    }
   }
    const handelCheck = (index)=>{
        let res = state.items
        // res[index].flag = true;
        setstate(old=>({...old,items:res,selectFilter: res[index]}))
        setTimeout(() => {
            onCloseFn&&onCloseFn(res[index])
        }, 300);
     }
    return (
        <Modal
           backdropOpacity={0.2}
        //    backdropColor='#00000'
        onBackButtonPress={()=>onCloseFn&&onCloseFn({})}
        onBackdropPress={()=>onCloseFn&&onCloseFn({})}
            isVisible={true}
            style={{margin:0,justifyContent:"flex-end"}}
        >
           <View style={[styles.con]}>
              <Text style={styles.title}>{title}</Text>
           <View>
            {
                 state.items.map((el:any,index:number)=>(
                    <Pressable key={index} style={[layout.rowBox,styles.filterCon]} onPress={()=>{handelCheck(index)}}>
                     
                      <Text style={styles.filterText}>{t(el.Name)}</Text>
                    </Pressable>
                 ))
            }
           </View>
           </View>
        </Modal>
    )
}

export default FilterOrder

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        con:{
            backgroundColor:Colors.white,
            borderTopRightRadius:PixelPerfect(8),
            borderTopLeftRadius:PixelPerfect(8),
            paddingHorizontal:PixelPerfect(24),
            paddingVertical:PixelPerfect(20)
        },
        title:{
            fontFamily:Fonts.bold,
            fontSize:PixelPerfect(20),
            color:theme.textColor,
            marginBottom:PixelPerfect(20),
            textAlign:dir=="rtl"?"right":"left",
        },
        filterCon:{
            alignItems:"center",
            marginBottom:PixelPerfect(19),
           
        },
        checkCon:{
            width:PixelPerfect(20),
            height:PixelPerfect(20),
            borderRadius:PixelPerfect(20)/2,
            borderWidth:PixelPerfect(1),
            borderColor:theme.black,
          alignItems:"center",
          justifyContent:"center"
        },
        check:{
            width:PixelPerfect(12),
            height:PixelPerfect(12),
            borderRadius:PixelPerfect(12)/2,
            backgroundColor:theme.mainColor,
        },
        filterText:{
            fontFamily:Fonts.medium,
            fontSize:PixelPerfect(18),
            color:theme.black,
            paddingHorizontal:PixelPerfect(20)
        }
    })