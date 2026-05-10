import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { IFont, ITheme } from '../../../Constants/interfaces';
import { ThemeContext } from '../../../Constants/theming';
import { Colors, PixelPerfect } from '../../../Constants/styleConstants';
import { t } from 'i18next';
import { Container, Content } from '../../../Components/containers/Containers';
import Inputs from '../../../Components/inputs';
import Button from '../../../Components/touchables/Button';
import { useDispatch, useSelector } from 'react-redux';
import useToastNotification from '../../../Components/CustomHooks/useToastNotification';
import HeaderWithText from '../../../Components/Headers/HeaderWithText';
import { Formik, FormikProps } from 'formik';
import { validationSchema } from '../../../Validation/Signup';
import { useRoute } from '@react-navigation/native';
import { ForgetPasswordHandler } from '../../../Apis/User';
import {
  AddOfferICon,
  ArrowDownIcon,
  ArrowUpIcon,
  EditProfileIcon,
} from '../../../Assets/Svg';
import { RootState } from '../../../Store/store';
import { imageUrl, mainUrl } from '../../../Constants/config';
import DropDowenMenu from '../../../Components/DropDowenMenus/DropDowenMenu';
import {
  GetAllActivitiesHandler,
  GetAllAvailableToolsHandler,
  GetAllRegionsByCountryIdHandler,
} from '../../../Apis/Appinfo';
import {
  GetAllActivities,
  GetAllAvailableTools,
} from '../../../Apis/CommonApi';
import axios from 'axios';
import { UpdateProfile } from '../../../Validation/UpdateProfile';
import DoneRate from '../../../Components/PopUps/DoneRate';
import { UpdateProfileUser } from '../../../Validation/UpdateProfileUser';
import FilterOrder from '../../../Components/PopUps/FilterOrder';
import { openAPPCamera, openAPPPicker } from '../../../Services/ImageCropPicker';
import ImageWithFallback from '../../../Components/ImageWithFallback/ImageWithFallback';
import { SetUserData } from '../../../Store/actions/auth';

type Props = {
  navigation: any;
};

