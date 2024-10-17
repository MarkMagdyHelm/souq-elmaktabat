import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Poll from '../../Components/Cards/Poll'; 
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import { Container } from '../../Components/containers/Containers';
import { t } from 'i18next';
import TabBar from '../../Components/TabBar/index';
import { Colors } from '../../Constants/styleConstants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import { GetPollsHandler, VotePollByGueseHandler, VotePollByUserHandler } from '../../Apis/Poll';
import { useToast } from 'react-native-toast-notifications';
import PollLoader from '../../Components/SkeltonLoaders/PollLoader';
import { logoutHandler } from '../../Apis/User';

interface Option {
  id: number;
  option: string;
  totalVotes: number;
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
  const { gusterID,userdata,isLogin } = useSelector((state:RootState) => state.auth);

  const [polls, setPolls] = useState<PollData[]>([
    { id: 0, question: '', options: [], hasVoted: false, totalVotes: 0}
    // {
    //     id: 2,
    //     question: 'ما توقعاتك لاسعار اليوم',
    //     options: [
    //       { id: 1, option: 'هتزيد', votes: 99, selected: false },
    //       { id: 2, option: 'هتقل', votes: 0, selected: false },
    //       { id: 3, option: 'هتفضل زي ما هي', votes: 0, selected: false },
    //     ],
    //     hasVoted: false,
    //     totalVotes: 99,
    //   },
      
  ],

);
   const [loading, setloading] = useState(false);
   const dispatch = useDispatch();
   const toast = useToast();
    const toastNotfication = (config:any) => {
        toast.hideAll();
        toast.show(config.message, {
            type: config.type,
            duration: 3000,
            offset: 50,
            animationType: 'slide-in',
            placement: 'top',
        } as any);
    }
    useEffect(() => {
      getPolls();
      // dispatch<any>(logoutHandler({}))
    }, [])
    
    const getPolls = ()=>{
      setloading(true)
     dispatch<any>(GetPollsHandler(isLogin?{
      UserId:userdata.id
     }:{
      GuestId:gusterID
     },(res,status)=>{
       if (res.status == 200) {
        res.data[0].hasVoted=false;
        res.data[0].options[0].selected=false;
        // console.log('============rrrrrrr========================');
        // console.log(res.data);
        // console.log('====================================');
        setPolls(res.data)
       }else{
        toastNotfication({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
       }
       setloading(false)
     }))
    };
    console.log('====================================');
    console.log(userdata);
    console.log('====================================');
    const voting = (OptionId:number)=>{
      console.log('====================================');
      console.log(gusterID,OptionId);
      console.log('====================================');
      if (isLogin) {
        dispatch<any>(VotePollByUserHandler({
          UserId:userdata.id,
          OptionId:OptionId
         },(res,status)=>{
          if (res.status == 200) {
          //  setPolls(res.data)
           }else{
            toastNotfication({ type: 'error', message: res?.message ?? t("Something Went wrong") });
           }
          
         }))
      } else {     
        dispatch<any>(VotePollByGueseHandler({
         GuestId:gusterID,
         OptionId:OptionId
        },(res,status)=>{
      
         if (res.status == 200) {
           
         //  setPolls(res.data)
          }else{
           toastNotfication({ type: 'error', message: res?.message ?? t("Something Went wrong") });
          }
         
        }))
      }
    };
  const handleVote = (pollId: number, newOptions: Option[], newTotalVotes: number,optionId:number) => {
    voting(optionId);
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === pollId
          ? { ...poll, options: newOptions, totalVotes: newTotalVotes, hasVoted: true }
          : poll
      )
    );
  };

  const renderPoll = ({ item }: { item: PollData }) => 
    (
  <>
  {
    loading?<PollLoader/>
    :<Poll pollData={item} onVote={handleVote} />
    }
  </>);

  return (
    <Container showHint={false}>
        <HeaderWithText  title={t("Opinion poll")}/>
    <View style={styles.container}>
      <FlatList
        data={polls}
        style={{flex:1}}
        keyExtractor={(poll) => poll?.id?.toString()}
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
