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
import { CheckActivison, ForgetPasswordHandler } from '../../../Apis/User';
import {
  AddOfferICon,
  ArrowDownIcon,
  ArrowUpIcon,
  EditProfileIcon,
} from '../../../Assets/Svg';
import { RootState, store } from '../../../Store/store';
import { mainUrl } from '../../../Constants/config';
import DropDowenMenu from '../../../Components/DropDowenMenus/DropDowenMenu';
import {
  GetAllActivitiesHandler,
  GetAllAvailableToolsHandler,
  GetAllRegionsByCountryIdHandler,
} from '../../../Apis/Appinfo';
import {
  GetAllActivities,
  GetAllAvailableTools,
  UserProfile,
} from '../../../Apis/CommonApi';
import axios from 'axios';
import { UpdateProfile } from '../../../Validation/UpdateProfile';
import DoneRate from '../../../Components/PopUps/DoneRate';
import { UpdateProfileUser } from '../../../Validation/UpdateProfileUser';
import FilterOrder from '../../../Components/PopUps/FilterOrder';
import {
  openAPPCamera,
  openAPPPicker,
} from '../../../Services/ImageCropPicker';
import ImageWithFallback from '../../../Components/ImageWithFallback/ImageWithFallback';
import { loginHandler } from '../../../Apis/User';
import { GetSellerData } from '../../../Apis/HomeApis';
import { SetUserData } from '../../../Store/actions/auth';

type Props = {
  navigation: any;
};

const resolveProfileAddress = (item: any) => {
  const branch =
    item?.branches?.[0] ??
    item?.info?.branches?.[0] ??
    item?.info?.addresses?.[0] ??
    item?.addresses?.[0] ??
    null;

  return {
    id:
      branch?.id ??
      branch?.branchId ??
      branch?.Id ??
      item?.info?.branchId ??
      item?.branchId ??
      '',

    // COUNTRY
    countryId:
      branch?.countryId ?? branch?.country?.id ?? branch?.Country?.id ?? '',

    country:
      branch?.country ??
      branch?.Country ??
      branch?.country?.name ??
      branch?.country?.arName ??
      branch?.Country?.name ??
      branch?.Country?.arName ??
      '',

    // REGION
    regionId:
      branch?.regionId ?? branch?.region?.id ?? branch?.Region?.id ?? '',

    region:
      branch?.region ??
      branch?.Region ??
      branch?.region?.name ??
      branch?.region?.arName ??
      branch?.Region?.name ??
      branch?.Region?.arName ??
      '',

    street:
      branch?.street ??
      branch?.Street ??
      branch?.name ??
      branch?.branchName ??
      item?.info?.address ??
      '',
  };
};

