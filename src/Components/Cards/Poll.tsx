import React, { useState, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated } from 'react-native';
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { Colors, ColorWithOpacity, phoneWidth, PixelPerfect } from '../../Constants/styleConstants';
import { PollIcon } from '../../Assets/Svg';
import { t } from 'i18next';

interface Option {
  id: number;
  option: string;
  votes: number;
  selected: boolean;
}

interface PollData {
  id: number;
  question: string;
  options: Option[];
  hasVoted: boolean;
  totalVotes: number;
}

interface PollProps {
  pollData: PollData;
  onVote: (pollId: number, newOptions: Option[], newTotalVotes: number) => void;
}

const Poll: React.FC<PollProps> = ({ pollData, onVote }) => {
  const [poll, setPoll] = useState<PollData>(pollData);
  const [isVoting, setisVoting] = useState(false)
  const progressAnimations = poll.options.map(() => useRef(new Animated.Value(0)).current);

  
//   const handleSelectOption = (optionId: number) => {
//     setPoll((prevPoll) => ({
//       ...prevPoll,
//       options: prevPoll.options.map((option) =>
//         option.id === optionId ? { ...option, selected: true ,votes: option.votes + 1} : { ...option, selected: false }
//       ),
//     }));
  
//   };
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);

  const handleSubmitVote = (optionId: number) => {
    setisVoting(true)
    if (poll.hasVoted) return; 

    const newOptions = poll.options.map((option) => {

        return  option.id === optionId ? { ...option, selected: true ,votes: option.votes + 1} : { ...option, selected: false };
  
      return option;
    });

    const newTotalVotes = newOptions.reduce((sum, option) => sum + option.votes, 0);

   
    newOptions.forEach((option, index) => {
      const votePercentage = option.votes / newTotalVotes;
      Animated.timing(progressAnimations[index], {
        toValue: votePercentage,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    });

    setPoll({ ...poll, options: newOptions, totalVotes: newTotalVotes, hasVoted: true });
    onVote(poll.id, newOptions, newTotalVotes);
  };


  const calculatePercentage = (votes: number): string => {
    if (poll.totalVotes === 0) return '0%';
    return dir === "rtl" ?
    `% ${((votes / poll.totalVotes) * 100).toFixed(0)}`
    :`${((votes / poll.totalVotes) * 100).toFixed(0)} %`;
  };

  const renderOption = ({ item, index }: { item: Option; index: number }) => {
    const progressWidth = progressAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });
   
    return (
      <View style={[styles.optionContainer]}>
             
        <TouchableOpacity
          style={[layout.rowBox,styles.optionContent, item.selected ? styles.selectedOption : null]}
          onPress={() => handleSubmitVote(item.id)}
          disabled={poll.hasVoted}  >
         
           
            <View style={[styles.radioButton,{ borderColor:item.selected ? theme.active : theme.gray}]}>
              {item.selected ? <View style={styles.radioButtonSelected} /> : null}
            </View>
          

         
          <View style={[layout.rowBox,styles.optionTextCon,!isVoting&&{ backgroundColor:theme.optionText,}]}>
          <Animated.View style={[styles.progressBarBackground, { width: progressWidth }]} />
          
          <Text style={[layout.textAlign,styles.optionText,{zIndex:5}]}>{item.option}
          </Text>
          {poll.hasVoted&&<Text 
          style={[layout.textAlign,styles.percentageText]}>{calculatePercentage(item.votes)}</Text>}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.pollContainer}>
        <View style={[layout.rowBox,styles.questionCON]}>
       <PollIcon/>
      <Text style={[layout.textAlign,styles.pollQuestion]}>{poll.question}</Text>
        </View>
      <FlatList
        data={poll.options}
        keyExtractor={(option) => option.id.toString()}
        renderItem={renderOption}
      />

      <View style={[layout.rowBox,styles.textCon]}>
           <Text style={styles.totalText}>{poll.totalVotes} {t("Votes")}</Text>
           <Text style={styles.totalText}>{"باقي 16 ساعه"}</Text>
      </View>
    </View>
  );
};

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
  pollContainer: {
    marginBottom: 20,
    paddingVertical: PixelPerfect(20),
    backgroundColor: Colors.white,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    borderColor:ColorWithOpacity(theme.black,0.2),
    borderWidth:1
  },
  questionCON:{
alignItems:"center",
paddingHorizontal:PixelPerfect(16)
  },
  pollQuestion: {
    paddingHorizontal:PixelPerfect(14),
    fontSize: PixelPerfect(18),
    color: theme.black,
   fontFamily:Fonts.regular,
   lineHeight:21.6
  },
  optionContainer: {
    marginVertical: 5,
    position: 'relative',
  },
  optionContent: {
    backgroundColor: 'transparent',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    position: 'relative',
  },
  selectedOption: {
    borderColor: theme.active,
  },
  optionTextCon:{
    height:PixelPerfect(39),
    width:phoneWidth-PixelPerfect(112),
    borderRadius:PixelPerfect(5),
    alignItems:"center",
    marginHorizontal:PixelPerfect(10),
    paddingHorizontal:PixelPerfect(5)
  },
  optionText: {
    fontSize: PixelPerfect(17),
    color: theme.black,
   fontFamily:Fonts.regular,
   lineHeight:19.2
  },
  percentageText: {
    fontSize: PixelPerfect(16),
    color: theme.black,
   fontFamily:Fonts.bold,
   lineHeight:19.2,
   paddingHorizontal:PixelPerfect(10)
  },
  progressBarBackground: {
    backgroundColor: theme.optionText,
    borderRadius: 5,
    height: '100%',
    position:"absolute"
  },
  radioButton: {
    height: PixelPerfect(32),
    width: PixelPerfect(32),
    borderRadius: PixelPerfect(32)/2,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    height: PixelPerfect(16),
    width: PixelPerfect(16),
    borderRadius: PixelPerfect(16)/2,
    backgroundColor: theme.active,
  },
  textCon:{
    alignItems:"center",
    paddingHorizontal:PixelPerfect(20),
    justifyContent:"space-between",
    marginBottom:PixelPerfect(10)
  },
  totalText:{
    fontSize: PixelPerfect(16),
    color: theme.textColor,
   fontFamily:Fonts.regular,
   lineHeight:19.2,
  }
});

export default Poll;
