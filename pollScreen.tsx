import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated } from 'react-native';

const App = () => {
  // Polls data with options
  const [polls, setPolls] = useState([
    {
      id: 1,
      question: 'Which Mobile Framework Do You Prefer?',
      options: [
        { id: 1, option: 'React Native', votes: 0, selected: false },
        { id: 2, option: 'Flutter', votes: 0, selected: false },
        { id: 3, option: 'Swift', votes: 0, selected: false },
        { id: 4, option: 'Kotlin', votes: 0, selected: false },
      ],
      hasVoted: false,
      totalVotes: 0,
    },
    {
      id: 2,
      question: 'What is Your Favorite Programming Language?',
      options: [
        { id: 1, option: 'JavaScript', votes: 0, selected: false },
        { id: 2, option: 'Python', votes: 0, selected: false },
        { id: 3, option: 'Java', votes: 0, selected: false },
        { id: 4, option: 'C#', votes: 0, selected: false },
      ],
      hasVoted: false,
      totalVotes: 0,
    },
     {
      id: 3,
      question: 'What is Your Favorite Programming Language?',
      options: [
        { id: 1, option: 'JavaScript', votes: 0, selected: false },
        { id: 2, option: 'Python', votes: 0, selected: false },
        { id: 3, option: 'Java', votes: 0, selected: false },
        { id: 4, option: 'C#', votes: 0, selected: false },
      ],
      hasVoted: false,
      totalVotes: 0,
    },
     {
      id: 4,
      question: 'What is Your Favorite Programming Language?',
      options: [
        { id: 1, option: 'JavaScript', votes: 0, selected: false },
        { id: 2, option: 'Python', votes: 0, selected: false },
        { id: 3, option: 'Java', votes: 0, selected: false },
        { id: 4, option: 'C#', votes: 0, selected: false },
      ],
      hasVoted: false,
      totalVotes: 0,
    },
  ]);

  // Animation values for each poll's options
  const progressAnimations = polls.map((poll) => {
    return poll.options.map(() => useRef(new Animated.Value(0)).current);
  });

  // Handle selecting an option for a specific poll
  const handleSelectOption = (pollId, optionId) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              options: poll.options.map((option) =>
                option.id === optionId ? { ...option, selected: true } : { ...option, selected: false }
              ),
            }
          : poll
      )
    );
  };

  // Handle vote submission for a specific poll
  const handleSubmitVote = (pollId) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id === pollId && !poll.hasVoted) {
          const newPollOptions = poll.options.map((option) => {
            if (option.selected) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          });

          const newTotalVotes = newPollOptions.reduce((sum, option) => sum + option.votes, 0);

          // Animate the progress bars for each option
          newPollOptions.forEach((option, index) => {
            const votePercentage = option.votes / newTotalVotes;
            Animated.timing(progressAnimations[pollId - 1][index], {
              toValue: votePercentage,
              duration: 1000,
              useNativeDriver: false,
            }).start();
          });

          return { ...poll, options: newPollOptions, totalVotes: newTotalVotes, hasVoted: true };
        }
        return poll;
      })
    );
  };

  // Function to calculate the percentage of votes for an option
  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return '0%';
    return `${((votes / totalVotes) * 100).toFixed(1)}%`;
  };

  const renderOption = (pollId, { item, index }) => {
    const progressWidth = progressAnimations[pollId - 1][index].interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.optionContainer}>
        {/* Background progress bar */}
        <Animated.View style={[styles.progressBarBackground, { width: progressWidth }]} />

        {/* Option content with transparent background */}
        <TouchableOpacity
          style={[styles.optionContent, item.selected ? styles.selectedOption : null]}
          onPress={() => handleSelectOption(pollId, item.id)}
          disabled={polls[pollId - 1].hasVoted} // Disable selection after voting
        >
          {/* Radio button or Percentage */}
          {!polls[pollId - 1].hasVoted ? (
            <View style={styles.radioButton}>
              {item.selected ? <View style={styles.radioButtonSelected} /> : null}
            </View>
          ) : (
            <Text style={styles.percentageText}>{calculatePercentage(item.votes, polls[pollId - 1].totalVotes)}</Text>
          )}

          {/* Option text */}
          <Text style={styles.optionText}>{item.option}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPoll = ({ item }) => (
    <View style={styles.pollContainer}>
      <Text style={styles.pollQuestion}>{item.question}</Text>
      <FlatList
        data={item.options}
        keyExtractor={(option) => option.id.toString()}
        renderItem={(props) => renderOption(item.id, props)}
      />
      {!item.hasVoted ? (
        <TouchableOpacity style={styles.voteButton} onPress={() => handleSubmitVote(item.id)}>
          <Text style={styles.voteButtonText}>Submit Vote</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.thankYouText}>Thank you for voting!</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={polls}
        keyExtractor={(poll) => poll.id.toString()}
        renderItem={renderPoll}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  pollContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  pollQuestion: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  optionContainer: {
    marginVertical: 5,
    position: 'relative',
  },
  optionContent: {
    backgroundColor: 'transparent', // Transparent background to show progress bar
    padding: 15,
    borderRadius: 5, // Added border radius
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1, // Ensure the content is above the background bar
    position: 'relative',
  },
  selectedOption: {
    borderColor: '#00bcd4',
  },
  optionText: {
    fontSize: 18,
    color: '#000',
    flex: 1,
    paddingLeft: 10, // Padding to space text from radio button
  },
  percentageText: {
    fontSize: 16,
    color: '#888',
  },
  voteButton: {
    backgroundColor: '#00bcd4',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  voteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  thankYouText: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: '100%',
    backgroundColor: 'red', // Progress bar color
    borderRadius: 5, // Progress bar radius to match item
    position: 'absolute',
    left: 0,
    top: 0,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#00bcd4',
  },
});

export default App;