const Index = (props: Props) => {
  const { navigation } = props;
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const { countries, activites, payments } = useSelector(
    (state: RootState) => state.settings,
  );
  const { item } = useRoute().params as any;
  const filterOption = [
    { ID: 1, Name: 'Camera', Value: 'Camera' },
    { ID: 2, Name: 'Photos', Value: 'Photos' },
  ];
  const styles = useStyles(Fonts, theme, dark, dir);

  const { userdata } = useSelector((state: RootState) => state.auth);
  const [uri, setUri] = useState(userdata.imageUrl);
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
    branchId: '' as string | number | '',
  });

  const dispatch = useDispatch();
  const showToast = useToastNotification();
  const GetRegions = (
    id: string | number,
    regionId?: string | number,
    regionName?: string,
  ) => {
    dispatch<any>(
      GetAllRegionsByCountryIdHandler(id, (res, status) => {
        if (res.status == 200) {
          const regions = res.data ?? [];
          const matchedRegion =
            regionId || regionName
              ? regions.find(
                  (region: any) =>
                    region.id == regionId ||
                    region.name == regionName ||
                    region.arName == regionName,
                )
              : null;

          setstate(old => ({
            ...old,
            servies: regions,
            loading: false,
            ...(matchedRegion ? { selecteServies: matchedRegion } : {}),
          }));

          if (matchedRegion && formikRef.current) {
            formikRef.current.setFieldValue('Area', matchedRegion.id);
          }
        } else {
          showToast({
            type: 'error',
            message: res?.message ?? t('Something Went wrong'),
          });
        }
      }),
    );
  };

  const userProfile = async () => {
    setstate(old => ({ ...old, loading: true }));
    dispatch<any>(
      await UserProfile((res, status) => {

        if (res.status === 200) {
          const { userdata } = store.getState().auth;
          const mergedUser = {
            ...res.data[0],
            ...userdata,
            imageUrl: res?.data?.[0]?.imageURL,
          };
      

          dispatch(SetUserData(mergedUser));
          showToast({ type: 'ok', message: res.data.message });
           navigation.reset({
            index: 0,
            routes: [{name:'Market'},{ name: 'UserProfile' }],
          } as any)
        } else {
          showToast({
            type: 'error',
            message: res?.Message ?? t('Something Went wrong'),
          });
        }
        setstate(old => ({ ...old, loading: false }));
      }),
    );
  };
  useEffect(() => {
    getAllActivities();

    const profileAddress = resolveProfileAddress(item);

    const infoActivity = item.info?.activities?.[0];
    const matchedActivity = infoActivity
      ? activites.find(
          (a: any) =>
            a.id == infoActivity.id ||
            a.name === infoActivity.name ||
            a.arName === infoActivity.arName,
        )
      : null;

    const matchedCountry =
      profileAddress.countryId || profileAddress.country
        ? countries.find(
            (c: any) =>
              c.id == profileAddress.countryId ||
              c.name == profileAddress.country ||
              c.arName == profileAddress.country,
          )
        : null;
    setstate(old => ({
      ...old,
      payments: payments,
      branchId: profileAddress.id,
      selecteMarket: matchedActivity ?? old.selecteMarket,
      selectedActivities: matchedCountry ?? old.selectedActivities,
    }));

    if (profileAddress.countryId) {
      GetRegions(
        matchedCountry?.id || profileAddress.countryId,
        profileAddress.regionId,
        profileAddress.region,
      );
    }
  }, []);
  useEffect(() => {
    if (!countries.length || !item) return;

    const profileAddress = resolveProfileAddress(item);

    const country = countries.find(
      c =>
        c.id == profileAddress.countryId ||
        c.name == profileAddress.country ||
        c.arName == profileAddress.country,
    );

    if (!country) return;

    setstate(old => ({
      ...old,
      selectedActivities: country,
    }));

    GetRegions(country.id, profileAddress.regionId, profileAddress.region);
  }, [countries, item]);
  const navigateBackWithUpdatedData = () => {
    navigation.navigate('UserProfile');
  };

  const updateUserProfile = async (values: any) => {
    setstate(old => ({
      ...old,
      loading: true,
    }));

    try {
      const bodyFormData = new FormData();

      bodyFormData.append('UserName', values.Username || '');
      bodyFormData.append('PhoneNumber', values.Phone || '');
      bodyFormData.append('AnotherPhoneNumber', values.PhoneNumber || '');

      const activityId =
        typeof state.selecteMarket?.id !== 'string' &&
        state.selecteMarket?.id != null
          ? state.selecteMarket.id
          : values.Market;
      if (activityId != null && activityId !== '') {
        bodyFormData.append('ActivityIds', String(activityId));
      }

      if (values.ImageUrl?.uri) {
        bodyFormData.append('ImageURL', {
          uri: values.ImageUrl.uri.startsWith('file://')
            ? values.ImageUrl.uri
            : `file://${values.ImageUrl.uri}`,
          type: values.ImageUrl.type || 'image/jpeg',
          name: values.ImageUrl.name || `image_${Date.now()}.jpg`,
        } as any);
      }

      const addressId = state.branchId;
      const countryId =
        typeof state.selectedActivities?.id !== 'string' &&
        state.selectedActivities?.id != null
          ? state.selectedActivities.id
          : values.Governmen;
      const regionId =
        typeof state.selecteServies?.id !== 'string' &&
        state.selecteServies?.id != null
          ? state.selecteServies.id
          : values.Area;
      const street = (values.Address ?? '').trim();

      if (
        countryId != null &&
        countryId !== '' &&
        regionId != null &&
        regionId !== ''
      ) {
        const addressEntry: Record<string, string | number> = {
          Country: countryId,
          Region: regionId,
          Street: street,
        };
        if (addressId != null && addressId !== '') {
          addressEntry.Id = addressId;
        }
        const branchId = state.branchId;
        bodyFormData.append('Branches.Id', String(branchId));
        bodyFormData.append('Branches.Country', String(countryId));
        bodyFormData.append('Branches.Region', String(regionId));
        bodyFormData.append('Branches.Street', street);
      }
      console.log('📦 payload', bodyFormData);
      console.log('UpdateUserProfile');

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

      setstate(old => ({
        ...old,
        loading: false,
      }));

      if (res?.data?.status === 200) {
        userProfile();
      } else {
        showToast({
          type: 'error',
          message: res.data.message ?? t('Something Went wrong'),
        });
      }
    } catch (err) {
      setstate(old => ({
        ...old,
        loading: false,
      }));

      showToast({
        type: 'error',
        message: err?.message ?? t('Something Went wrong'),
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

      if (name === 'Camera') {
        file = await openAPPCamera();
      } else if (name === 'Photos') {
        file = await openAPPPicker();
      }

      if (file?.uri) {
        setUri(file.uri);
        formikRef.current?.setFieldValue('ImageUrl', {
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
        formikRef.current?.setFieldTouched('ImageUrl', true);
      } else {
        formikRef.current?.setFieldError('ImageUrl', 'Image is required');
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const profileAddress = resolveProfileAddress(item);
  const matchedCountryInit = profileAddress.countryId
    ? countries.find((c: any) => c.id == profileAddress.countryId)
    : null;
  const infoActivityInit = item.info?.activities?.[0];
  const matchedActivityInit = infoActivityInit
    ? activites.find(
        (a: any) =>
          a.id == infoActivityInit.id ||
          a.name === infoActivityInit.name ||
          a.arName === infoActivityInit.arName,
      )
    : null;
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
              Market: matchedActivityInit
                ? dir === 'rtl'
                  ? matchedActivityInit.arName
                  : matchedActivityInit.name
                : '',
              Address:
                profileAddress.street ||
                item.info?.address ||
                userdata.address ||
                '',
              Governmen: matchedCountryInit
                ? dir === 'rtl'
                  ? matchedCountryInit.arName
                  : matchedCountryInit.name
                : '',
              Area:
                typeof state.selecteServies?.id !== 'string'
                  ? dir === 'rtl'
                    ? state.selecteServies?.arName
                    : state.selecteServies?.name
                  : '',
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
                      <Pressable
                        style={styles.logoWrapper}
                        onPress={() =>
                          setstate(old => ({ ...old, showFiltter: true }))
                        }
                      >
                        {/* <Image
                          source={{ uri: uri }}
                          style={styles.avatar}
                          resizeMode="contain"
                        /> */}
                        <ImageWithFallback
                          uri={uri}
                          type={0} //to set default
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
                            : values.Governmen}
                        </Text>
                        {state.showActivities ? (
                          <ArrowUpIcon />
                        ) : (
                          <ArrowDownIcon />
                        )}
                      </View>
                      {errors.Governmen && touched.Governmen && (
                        <Text style={styles.errorText}>
                          {t(errors.Governmen as any)}
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
                            : values.Area}
                        </Text>
                        {state.showServies ? (
                          <ArrowUpIcon />
                        ) : (
                          <ArrowDownIcon />
                        )}
                      </View>
                      {errors.Area && touched.Area && (
                        <Text style={styles.errorText}>
                          {t(errors.Area as any)}
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
                          setstate(old => ({
                            ...old,
                            selecteServies: { name: '', arName: '', id: '' },
                          }));
                          setFieldValue('Area', '');
                          if (typeof val?.id === 'string') {
                            setstate(old => ({
                              ...old,
                              showActivities: false,
                            }));
                            setFieldError(
                              'Governmen',
                              'You must pick a government!',
                            );
                          } else {
                            setFieldValue('Governmen', val?.id);
                            setFieldTouched('Governmen', true);
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
                            setFieldError('Area', 'You must pick an area!');
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
                    {state.showFiltter && (
                      <FilterOrder
                        title={t('Filter')}
                        items={filterOption}
                        currentFilter={filterOption}
                        onCloseFn={val => {
                          setstate(old => ({ ...old, showFiltter: false }));
                          setTimeout(() => {
                            handleCameraPhotos(val.Name);
                          }, 300);
                        }}
                      />
                    )}
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