const Index = (props: Props) => {
  const { navigation } = props;
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const { countries, activites, payments } = useSelector(
    (state: RootState) => state.settings,
  );
  const { item } = useRoute().params as any;
  const filterOption = [{ID: 1, Name: "Camera", Value: "Camera"}, {ID: 2, Name: "Photos", Value: "Photos"}];
  const styles = useStyles(Fonts, theme, dark, dir);

  const { userdata } = useSelector((state: RootState) => state.auth);
  const [uri, setUri] = useState(imageUrl + userdata.imageUrl);
  const formikRef = useRef<FormikProps<any>>(null);

  const [state, setstate] = useState({
    loading: false,
    showFiltter: false,
    showActivities: false,
    showServies: false,
    showMarket: false,
    selectedActivities: { name: '', arName: '', id: '' },
    selecteServies: { name: '', arName: '', id: '' },
    selecteMarket: { name: '', arName: '', id: '' },
    activities: [],
    servies: [],
  });

  const dispatch = useDispatch();
  const showToast = useToastNotification();

  useEffect(() => {
    getAllActivities();
    //getAllAvailableTools()
    // console.log('iiiiiiii', item);

    setstate(old => ({
      ...old,
      payments: payments,
      selectedActivities: item.info?.activities?.[0] ?? old.selectedActivities,
      selecteServies: item.info?.tools?.[0] ?? old.selecteServies,
      selecteMarket: item.info?.payments?.[0] ?? old.selecteMarket,
    }));
  }, []);
  const navigateBackWithUpdatedData = () => {
    navigation.navigate('UserProfile');
  };
  const updateUserProfile = async (values: any) => {
    setstate(old => ({
      ...old,
      loading: true, // ✅ start loading correctly
    }));

    try {
      const bodyFormData = new FormData();

      // 🔹 Normal fields
      bodyFormData.append('UserName', values.Username);
      bodyFormData.append('PhoneNumber', values.Phone);
      bodyFormData.append('Address', values.Address);
      bodyFormData.append('AnotherPhoneNumber', values.PhoneNumber);
      if (values.ImageUrl?.uri) {
        bodyFormData.append(
          'ImageURL',
          {
            uri: values.ImageUrl.uri,
            type: values.ImageUrl.type || 'image/jpeg',
            name: values.ImageUrl.name || `image_${Date.now()}.jpg`,
          } as any,
        );
      }

      // Send IDs as individual values (with null guard)
      if (state.selectedActivities?.id) {
        bodyFormData.append('ActivityIds', state.selectedActivities.id);
      }

      // Debug logs
      // console.log('ActivityIds:', state.selectedActivities?.id);
      // console.log('selecteServies:', state.selecteServies?.id);
      // console.log('selecteMarket:', state.selecteMarket?.id);

      const res = await axios.put(
        mainUrl + 'api/User/UpdateUserProfile',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userdata.token}`,
            'Accept-Language': dir === 'rtl' ? 'ar' : 'en',
          },
        },
      );

      // console.log('res.data', res.data);
      // console.log('bodyFormData', bodyFormData);

      setstate(old => ({
        ...old,
        loading: false,
      }));

      if (res?.data?.status === 200) {
        const updatedUserData = {
          ...userdata,
          name: values.Username,
          phoneNumber: values.Phone,
          email: values.Email,
          address: values.Address,
          imageUrl: res.data?.data?.imageUrl || userdata.imageUrl,
        };
        dispatch(SetUserData(updatedUserData));
        showToast({ type: 'ok', message: res.data.message });
        navigateBackWithUpdatedData();

      } else {
        showToast({
          type: 'error',
          message: res.data.message ?? t('Something Went wrong'),
        });
      }
    } catch (err: any) {
      // console.log('errrrrr', err);

      setstate(old => ({
        ...old,
        loading: false,
      }));

      showToast({
        type: 'error',
        message: t('Something Went wrong'),
      });
    }
  };
  const getAllActivities = () => {
    setstate(old => ({ ...old, loading: true }));
    dispatch<any>(
      GetAllActivities((res, status) => {
        if (res.status == 200) {
          setstate(old => ({ ...old, loading: false, activities: res.data }));
        } else {
          showToast({
            type: 'error',
            message: res?.message ?? t('Something Went wrong'),
          });
        }
        setstate(old => ({ ...old, loading: false }));
      }),
    );
  };

  const handleCameraPhotos = async (name: string) => {
    try {
      let file = null;

      if (name === "Camera") {
        file = await openAPPCamera();
      } else if (name === "Photos") {
        file = await openAPPPicker();
      }

      if (file?.uri) {
        setUri(file.uri);
        formikRef.current?.setFieldValue("ImageUrl", {
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
        formikRef.current?.setFieldTouched("ImageUrl", true);
      } else {
        formikRef.current?.setFieldError("ImageUrl", "Image is required");
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const GetRegions = id => {
    dispatch<any>(
      GetAllRegionsByCountryIdHandler(id, (res, status) => {
        if (res.status == 200) {
          setstate(old => ({ ...old, servies: res.data, loading: false }));
        } else {
          showToast({
            type: 'error',
            message: res?.message ?? t('Something Went wrong'),
          });
        }
      }),
    );
  };
  // console.log('==============userdata======================');
  // console.log(userdata);
  // console.log('=============userdata=======================');
  return (
    <Container showHint={false}>
      <HeaderWithText title={t('UpdateProfile')} />
      <View style={styles.body}>
        <Content style={{}}>
          {/* <DoneRate
                        visible={true}
                        onClose={() => {}}
                        onSubmit={() => { }}
                    /> */}
          <Formik
            innerRef={formikRef}
            validationSchema={UpdateProfileUser}
            initialValues={{
              Username: userdata.name,
              Phone: userdata.phoneNumber,
              Email: userdata.email,
              Market:
                dir == 'rtl'
                  ? item.info?.activities[0]?.arName
                  : item.info?.activities[0]?.name,
              Address: item.info?.address ?? userdata.address ?? '',
              Governmen: dir == 'rtl' ? item.info?.activities[0]?.arName : item.info?.activities[0]?.name,
              Area: dir == 'rtl' ? item.info?.tools[0]?.arName : item.info?.tools[0]?.name,

              PhoneNumber: item.info?.anotherPhoneNumber ?? '',
            }}
            onSubmit={updateUserProfile}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
              setFieldTouched,
              setFieldError,
            }) => {
              return (
                <>
                  <Content noPadding style={styles.body} scrollEnabled={false}>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        style={{
                          color: theme.black,
                          fontSize: PixelPerfect(18),
                          fontFamily: Fonts.medium,
                        }}
                      >
                        {t('personalImage')}
                      </Text>
                      <Pressable style={styles.logoWrapper} onPress={() => setstate(old => ({ ...old, showFiltter: true }))}>
                        {/* <Image
                          source={{ uri: uri }}
                          style={styles.avatar}
                          resizeMode="contain"
                        /> */}
                        <ImageWithFallback
                uri={ uri}
                type={0}//to set default
                style={styles.avatar}
              />
                        <EditProfileIcon style={styles.editBtn} />
                      </Pressable>
                    </View>
                    <Inputs
                      label={t('fullname')}
                      options={{
                        onBlur: handleBlur('Username'),
                        onChangeText: handleChange('Username'),
                        placeholder: t('fullnamew'),
                        maxLength: 30,
                        value: values.Username,
                      }}
                      password={false}
                      showErrorr={
                        (errors.Username && touched.Username) as boolean
                      }
                      error={errors.Username as any}
                    />
                    <Inputs
                      label={t('Phone')}
                      options={{
                        onBlur: handleBlur('Phone'),
                        onChangeText: handleChange('Phone'),
                        placeholder: t('Phonew'),
                        maxLength: 11,
                        keyboardType:
                          Platform.OS === 'android' ? 'numeric' : 'number-pad',
                        value: values.Phone,
                      }}
                      password={false}
                      isPhone={true}
                      input={{ width: '75%' }}
                      showErrorr={(errors.Phone && touched.Phone) as boolean}
                      error={errors.Phone as any}
                    />
                    <Inputs
                      label={t('Email')}
                      options={{
                        onBlur: handleBlur('Email'),
                        onChangeText: handleChange('Email'),
                        placeholder: t('Emailw'),
                        maxLength: 30,
                        value: values.Email,
                      }}
                      password={false}
                      showErrorr={(errors.Email && touched.Email) as boolean}
                      error={errors.Email as any}
                    />

                    <Pressable
                      style={styles.selectMenueCon}
                      onPress={() => {
                        setstate(old => ({ ...old, showActivities: true }));
                      }}
                    >
                      <Text style={[layout.textAlign, styles.label]}>
                        {t('Government')}
                      </Text>
                      <View style={[layout.rowBox, styles.selectMenue]}>
                        <Text style={styles.textselectmenu}>
                          {typeof state?.selectedActivities?.id !== 'string'
                            ? dir === 'rtl'
                              ? state?.selectedActivities?.arName
                              : state?.selectedActivities?.name
                            : values.activity}
                        </Text>
                        {state.showActivities ? (
                          <ArrowUpIcon />
                        ) : (
                          <ArrowDownIcon />
                        )}
                      </View>
                      {errors.activity && touched.activity && (
                        <Text style={styles.errorText}>
                          {t(errors.activity as any)}
                        </Text>
                      )}
                    </Pressable>
                    <Pressable
                      style={styles.selectMenueCon}
                      onPress={() => {
                        setstate(old => ({ ...old, showServies: true }));
                      }}
                    >
                      <Text style={[layout.textAlign, styles.label]}>
                        {t('Area')}
                      </Text>
                      <View style={[layout.rowBox, styles.selectMenue]}>
                        <Text style={styles.textselectmenu}>
                          {typeof state?.selecteServies?.id !== 'string'
                            ? dir === 'rtl'
                              ? state?.selecteServies?.arName
                              : state?.selecteServies?.name
                            : values.servises}
                        </Text>
                        {state.showServies ? (
                          <ArrowUpIcon />
                        ) : (
                          <ArrowDownIcon />
                        )}
                      </View>
                      {errors.servises && touched.servises && (
                        <Text style={styles.errorText}>
                          {t(errors.servises as any)}
                        </Text>
                      )}
                    </Pressable>

                    <Inputs
                      label={t('adress')}
                      options={{
                        onBlur: handleBlur('Address'),
                        onChangeText: handleChange('Address'),
                        placeholder: t('adressw'),
                        maxLength: 100,
                        value: values.Address,
                      }}
                      password={false}
                      showErrorr={
                        (errors.Address && touched.Address) as boolean
                      }
                      error={errors.Address as any}
                    />
                    <Pressable
                      style={styles.selectMenueCon}
                      onPress={() => {
                        setstate(old => ({ ...old, showMarket: true }));
                      }}
                    >
                      <Text style={[layout.textAlign, styles.label]}>
                        {t('Market')}
                      </Text>
                      <View style={[layout.rowBox, styles.selectMenue]}>
                        <Text style={styles.textselectmenu}>
                          {typeof state?.selecteMarket?.id !== 'string'
                            ? dir === 'rtl'
                              ? state?.selecteMarket?.arName
                              : state?.selecteMarket?.name
                            : values.Market}
                        </Text>
                        {state.showMarket ? <ArrowUpIcon /> : <ArrowDownIcon />}
                      </View>
                      {errors.Market && touched.Market && (
                        <Text style={styles.errorText}>
                          {t(errors.Market as any)}
                        </Text>
                      )}
                    </Pressable>

                    <Inputs
                      label={t('Phone')}
                      options={{
                        onBlur: handleBlur('PhoneNumber'),
                        onChangeText: handleChange('PhoneNumber'),
                        placeholder: t('Phonew'),
                        maxLength: 11,
                        keyboardType:
                          Platform.OS === 'android' ? 'numeric' : 'number-pad',
                        value: values.PhoneNumber,
                      }}
                      password={false}
                      isPhone={true}
                      input={{ width: '75%' }}
                      showErrorr={
                        (errors.PhoneNumber && touched.PhoneNumber) as boolean
                      }
                      error={errors.PhoneNumber as any}
                    />
                    <View style={{ backgroundColor: theme.mainColor }}>
                      <Button
                        title={t('Save')}
                        loader={state.loading}
                        styleTitle={styles.buttonText}
                        onPress={() => {
                          handleSubmit();
                        }}
                        style={styles.button}
                      />
                    </View>
                    {state.showActivities && (
                      <DropDowenMenu
                        onCloseFn={val => {
                          GetRegions(val?.id);
                          if (typeof val?.id === 'string') {
                            setstate(old => ({
                              ...old,
                              showActivities: false,
                            }));
                            setFieldError(
                              'governmen',
                              'You must pick a activity!',
                            );
                          } else {
                            setFieldValue('governmen', val?.id);
                            setFieldTouched('governmen', true);
                            setstate(old => ({
                              ...old,
                              showActivities: false,
                              selectedActivities: val,
                            }));
                          }
                        }}
                        title={t('Governmentw')}
                        currentFilter={state.selectedActivities}
                        items={countries}
                        style={{ flex: 0.4 }}
                      />
                    )}
                    {state.showServies && (
                      <DropDowenMenu
                        onCloseFn={val => {
                          if (typeof val?.id === 'string') {
                            setstate(old => ({
                              ...old,
                              showServies: false,
                            }));
                            setFieldError('Area', 'You must pick a servises!');
                          } else {
                            setFieldValue('Area', val?.id);
                            setFieldTouched('Area', true);
                            setstate(old => ({
                              ...old,
                              showServies: false,
                              selecteServies: val,
                            }));
                          }
                        }}
                        title={t('Areaw')}
                        currentFilter={state.selecteServies}
                        items={state.servies}
                        style={{ flex: 0.4 }}
                      />
                    )}

                    {state.showMarket && (
                      <DropDowenMenu
                        onCloseFn={val => {
                          // console.log('xxxxxx');
                          // console.log(typeof val?.id === 'string');
                          // console.log('xxxxxx');
                          if (typeof val?.id === 'string') {
                            setstate(old => ({
                              ...old,
                              showMarket: false,
                            }));
                            setFieldError('Market', 'You must pick a Market!');
                          } else {
                            setFieldValue('Market', val?.id);
                            setFieldTouched('Market', true);

                            setstate(old => ({
                              ...old,
                              showMarket: false,
                              selecteMarket: val,
                            }));
                          }
                        }}
                        title={t('Marketw')}
                        currentFilter={state.selecteMarket}
                        items={activites}
                        style={{ flex: 0.4 }}
                      />
                    )}
                    {state.showFiltter && <FilterOrder
                      title={t('Filter')}
                      items={filterOption}
                      currentFilter={filterOption}
                      onCloseFn={(val) => {
                        setstate(old => ({ ...old, showFiltter: false }))
                        setTimeout(() => {
                          handleCameraPhotos(val.Name);
                        }, 300);
                      }}
                    />}
                  </Content>
                </>
              );
            }}
          </Formik>
        </Content>
      </View>
    </Container>
  );
};

export default Index;

const useStyles = (
  Fonts: IFont,
  theme: ITheme,
  darkmode: boolean,
  dir: string,
) =>
  StyleSheet.create({
    body: {
      flex: 1,
    },
    button: {
      backgroundColor: Colors.secondColor,
      height: PixelPerfect(50),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: PixelPerfect(16),
    },
    buttonText: {
      fontFamily: Fonts.bold,
      fontSize: PixelPerfect(18),
      color: theme.mainColor,
    },

    signUpText: {
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(14),
      color: theme.deactive,
    },

    avatar: {
      width: PixelPerfect(64),
      height: PixelPerfect(64),
      borderRadius: PixelPerfect(32),
      marginRight: PixelPerfect(19),
    },

    logoWrapper: {
      width: PixelPerfect(64),
      height: PixelPerfect(64),

      marginTop: PixelPerfect(8),
    },
    editBtn: {
      position: 'absolute',
      top: PixelPerfect(-8),
      right: PixelPerfect(0),
      backgroundColor: '#fff',
      padding: PixelPerfect(8),
      borderRadius: PixelPerfect(20),
      elevation: 2,
    },
    selectMenueCon: {},
    label: {
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(18),
      color: theme.black,
      marginBottom: PixelPerfect(10),
      lineHeight: PixelPerfect(20),
    },
    selectMenue: {
      justifyContent: 'space-between',
      backgroundColor: Colors.white,
      height: PixelPerfect(50),
      alignItems: 'center',
      borderRadius: PixelPerfect(8),
      paddingHorizontal: PixelPerfect(10),
      marginBottom: PixelPerfect(20),
      borderWidth: PixelPerfect(1),
      borderColor: theme.optionText,
    },
    textselectmenu: {
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(16),
      color: theme.deactive,
    },
    errorText: {
      fontFamily: Fonts.regular,
      fontSize: PixelPerfect(14),
      color: theme.red_yellow,
      textAlign: dir === 'rtl' ? 'right' : 'left',
      marginBottom: PixelPerfect(10),
      paddingHorizontal: PixelPerfect(10),
    },
  });
