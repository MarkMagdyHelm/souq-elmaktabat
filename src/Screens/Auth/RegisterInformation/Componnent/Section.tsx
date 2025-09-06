import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { IFont, ITheme } from "../../../../Constants/interfaces";
import { ThemeContext } from "../../../../Constants/theming";
import { Colors, PixelPerfect } from "../../../../Constants/styleConstants";
import { ArrowDownIcon, ArrowUpIcon } from "../../../../Assets/Svg";

interface SectionProps {
  title: string;
  step: number;
  activeStep: number | null;
  setActiveStep: (step: number | null) => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  onSubmmit?:()=>void
}

const Section: React.FC<SectionProps> = ({
  title,
  step,
  activeStep,
  setActiveStep,
  children,
  containerStyle,
  titleStyle,
  onSubmmit
}) => {
  const isActive = step === activeStep;
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
 const handleSubmmit = async() => {
          try {
             setActiveStep(isActive ? null : step)
           await new Promise((resolve) => setTimeout(resolve, 1000));
           onSubmmit?.();
          } catch (error) {
            
          }
         
        }
  return (
    <View style={[styles.section, containerStyle]}>
      {/* Header */}
      <TouchableOpacity
        style={[layout.rowBox,styles.header]}
        onPress={handleSubmmit}
      >
        <View style={[layout.rowBox,{alignItems:"center"}]}>
        <View style={[layout.center,styles.stepNumberCon]}>
        <Text style={[layout.textAlign,styles.stepNumber, ]}>
          {step}
        </Text>
        </View>
        <View style={{paddingHorizontal:PixelPerfect(2)}}/>
        <Text style={[layout.textAlign,styles.title, titleStyle]}>
          {title}
        </Text>
        </View>
        {isActive?<ArrowUpIcon/>:<ArrowDownIcon/>}
      </TouchableOpacity>

      {/* Collapsible Content */}
      <Collapsible collapsed={!isActive} duration={300}>
        <View style={styles.content}>{children}</View>
      </Collapsible>
    </View>
  );
};


const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string) =>
  StyleSheet.create({
  section: {
    borderRadius: PixelPerfect(12),
    backgroundColor: theme.grayLigth,
   paddingHorizontal:PixelPerfect(8),
   paddingVertical:PixelPerfect(16)
  },
  header: {
    alignItems: "center",
    padding: PixelPerfect(12),
    justifyContent:"space-between"
  },
  stepNumberCon:{
  width: PixelPerfect(26),
    height: PixelPerfect(26),
    borderRadius: PixelPerfect(13),
     backgroundColor:theme.textColor,
  },
  stepNumber: {
    textAlign: "center",
    lineHeight:Platform.OS=="ios"? PixelPerfect(30):PixelPerfect(25),
    color: Colors.white,
     fontSize: PixelPerfect(16),
     fontFamily:Fonts.medium,
     
  },
  title: {
    fontSize: PixelPerfect(18),
    fontFamily: Fonts.bold,
    color: theme.textColor,
  },
  activeText: {
    color: theme.textColor,
  },
  content: {
    padding:PixelPerfect(12),
    paddingTop: PixelPerfect(16),
  },
});

export default Section;
