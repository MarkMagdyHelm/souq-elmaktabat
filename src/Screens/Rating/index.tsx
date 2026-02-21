import { useRoute } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../Constants/theming";
import { useDispatch } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import { IFont, ITheme } from "../../Constants/interfaces";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Container, Content } from "../../Components/containers/Containers";
import HeaderWithText from "../../Components/Headers/HeaderWithText";
import { t } from "i18next";
import Stars from "../../Helper/Stars";
import { GrayRate, RateIcone } from "../../Assets/Svg";
import { PixelPerfect } from "../../Constants/styleConstants";
import { FlatList } from "react-native-gesture-handler";
import RateItem from "../../Components/Cards/RateItem";
import Space from "../../Helper/Space";
import { UserRate } from "../../Apis/Appinfo";
import useToastNotification from "../../Components/CustomHooks/useToastNotification";

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
      const [state, setState] = useState({
            loading: false,
            showSuccess: false,
            rete: {} as any,
      });
      const showToast = useToastNotification();
      const toast = useToast();
      const toastNotfication = (config: any) => {
            toast.hideAll();
            toast.show(config.message, {
                  type: config.type,
                  duration: 3000,
                  offset: 50,
                  animationType: "slide-in",
                  placement: "top",
            } as any);
      };

      useEffect(() => {
            getUserRate()
      }, [])


      const getUserRate = () => {
            setState(old => ({ ...old, loading: true }))
            dispatch<any>(UserRate((res, status) => {
                  if (res.status == 200) {
                        setState(old => ({ ...old, loading: false, rete: res.data }))

                  } else {
                        showToast({ type: 'error', message: res?.message ?? t("Something Went wrong") });
                  }
                  setState(old => ({ ...old, loading: false }))
            }))
      }

      return (
            <Container showHint={false}>
                  <HeaderWithText
                        title={t("Ratings")}
                        isShareVisible={false}
                  />

                  <Content style={styles.formCon} noPadding>

                        {/* Header */}
                        <View style={[styles.header]}>
                              <Text style={[layout.textAlign, styles.title]}>{t('Rate')} </Text>

                              {/* Overall Rating */}

                              <Stars rating={state?.rete?.mainRate} rateCount={state?.rete?.count} />

                              <Text style={[layout.textAlign, styles.countText]}>{state?.rete?.count}</Text>


                        </View>
                        <Space />
                        <FlatList
                              data={state?.rete?.rates}
                              keyExtractor={(item) => item.id + ""}
                              renderItem={({ item }) => (
                                    <RateItem  item={item} onPress={function (): void {
                                          throw new Error("Function not implemented.");
                                    }} />
                              )}
                        />


                  </Content>
            </Container>
      );
}
export default Index
const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
      StyleSheet.create({

            header: {
                  marginTop: PixelPerfect(16),
                  marginBottom: PixelPerfect(8),
                  alignItems: "center",
                  backgroundColor: theme.white,
            },
            formCon: {
                  flex: 1,
                  backgroundColor: theme.mainColor,

            },
            title: {
                  lineHeight: PixelPerfect(20),
                  fontSize: PixelPerfect(16),
                  fontFamily: Fonts.medium,
                  color: theme.textColor,
            },

            starsRow: {

                  marginTop: PixelPerfect(12),
                  gap: PixelPerfect(10),
            },
            countText: {
                  lineHeight: PixelPerfect(35),
                  fontSize: PixelPerfect(24),
                  color: theme.orange,
                  fontFamily: Fonts.regular,
                  marginTop: PixelPerfect(4),
            },

      })