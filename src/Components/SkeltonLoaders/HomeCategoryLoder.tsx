import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants'
import { t } from 'i18next'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type Props = {
height?:number
}

const HomeCategoryLoder = (props: Props) => {
const {
  height
 } = props
const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
 const styles = useStyles(Fonts, theme, dark, dir);
 return (
    <SkeletonPlaceholder backgroundColor={Colors.sacandAppBackgroundColor}>
    <SkeletonPlaceholder.Item >
      <SkeletonPlaceholder.Item    height={height??PixelPerfect(60)}
        width={(phoneWidth-PixelPerfect(29))/2}
     marginBottom={8}
      borderRadius={PixelPerfect(5)} />

    </SkeletonPlaceholder.Item>
  </SkeletonPlaceholder>
 )
}

export default HomeCategoryLoder

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
StyleSheet.create({

   
    
})