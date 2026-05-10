import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated } from 'react-native';
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { Colors, ColorWithOpacity, phoneWidth, PixelPerfect } from '../../Constants/styleConstants';
import { PollIcon } from '../../Assets/Svg';
import { t } from 'i18next';

interface Option {
  id: number;
  option: string;
  totalVotes: number;
  selected: boolean;
}

interface PollData {
  hasVoted: boolean;
  options: Option[];
  id: number;
  question: string;
  totalVotes: number;
  remainingTime:any
}

interface PollProps {
  pollData: PollData;
  onVote: (pollId: number, newOptions: Option[], newTotalVotes: number, optionId: number,previousChoice:number,isVotedPoll:boolean) => void;
}

const Poll: React.FC<PollProps> = ({ pollData, onVote }) => {
  const [poll, setPoll] = useState<PollData>(
    pollData || { id: 0, question: '', options: [], hasVoted: false, totalVotes: 0,remainingTime:0 }
  );
  const [isVoting, setIsVoting] = useState(false);
  const [previousChoice, setPreviousChoice] = useState<number | null>(null);

  // Initialize refs for animations outside of the map function
  const progressAnimations = useRef<Animated.Value[]>([]);

  useEffect(() => {
    // Initialize the poll and animation values
    if (pollData) {
      setPoll(pollData);
      setIsVoting(pollData.hasVoted);
      
      // Initialize progress animations if the length changes
      if (progressAnimations.current.length !== pollData.options.length) {
        progressAnimations.current = pollData.options.map(() => new Animated.Value(0));
      }

      // Trigger animations if the poll has been voted
      if (pollData.hasVoted) {
        animateProgressBars(pollData.options, pollData.totalVotes);
      }
      const selectedOption = pollData.options.find((option) => option.selected);
      if (selectedOption) {
        setPreviousChoice(selectedOption.id);
      }
    }
  }, [pollData]);

  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styles = useStyles(Fonts, theme, dark, dir);

  const handleSubmitVote = (newOptionId: number) => {
    if (newOptionId === previousChoice) return;

    setIsVoting(true);

    const newOptions = poll.options.map((option) => {
      if (option.id === previousChoice) {
        return { ...option, selected: false, totalVotes: Math.max(0, option.totalVotes - 1) };
      }
      if (option.id === newOptionId) {
        return { ...option, selected: true, totalVotes: (option.totalVotes || 0) + 1 };
      }
      return option;
    });

    const newTotalVotes = newOptions.reduce((sum, option) => sum + (option.totalVotes || 0), 0);

    setPoll({ ...poll, options: newOptions, totalVotes: newTotalVotes, hasVoted: true });
    setPreviousChoice(newOptionId);
    onVote(poll.id, newOptions, newTotalVotes, newOptionId, previousChoice,poll.hasVoted);

    animateProgressBars(newOptions, newTotalVotes);
  };

  const animateProgressBars = useCallback((options: Option[], totalVotes: number) => { 
    // console.log('Animating progress bars'); // Debugging 
    options.forEach((option, index) => { 
      const votePercentage = totalVotes > 0 ? option.totalVotes / totalVotes : 0; 
      // console.log(`Animating option ${option.id} with votePercentage: ${votePercentage}`); // Debugging

      Animated.timing(progressAnimations.current[index], { 
        toValue: votePercentage, 
        duration: 1000, 
        useNativeDriver: false, 
      }).start(() => { 
        // console.log(`Animation completed for option ${option.id}`); 
      }); 
    }); 
  }, []);

  const calculatePercentage = (votes: number): string => {
    if (poll.totalVotes === 0) return '0%';
    const percentage = (votes / poll.totalVotes) * 100;
    return dir === "rtl" ? `% ${(percentage).toFixed(0)}` : `${(percentage).toFixed(0)} %`;
  };

  const renderOption = ({ item, index }: { item: Option; index: number }) => {
    // Handle cases where votePercentage is 0 gracefully
    const votePercentage = poll.totalVotes > 0 ? item.totalVotes / poll.totalVotes : 0;
    const progressWidth = progressAnimations.current[index]?.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }) || '0%'; // Fallback to '0%' if undefined

    // console.log(`Rendering option ${item}, progressWidth: ${isVoting}`); // Debugging

    return (
      <View style={[styles.optionContainer]}>
        <TouchableOpacity
          style={[layout.rowBox, styles.optionContent, item.selected ? styles.selectedOption : null]}
          onPress={() => handleSubmitVote(item.id)}
          // disabled={poll.hasVoted}
        >
          <View style={[styles.radioButton, { borderColor: item.selected ? theme.active : theme.gray }]}>
            {item.selected ? <View style={styles.radioButtonSelected} /> : null}
          </View>

          <View style={[layout.rowBox, styles.optionTextCon, !isVoting && { backgroundColor: theme.optionText }]}>
            <Animated.View style={[styles.progressBarBackground, { width: progressWidth }]} />
            <Text style={[layout.textAlign, styles.optionText, { zIndex: 5 }]}>{item.option}</Text>
            {poll.hasVoted && (
              <Text style={[layout.textAlign, styles.percentageText]}>{calculatePercentage(item.totalVotes || 0)}</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.pollContainer}>
      <View style={[layout.rowBox, styles.questionCON]}>
        <PollIcon />
        <Text style={[layout.textAlign, styles.pollQuestion]}>{poll.question}</Text>
      </View>
      <FlatList
        data={poll.options}
        keyExtractor={(option) => option.id.toString()}
        renderItem={renderOption}
      />

      <View style={[layout.rowBox, styles.textCon]}>
        {poll.totalVotes >= 200 ? <Text style={styles.totalText}>{poll.totalVotes} {t("Votes")}</Text> : <Text />}
        <Text style={styles.totalText}>{`باقي ${parseInt(poll.remainingTime)} ساعه`}</Text>
      </View>
    </View>
  );
};

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string) =>
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
      borderColor: ColorWithOpacity(theme.black, 0.2),
      borderWidth: 1,
    },
    questionCON: {
      alignItems: "center",
      paddingHorizontal: PixelPerfect(16),
    },
    pollQuestion: {
      paddingHorizontal: PixelPerfect(14),
      fontSize: PixelPerfect(18),
      color: theme.black,
      fontFamily: Fonts.regular,
      lineHeight: 21.6,
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
    optionTextCon: {
      height: PixelPerfect(39),
      width: phoneWidth - PixelPerfect(112),
      borderRadius: PixelPerfect(5),
      alignItems: "center",
      marginHorizontal: PixelPerfect(10),
      paddingHorizontal: PixelPerfect(5),
    },
    optionText: {
      fontSize: PixelPerfect(17),
      color: theme.black,
      fontFamily: Fonts.regular,
      lineHeight: 19.2,
    },
    percentageText: {
      fontSize: PixelPerfect(16),
      color: theme.black,
      fontFamily: Fonts.bold,
      lineHeight: 19.2,
      paddingHorizontal: PixelPerfect(10),
    },
    progressBarBackground: {
      height: '100%',
      backgroundColor: theme.optionText,
      borderRadius: PixelPerfect(5),
      position: 'absolute',
      zIndex: 0,
    },
    radioButton: {
      height: PixelPerfect(32),
      width: PixelPerfect(32),
      borderRadius: PixelPerfect(32) / 2,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioButtonSelected: {
      height: PixelPerfect(16),
      width: PixelPerfect(16),
      borderRadius: PixelPerfect(16) / 2,
      backgroundColor: theme.active,
    },
    textCon: {
      alignItems: "center",
      paddingHorizontal: PixelPerfect(20),
      justifyContent: "space-between",
      marginBottom: PixelPerfect(10),
    },
    totalText: {
      fontSize: PixelPerfect(16),
      color: theme.textColor,
      fontFamily: Fonts.regular,
      lineHeight: 19.2,
    },
  });

export default Poll;
