import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Poll from '../../Components/Cards/Poll'; // Import the Poll component
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import { Container } from '../../Components/containers/Containers';
import { t } from 'i18next';
import TabBar from '../../Components/TabBar/index';
import { Colors } from '../../Constants/styleConstants';

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

const Index = () => {
  const [polls, setPolls] = useState<PollData[]>([
    {
      id: 1,
      question: 'ما توقعاتك لاسعار اليوم',
      options: [
        { id: 1, option: 'هتزيد', votes: 4, selected: false },
        { id: 2, option: 'هتقل', votes: 2, selected: false },
        { id: 3, option: 'هتفضل زي ما هي', votes: 2, selected: false },
      ],
      hasVoted: false,
      totalVotes: 8,
    },
    {
        id: 2,
        question: 'ما توقعاتك لاسعار اليوم',
        options: [
          { id: 1, option: 'هتزيد', votes: 99, selected: false },
          { id: 2, option: 'هتقل', votes: 0, selected: false },
          { id: 3, option: 'هتفضل زي ما هي', votes: 0, selected: false },
        ],
        hasVoted: false,
        totalVotes: 99,
      },
  ]);

  // Function to handle vote submission (updates poll data)
  const handleVote = (pollId: number, newOptions: Option[], newTotalVotes: number) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === pollId
          ? { ...poll, options: newOptions, totalVotes: newTotalVotes, hasVoted: true }
          : poll
      )
    );
  };

  const renderPoll = ({ item }: { item: PollData }) => <Poll pollData={item} onVote={handleVote} />;

  return (
    <Container showHint={false}>
        <HeaderWithText  title={t("Opinion poll")}/>
    <View style={styles.container}>
      <FlatList
        data={polls}
        keyExtractor={(poll) => poll.id.toString()}
        renderItem={renderPoll}
      />
    </View>
    <TabBar/>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    padding: 20,
    backgroundColor:Colors.white,
  },
});

export default Index;
