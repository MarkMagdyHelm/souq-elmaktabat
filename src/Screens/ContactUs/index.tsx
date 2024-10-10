import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { Container, Content } from '../../Components/containers/Containers'
import TabBar from '../../Components/TabBar/index';

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
    <Container showHint={false}
    fullBackground
    >
        <Content style={styles.formCon} noPadding >
            </Content>
            <TabBar/>
            </Container>
 )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
StyleSheet.create({
    formCon: {
        flex: 0.9,
        backgroundColor: theme.mainColor,
        paddingVertical: PixelPerfect(20),
        paddingHorizontal: PixelPerfect(20)
      },
})