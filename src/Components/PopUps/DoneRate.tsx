import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
  Modal
} from 'react-native';

import { DoneIcon, EyeIcon, StareIcon } from '../../Assets/Svg';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ThemeContext } from '../../Constants/theming';
import { PixelPerfect } from '../../Constants/styleConstants';

const DoneRate = ({ visible, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);
  const handleRating = (value) => setRating(value);

  const handleSave = () => {
    onSubmit({ rating, comment });
    onClose();
  };

  return (

    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>

        <View style={styles.container}>

          {/* Header */}
          <View style={[layout.center]}>
            <DoneIcon style ={{color:theme.babyBlue}}
        
             
   
            />
            <Text style={styles.title}>تم التقييم بنجاح</Text>

          </View>




        </View>


      </View>


    </Modal >

  );
};

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: "center",
      alignItems: 'center',
      paddingHorizontal: PixelPerfect(32)

    },
    container: {
      backgroundColor: theme.white,
      width: '100%',
      borderRadius: PixelPerfect(12),

      padding: PixelPerfect(64)
    },

    title: { textAlign: 'center', fontSize: PixelPerfect(20),paddingTop:PixelPerfect(16), fontFamily: Fonts.bold, color: theme.babyBlue },


  });
export default DoneRate;