import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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
import { AddPhotoImage, ArrowDownIcon, ArrowUpIcon, CalenderIcon } from '../../../Assets/Svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { RootState } from '../../../Store/store';
import DropDowenMenu from '../../../Components/DropDowenMenus/DropDowenMenu';
import RadiobuttonChoice from '../../../Components/PopUps/RadiobuttonChoice';
import { amounts } from '../../../Helper';
import { GetMyBranches } from '../../../Apis/CommonApi';
import { AddOfferPrinter } from '../../../Validation/AddOfferPrinter';
import { UpdateInkOffer, UpdatePaperOffer, UpdatePrintingOffer } from '../../../Apis/Request';
import { useRoute } from '@react-navigation/native';
import { openAPPCamera, openAPPPicker } from '../../../Services/ImageCropPicker';
import FilterOrder from '../../../Components/PopUps/FilterOrder';
import { GetAllPapersV2 } from '../../../Apis/Appinfo';
import { AddOfferPaper } from '../../../Validation/AddOfferPaper';
import { AddOfferInks } from '../../../Validation/AddOfferInks';
import ImageWithFallback from '../../../Components/ImageWithFallback/ImageWithFallback';
const filterOption = [{ ID: 1, Name: "Camera", Value: "Camera" }, { ID: 2, Name: "Photos", Value: "Photos" },]

type Props = {
    navigation: any
};

const Index = (props: Props) => {
    const { navigation } = props;
    const { type, item } = useRoute().params as any;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const { inks, colors, paperwidth, paperSize } = useSelector((state: RootState) => state.settings);
    const styles = useStyles(Fonts, theme, dark, dir);
    
    // Collect all offer data from item into one variable
    const offerData = {
        id: item?.id ?? "",
        PrintingPressesOfferId:item?.id??"",
        EndDate: item?.endDate ?? "",
        type: type,
        // Type-specific IDs
        paperId: item?.paperId ?? "",
        inkId: item?.inkId ?? "",
        colorId: item?.colorId ?? "",
        // Paper/Ink fields
        name: item?.name ?? "",
        brand: item?.brand ?? "",
        description: item?.description ?? "",
        // Size & Width fields
        paperSizeId: item?.paperSizeId ?? "",
        paperSize: item?.paperSize ?? "",
        width: item?.width != null ? String(item.width) : "",
        size: item?.size != null ? String(item.size) : "",
        // Pricing
        price: type === "Printers"
            ? (item?.nonColoredPrice != null ? String(item.nonColoredPrice) : (item?.price != null ? String(item.price) : ""))
            : (item?.price != null ? String(item.price) : ""),
        coloredPrice: item?.coloredPrice != null ? String(item.coloredPrice) : "",
        min: item?.min != null ? String(item.min) : "",
        // Branch info
        branchId: item?.branchId ?? "",
        branchName: item?.branchName ?? "",
        countryName: item?.countryName ?? "",
        regionName: item?.regionName ?? "",
        // Dates & Delivery
        endDate: item?.endDate ?? "",
        includeDelivery: item?.includeDelivery ?? false,
        imediatePrinting: item?.imediatePrinting ?? false,
        // Image
        imageUrl: item?.imageUrl ?? null,
    };
    
    // Initialize default values from offerData
    const getInitialState = () => {
        const baseState = {
            // Loading & UI States
            loading: false,
            showFiltter: false,
            
            // Modal/Dropdown Visibility
            showtype: false,
            showSize: false,
            showWight: false,
            showQuntity: false,
            showColor: false,
            showInks: false,
            showDate: false,
            showBranches: false,
            
            // Data Lists
            branches: [],
            paperTypeList: [],
            
            // Selected Values - Dropdowns
            selectedPaperType: { name: "", arName: "", id: "" },
            selectedInks: { name: "", arName: "", id: "" },
            selectedColor: { name: "", arName: "", id: "" },
            selectedPaperSize: { name: "", arName: "", id: "" },
            selectedPaperQuntaity: { name: "", arName: "", id: "" },
            selectedBranches: { branchName: "", branchId: "", countryName: "", regionName: "" },
            
            // Form States
            isdelervable: offerData.includeDelivery,
            isImediatePrinting: offerData.imediatePrinting,
            date: offerData.endDate ? new Date(offerData.endDate) : new Date(),
            PaperDescription: offerData.description,
            
            // Other
            image: {} as any,
        };
        
        // Populate selected values from offerData based on type
        if (type === "Paper" && offerData.paperId) {
            baseState.selectedPaperType = { id: offerData.paperId, name: offerData.name, arName: offerData.name };
        }
        if (type === "Inks" && offerData.inkId) {
            baseState.selectedInks = { id: offerData.inkId, name: offerData.name, arName: offerData.name };
        }
        if (offerData.colorId) {
            // Find matching color from colors array
            const matchingColor = colors?.find(c => c.id === offerData.colorId);
            baseState.selectedColor = matchingColor || { id: offerData.colorId, name: "", arName: "" };
        }
        if (offerData.paperSizeId) {
            // Find matching paper size from paperSize array
            const matchingSize = paperSize?.find(ps => ps.id === offerData.paperSizeId);
            baseState.selectedPaperSize = matchingSize || { id: offerData.paperSizeId, name: offerData.paperSize, arName: offerData.paperSize };
        }
        if (offerData.min) {
            // Find matching quantity from amounts array
            const matchingAmount = amounts?.find(a => a.name === offerData.min?.toString());
            baseState.selectedPaperQuntaity = matchingAmount ? { ...matchingAmount, id: String(matchingAmount.id) } : { id: String(offerData.min), name: offerData.min?.toString(), arName: offerData.min?.toString() };
        }
        if (offerData.branchId) {
            baseState.selectedBranches = {
                branchId: offerData.branchId,
                branchName: offerData.branchName,
                countryName: offerData.countryName,
                regionName: offerData.regionName
            };
        }
        
        return baseState;
    };
    
    const [state, setstate] = useState(getInitialState());
    const dispatch = useDispatch();
    const showToast = useToastNotification();
    const formikRef = useRef<FormikProps<any>>(null);

    // Consolidate commonly used state values
    const uiState = {
        // Loading & UI
        loading: state.loading,
        showFiltter: state.showFiltter,
        
        // Modal/Dropdown Visibility
        showtype: state.showtype,
        showSize: state.showSize,
        showColor: state.showColor,
        showInks: state.showInks,
        showQuntity: state.showQuntity,
        showDate: state.showDate,
        showBranches: state.showBranches,
        
        // Form States
        isdelervable: state.isdelervable,
        isImediatePrinting: state.isImediatePrinting,
        date: state.date,
        
        // Selected Values - Dropdowns
        paperType: state.selectedPaperType,
        inks: state.selectedInks,
        color: state.selectedColor,
        paperSize: state.selectedPaperSize,
        quantity: state.selectedPaperQuntaity,
        branches: state.selectedBranches,
        
        // Data Lists
        branchList: state.branches,
        paperTypeList: state.paperTypeList,
    };
const formattedPaperTypes = uiState.paperTypeList.map(function (item) {
    // console.log("lll",item.name);
    
    return ({
        ...item,
        displayName: item.name,
    });
});
    const handelDelery = () => {
        setstate(old => ({ ...old, isdelervable: !old.isdelervable }))
    }
    const handelImediatePrinting = (value: boolean) => {
        setstate(old => ({ ...old, isImediatePrinting:!value }))
    }

    // Build updated item to pass back to OffersDetails
    const buildUpdatedItem = () => {
        const values = formikRef.current?.values;
        const updated = { ...item };

        // Common fields
        updated.description = values?.PaperDescription ?? item.description;
        updated.endDate = uiState.date ? new Date(uiState.date).toISOString() : item.endDate;
        updated.includeDelivery = uiState.isdelervable;
        updated.branchId = values?.Branches ?? item.branchId;

        // Branch display info
        if (state.selectedBranches?.branchId && typeof state.selectedBranches.branchId !== "string") {
            updated.branchName = state.selectedBranches.branchName;
            updated.countryName = state.selectedBranches.countryName;
            updated.regionName = state.selectedBranches.regionName;
        }

        if (type === "Paper") {
            updated.paperId = values?.PaperType ?? item.paperId;
            updated.paperSizeId = values?.PaperSize ?? item.paperSizeId;
            updated.width = values?.PaperWidth ?? item.width;
            updated.min = values?.PaperQuntaity ?? item.min;
            updated.price = values?.PaperPrice ?? item.price;
            // Update paper type name from dropdown selection
            if (state.selectedPaperType?.name) {
                updated.name = state.selectedPaperType.name;
            }
            // Update paper size name from dropdown selection
            if (state.selectedPaperSize?.name) {
                updated.paperSize = state.selectedPaperSize.name;
            }
        } else if (type === "Inks") {
            updated.inkId = values?.InksType ?? item.inkId;
            updated.brand = values?.Brand ?? item.brand;
            updated.size = values?.InksWidth ?? item.size;
            updated.colorId = values?.Color ?? item.colorId;
            updated.price = values?.PaperPrice ?? item.price;
            updated.min = values?.PaperQuntaity ?? item.min;
            if (state.selectedInks?.name) {
                updated.name = state.selectedInks.name;
            }
        } else if (type === "Printers") {
            updated.nonColoredPrice = values?.PaperPrice ? Number(values.PaperPrice) : item.nonColoredPrice;
            updated.coloredPrice = values?.PaperPrice1 ? Number(values.PaperPrice1) : item.coloredPrice;
            updated.imediatePrinting = uiState.isImediatePrinting;
        }

        // Update image if user picked a new one
        if (values?.ImageUrl && typeof values.ImageUrl === "object" && values.ImageUrl.uri) {
            updated.imageUrl = values.ImageUrl.uri;
        }

        // console.log("EditOffer: built updated item", updated);
        return updated;
    };

    // Navigate back to OffersDetails with updated item
    const navigateBackWithUpdatedItem = () => {
        const updatedItem = buildUpdatedItem();
        navigation.navigate('OffersDetails', { item: updatedItem });
    };

    // Extract all form values from Formik reference
    const getFormValues = () => ({
        inksType: formikRef?.current?.values?.InksType,
        brand: formikRef?.current?.values?.Brand,
        inksWidth: formikRef?.current?.values?.InksWidth,
        color: formikRef?.current?.values?.Color,
        price: formikRef?.current?.values?.PaperPrice,
        coloredPrice: formikRef?.current?.values?.PaperPrice1,
        min: formikRef?.current?.values?.PaperQuntaity,
        description: formikRef?.current?.values?.PaperDescription,
        branches: formikRef?.current?.values?.Branches,
        imageUrl: formikRef?.current?.values?.ImageUrl,
    });

    // Build request body for Ink offers
    const buildInkOfferBody = (formValues: any) => ({
        InkId: formValues.inksType,
        InkOfferId: offerData.id,
        Brand: formValues.brand,
        Size: formValues.inksWidth,
        ColorId: formValues.color,
        Price: formValues.price,
        Min: formValues.min,
        Description: formValues.description,
        EndDate: uiState.date,
        Branches: [formValues.branches],
        IncludeDelivery: uiState.isdelervable,
        ImageUrl: formValues.imageUrl,
    });

    // Build request body for Printer offers
    const buildPrinterOfferBody = (formValues: any) => ({
        EndDate: uiState.date,//not sending don't know why!
        Branches: formValues.branches,
        ImageUrl: formValues.imageUrl,
        Description: formValues.description,
        ColoredPrice: formValues.coloredPrice,
        NonColoredPrice: Number(formValues.price),
        ImediatePrinting: uiState.isImediatePrinting,
        IncludeDelivery: uiState.isdelervable,
        PrintingPressesOfferId: offerData.id,
        IsActive: true,
    });

    // Convert plain object to FormData with nested structure support
    const appendFormData = (data: any, bodyFormData: FormData, parentKey = "") => {
        // Handle file/image objects
        if (data && typeof data === "object" && data.uri && data.name && data.type) {
            bodyFormData.append(parentKey, {
                uri: data.uri.startsWith("file://") ? data.uri : `file://${data.uri}`,
                name: data.name,
                type: data.type,
            });
            return;
        }

        // Handle arrays
        if (Array.isArray(data)) {
            data.forEach((value, index) => {
                appendFormData(value, bodyFormData, `${parentKey}[${index}]`);
            });
            return;
        }

        // Handle nested objects
        if (typeof data === "object" && data !== null) {
            Object.keys(data).forEach(key => {
                appendFormData(
                    data[key],
                    bodyFormData,
                    parentKey ? `${parentKey}.${key}` : key
                );
            });
            return;
        }

        // Handle primitive values
        bodyFormData.append(parentKey, data ?? "");
    };

    // Prepare FormData for submission
    const prepareFormData = (body: any) => {
        const bodyFormData = new FormData();
        appendFormData(body, bodyFormData);
        return bodyFormData;
    };

    // Handle body preparation based on offer type
    const handleBody = () => {
        const formValues = getFormValues();
        
        let body = {} as any;
        if (type === "Inks") {
            body = buildInkOfferBody(formValues);
        } else if (type === "Printers") {
            body = buildPrinterOfferBody(formValues);
        }

        // console.log('==========Update Offer Body==========================');
        // console.log("body", body);
        // console.log('====================================');

        const bodyFormData = prepareFormData(body);
        
        // console.log('====================================');
        // console.log(bodyFormData);
        // console.log('====================================');
        
        return bodyFormData;
    };

    // Handle Paper offer submission
const submitPaperOffer = (values: any) => {
  setstate(old => ({ ...old, loading: true }));

  const formData = new FormData();

  // 🔥 Important: PascalCase + String values
  formData.append("PaperOfferId", String(offerData.id));
  formData.append("PaperId", String(values.PaperType));
  formData.append("PaperSizeId", String(values.PaperSize));
  formData.append("Width", String(values.PaperWidth));
  formData.append("Min", String(values.PaperQuntaity || offerData.min || 1));
  formData.append("Price", String(values.PaperPrice));

  // ✅ required fields
  formData.append("Description", values.PaperDescription || "");

  // ✅ date لازم string
  if (uiState.date) {
    formData.append("EndDate", new Date(uiState.date).toISOString());
  }

  formData.append("IncludeDelivery", String(uiState.isdelervable));

  // 🔥 FIX 1: Branches (كان غلط)
  formData.append("Branches", String(values.Branches));

  // 🔥 FIX 2: Image (name لازم يبقى ImageUrl + condition صح)
  if (
    values.ImageUrl &&
    typeof values.ImageUrl === "object" &&
    "uri" in values.ImageUrl
  ) {
    formData.append("ImageUrl", {
      uri: values.ImageUrl.uri.startsWith("file://")
        ? values.ImageUrl.uri
        : `file://${values.ImageUrl.uri}`,
      name: values.ImageUrl.name || "image.jpg",
      type: values.ImageUrl.type || "image/jpeg",
    } as any);
  }

  // 🐞 Debug
  console.log("========= FormData =========");
  (formData as any)._parts?.forEach((p: any) => {
    console.log(p[0], p[1]);
  });
  console.log("============================");

  dispatch<any>(
    UpdatePaperOffer(formData, (res, status) => {
      if (res.status === 200) {
        navigateBackWithUpdatedItem();
        showToast({
          type: "ok",
          message: res?.message ?? t("Successfully Added Offer"),
        });
      } else {
        showToast({
          type: "error",
          message: res?.message ?? t("Something Went wrong"),
        });
      }

      setstate(old => ({ ...old, loading: false }));
    })
  );
};

    // Handle Ink offer submission
  const submitInkOffer = async () => {
  setstate(old => ({ ...old, loading: true }));

  let formData = handleBody(); // already FormData

  // 🔥 نطلع ImageUrl من الفورم
  const imageValue = formikRef.current?.values?.ImageUrl;

  // ❌ لو String (جاية من API) → نشيلها من FormData
  if (typeof imageValue === "string") {
    (formData as any)._parts = (formData as any)._parts.filter(
      (p: any) => p[0] !== "ImageUrl"
    );
  }

  // ✅ لو Object (user اختار صورة جديدة)
  if (
    imageValue &&
    typeof imageValue === "object" &&
    "uri" in imageValue
  ) {
    formData.append("ImageUrl", {
      uri: imageValue.uri.startsWith("file://")
        ? imageValue.uri
        : `file://${imageValue.uri}`,
      name: imageValue.name || "image.jpg",
      type: imageValue.type || "image/jpeg",
    } as any);
  }

  // 🐞 Debug
  console.log("========= FormData =========");
  (formData as any)._parts?.forEach((p: any) => {
    console.log(p[0], p[1]);
  });
  console.log("============================");

  dispatch<any>(
    UpdateInkOffer(formData, (res, status) => {
      if (res.status === 200) {
        navigateBackWithUpdatedItem();
        showToast({
          type: "ok",
          message: res?.message ?? t("Successfully Added Offer"),
        });
      } else {
        showToast({
          type: "error",
          message: res?.message ?? t("Something Went wrong"),
        });
      }

      setstate(old => ({ ...old, loading: false }));
    })
  );
};

    // Handle Printer offer submission
    const submitPrinterOffer = () => {
        let formData = handleBody();

        const imageValue = formikRef.current?.values?.ImageUrl;

        // Remove string ImageUrl (existing image from API)
        if (typeof imageValue === "string") {
            (formData as any)._parts = (formData as any)._parts.filter(
                (p: any) => p[0] !== "ImageUrl"
            );
        }

        // Append file object if user picked a new image
        if (
            imageValue &&
            typeof imageValue === "object" &&
            "uri" in imageValue
        ) {
            // Remove any existing ImageUrl entry first
            (formData as any)._parts = (formData as any)._parts.filter(
                (p: any) => p[0] !== "ImageUrl"
            );
            formData.append("ImageUrl", {
                uri: imageValue.uri.startsWith("file://")
                    ? imageValue.uri
                    : `file://${imageValue.uri}`,
                name: imageValue.name || "image.jpg",
                type: imageValue.type || "image/jpeg",
            } as any);
        }

        dispatch<any>(UpdatePrintingOffer(formData, (res, status) => {
            if (res.status === 200) {
                navigateBackWithUpdatedItem();
                showToast({ type: 'ok', message: res?.message ?? t("Successfully Added Offer") });
            } else {
                // console.log("res",res.message);
                
                showToast({ type: 'error', message: res?.message ?? t("Something Went wrong") });
            }
            setstate(old => ({ ...old, loading: false }));
        }));
    };

    // Main submit handler - routes to appropriate offer type handler
    const handleSubmit = (values: any) => {
        // console.log('====================================');
        // console.log("Submitting values:", values);
        // console.log('====================================');

        setstate(old => ({ ...old, loading: true }));

        if (type === "Paper") {
            submitPaperOffer(values);
        } else if (type === "Inks") {
            submitInkOffer();
        } else if (type === "Printers") {
            submitPrinterOffer();
        }
    };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const onChange = (event, selectedDate) => {
        setstate(old => ({ ...old, showDate: Platform.OS === 'ios' }));
        if (selectedDate && selectedDate >= new Date()) {
            setstate(old => ({ ...old, date: selectedDate }));
        }
    };


    useEffect(() => {
        getMyBranches();
        if( type === "Paper"){
            getAllPapersV2()
        }
    }, [])
    const getMyBranches = () => {
        setstate(old => ({ ...old, loading: true }))


        dispatch<any>(GetMyBranches((res, status) => {
            if (res.status === 200) {
                setstate(old => ({ ...old, branches: res.data }))
            
            } else {
                showToast({ type: 'error', message: res?.message ?? t("Something Went wrong") });
            }
            setstate(old => ({ ...old, loading: false }))
        }))
    };
    const getAllPapersV2 = () => {
        setstate(old => ({ ...old, loading: true }))


        dispatch<any>(GetAllPapersV2((res, status) => {
            if (res.status === 200) {
                setstate(old => ({ ...old, paperTypeList: res.data }))
           

            } else {
                showToast({ type: 'error', message: res?.message ?? t("Something Went wrong") });
            }
            setstate(old => ({ ...old, loading: false }))
        }))
    };
    

    const handleCameraPhotos = async (name) => {
        try {
            let file = null;

            if (name === "Camera") {
                file = await openAPPCamera();
            } else if (name === "Photos") {
                file = await openAPPPicker();
            }

            if (file?.uri) {
                formikRef.current?.setFieldValue("ImageUrl", {
                    uri: file.uri,
                    type: file.type,
                    name: file.name,
                });
                formikRef.current?.setFieldTouched("ImageUrl", true);
            } else {
                formikRef.current?.setFieldError(
                    "ImageUrl",
                    "Image is required"
                );
            }
        } catch (e) {
            // console.log(e);
        }
    };



// console.log('====================================');
// console.log("offerData:", offerData);
// console.log("state:", state);
// console.log('====================================');

    // ========================================
    // RENDER FUNCTIONS - ORGANIZED BY TYPE
    // ========================================

    // ===== TYPE 1: PAPER OFFER FORM =====
    const renderPaperForm = function (handleChange, handleBlur, errors, touched, values) {
     // console.log("touched",touched);
     // console.log("errors",errors);
     
     
        return (
            <View>
                <Pressable
                    style={styles.selectMenueCon}
                    onPress={() => {
                        setstate((old) => ({ ...old, showtype: true }));
                    } }
                >
                    <Text style={[layout.textAlign, styles.label]}>{t("paperType")}</Text>
                    <View style={[layout.rowBox, styles.selectMenue]}>
                        <Text style={styles.textselectmenu}>
                            {typeof uiState.paperType.id !== "string"
                                ? dir === "rtl"
                                    ? (uiState.paperType.arName ?? uiState.paperType.name)
                                    : uiState.paperType.name
                                : t("paperTypew")}
                        </Text>
                        {uiState.showtype ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    </View>
                    {errors.PaperType && <Text style={styles.errorText}>{t(errors.PaperType as any)}</Text>}
                </Pressable>

                <Pressable
                    style={styles.selectMenueCon}
                    onPress={() => {
                        setstate((old) => ({ ...old, showSize: true }));
                    } }
                >
                    <Text style={[layout.textAlign, styles.label]}>{t("paperSize")}</Text>
                    <View style={[layout.rowBox, styles.selectMenue]}>
                        <Text style={styles.textselectmenu}>
                            {typeof uiState.paperSize.id !== "string"
                                ? dir === "rtl"
                                    ? uiState.paperSize.arName
                                    : uiState.paperSize.name
                                : t("paperSizew")}
                        </Text>
                        {uiState.showSize ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    </View>
                    {errors.PaperSize && <Text style={styles.errorText}>{t(errors.PaperSize as any)}</Text>}
                </Pressable>

                <Inputs
                    label={t("paperWight")}
                    options={{
                        value: String(values.PaperWidth ?? ''),
                        onBlur: handleBlur("PaperWidth"),
                        onChangeText: handleChange("PaperWidth"),
                        placeholder: t("paperWightw"),
                        maxLength: 5,
                        keyboardType: "number-pad",
                    }}
                    password={false}
                    isPhone={false}
                    input={{}}
                    showErrorr={!!errors.PaperWidth}
                    error={errors.PaperWidth as any} />
            </View>
        );
    };

    // ===== TYPE 2: INKS OFFER FORM =====
    const renderInksForm = (handleChange, handleBlur, errors, touched, values) => (
        <View>
            <Pressable
                style={styles.selectMenueCon}
                onPress={() => {
                    setstate((old) => ({ ...old, showInks: true }));
                }}
            >
                <Text style={[layout.textAlign, styles.label]}>{t("inkType")}</Text>
                <View style={[layout.rowBox, styles.selectMenue]}>
                    <Text style={styles.textselectmenu}>
                        {typeof uiState.inks.id !== "string"
                            ? dir === "rtl"
                                ? (uiState.inks.arName ?? uiState.inks.name)
                                : uiState.inks.name
                            : t("inkTypew")}
                    </Text>
                    {uiState.showInks ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </View>
                {errors.InksType && <Text style={styles.errorText}>{t(errors.InksType as any)}</Text>}
            </Pressable>

            <Inputs
                label={t("inkBrand")}
                options={{
                    value: String(values.Brand ?? ''),
                    onBlur: handleBlur("Brand"),
                    onChangeText: handleChange("Brand"),
                    maxLength: 5,
                    keyboardType: "number-pad",
                }}
                password={false}
                isPhone={false}
                input={{}}
                showErrorr={!!errors.Brand}
                error={errors.Brand as any}
            />

            <Inputs
                label={t("inkCapacity")}
                options={{
                    value: String(values.InksWidth ?? ''),
                    onBlur: handleBlur("InksWidth"),
                    onChangeText: handleChange("InksWidth"),
                    placeholder: t("inkCapacityw"),
                    maxLength: 5,
                    keyboardType: "number-pad",
                }}
                password={false}
                isPhone={false}
                input={{}}
                showErrorr={!!errors.InksWidth}
                error={errors.InksWidth as any}
            />

            <Pressable
                style={styles.selectMenueCon}
                onPress={() => {
                    setstate((old) => ({ ...old, showColor: true }));
                }}
            >
                <Text style={[layout.textAlign, styles.label]}>{t("inkColor")}</Text>
                <View style={[layout.rowBox, styles.selectMenue]}>
                    <Text style={styles.textselectmenu}>
                        {typeof uiState.color.id !== "string"
                            ? dir === "rtl"
                                ? uiState.color.arName
                                : uiState.color.name
                            : t("inkColorw")}
                    </Text>
                    {uiState.showColor ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </View>
                {errors.Color && <Text style={styles.errorText}>{t(errors.Color as any)}</Text>}
            </Pressable>
        </View>
    );

    // ===== TYPE 3: PRINTERS OFFER FORM =====
    const renderPrintersForm = (handleChange, handleBlur, errors, touched, values) => (
        <View>
            <View style={{ marginBottom: PixelPerfect(20) }}>
                <Text style={[layout.textAlign, styles.label]}>{t("productImages")}</Text>
                <Pressable style={{ justifyContent: "center", alignItems: "center" }}
                    onPress={(() => {
                        setstate(old => ({ ...old, showFiltter: true }))
                    })}>
                    {values?.ImageUrl ? (
                        <ImageWithFallback
                            uri={typeof values?.ImageUrl === 'object' ? values?.ImageUrl?.uri : values?.ImageUrl}
                            type={offerData.type}
                            style={styles.imagePreview}
                            resizeMode="cover"
                        />
                    ) : (
                        <AddPhotoImage />
                    )}
                </Pressable>
                {errors.ImageUrl && touched.ImageUrl && <Text style={styles.errorText}>{t(errors.ImageUrl as any)}</Text>}
            </View>

            <Inputs
                label={t("printerColorPrice")}
                options={{
                    value: String(values.PaperPrice1 ?? ''),
                    onBlur: handleBlur("PaperPrice1"),
                    onChangeText: handleChange("PaperPrice1"),
                    placeholder: t("printerColorPricew"),
                    maxLength: 5,
                    keyboardType: "number-pad",
                }}
                password={false}
                isPhone={false}
                input={{}}
                showErrorr={!!errors.PaperPrice1}
                error={errors.PaperPrice1 as any}
            />
        </View>
    );

    // ===== COMMON FIELDS (USED BY ALL TYPES) =====
    const renderCommonFields = (handleChange, handleBlur, errors, touched, values) => (
        <>
            <Inputs
                label={
                    type === "Paper"
                        ? t("paperPrice")
                        : type === "Inks"
                            ? t("inkPriceUnit")
                            : t("printerBWPrice")
                }
                options={{
                    value: String(values.PaperPrice ?? ''),
                    onBlur: handleBlur("PaperPrice"),
                    onChangeText: handleChange("PaperPrice"),
                    placeholder:
                        type === "Paper"
                            ? t("paperPricew")
                            : type === "Inks"
                                ? t("paperPricew")
                                : t("printerBWPricew"),
                    maxLength: 5,
                    keyboardType: "number-pad",
                }}
                password={false}
                isPhone={false}
                input={{}}
                showErrorr={!!errors.PaperPrice}
                error={errors.PaperPrice as any}
            />

            {/* Paper & Inks: Min Quantity */}
            {(type === "Paper" || type === "Inks") && (
                <Pressable
                    style={styles.selectMenueCon}
                    onPress={() => {
                        setstate((old) => ({ ...old, showQuntity: true }));
                    }}
                >
                    <Text style={[layout.textAlign, styles.label]}>{t("papermintoorder")}</Text>
                    <View style={[layout.rowBox, styles.selectMenue]}>
                        <Text style={styles.textselectmenu}>
                            {typeof uiState.quantity.id !== "string"
                                ? dir === "rtl"
                                    ? uiState.quantity.arName
                                    : uiState.quantity.name
                                : t("papermintoordew")}
                        </Text>
                        {uiState.showQuntity ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    </View>
                    {errors.PaperQuntaity && <Text style={styles.errorText}>{t(errors.PaperQuntaity as any)}</Text>}
                </Pressable>
            )}

            {/* Printers: Printing Type */}
            {type === "Printers" && (
                <View style={styles.selectMenueCon}>
                    <Text style={[layout.textAlign, styles.label]}>{t("printingType")}</Text>
                    <View style={[layout.rowBox, styles.selectMenue, { borderWidth: 0, marginBottom: 0 }]}>
                        <Pressable style={[layout.rowBox, styles.yesNocon]}
                            onPress={()=>handelImediatePrinting(true)}
                        >
                            <View style={[styles.radioButton, { borderColor: !uiState.isImediatePrinting ? theme.active : theme.gray }]}>
                                {!uiState.isImediatePrinting ? <View style={styles.radioButtonSelected} /> : null}
                            </View>
                            <Text style={[styles.textselectmenu, { paddingHorizontal: PixelPerfect(5) }]}>
                                {t("printingImmediate")}
                            </Text>
                        </Pressable>
                        <Pressable style={[layout.rowBox, styles.yesNocon]}
                            onPress={()=>handelImediatePrinting(false)}
                        >
                            <View style={[styles.radioButton, { borderColor: uiState.isImediatePrinting ? theme.active : theme.gray }]}>
                                {uiState.isImediatePrinting ? <View style={styles.radioButtonSelected} /> : null}
                            </View>
                            <Text style={[styles.textselectmenu, { paddingHorizontal: PixelPerfect(5) }]}>
                                {t("printingScheduled")}
                            </Text>
                        </Pressable>
                    </View>
                    {errors.PaperDelevery && <Text style={styles.errorText}>{t(errors.PaperDelevery as any)}</Text>}
                </View>
            )}

            {/* Description */}
            <Inputs
                label={t("paperdis")}
                options={{
                    value: String(values.PaperDescription ?? ''),
                    onBlur: handleBlur("PaperDescription"),
                    onChangeText: handleChange("PaperDescription"),
                    numberOfLines: 2,
                    placeholder: t("paperdisw"),
                    maxLength: 250,
                    keyboardType: "default",
                    multiline: true,
                }}
                inputCon={{ height: 74, paddingTop: 17 }}
                input={{ height: 74, verticalAlign: "top" }}
                password={false}
                showErrorr={!!errors.PaperDescription}
                error={errors.PaperDescription as any}
            />

            {/* End Date */}
            <Pressable
                style={styles.selectMenueCon}
                onPress={() => {
                    setstate((old) => ({ ...old, showDate: true }));
                }}
            >
                <Text style={[layout.textAlign, styles.label]}>{t("paperDate")}</Text>
                <View style={[layout.rowBox, styles.selectMenue, { marginBottom: PixelPerfect(4), }]}>
                    {uiState.showDate ?
                        <DateTimePicker
                            value={uiState.date}
                            mode="date"
                            minimumDate={tomorrow}
                            locale="ar"
                            onChange={onChange}
                        />
                        : (Platform.OS == "android" && !uiState.showDate && uiState.date != new Date()) ? <View style={styles.dateCon}>
                            <Text style={[styles.textselectmenu, { color: theme.black }]}>
                                {moment(uiState.date).locale("en").format("YYYY/MM/DD")}
                            </Text>
                        </View> :
                            <Text style={styles.textselectmenu}>
                                {t("paperDate")}
                            </Text>}
                    <CalenderIcon />
                </View>
                <Text style={[layout.textAlign, styles.hint]}>{t("paperDatew")}</Text>
                {errors.PaperFinish && <Text style={[styles.errorText, {}]}>{t(errors.PaperFinish as any)}</Text>}
            </Pressable>

            {/* Branch Selection */}
            <Pressable
                style={styles.selectMenueCon}
                onPress={() => {
                    setstate((old) => ({ ...old, showBranches: true }));
                }}
            >
                <Text style={[layout.textAlign, styles.label]}>{t("paperBranch")}</Text>
                <View style={[layout.rowBox, styles.selectMenue]}>
                    <Text style={styles.textselectmenu}>
                        {typeof uiState.branches.branchId !== "string"
                            ?  uiState.branches.countryName
                              +" - "+ uiState.branches.regionName
                            : t("paperBranchw")}
                    </Text>
                    {uiState.showBranches ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </View>
                {errors.Branches && <Text style={styles.errorText}>{t(errors.Branches as any)}</Text>}
            </Pressable>

            {/* Delivery Option */}
            <View style={styles.selectMenueCon}>
                <Text style={[layout.textAlign, styles.label]}>{t("paperDelivery")}</Text>
                <View style={[layout.rowBox, styles.selectMenue, { borderWidth: 0, marginBottom: 0 }]}>
                    <Pressable style={[layout.rowBox, styles.yesNocon]}
                        onPress={handelDelery}
                    >
                        <View style={[styles.radioButton, { borderColor: uiState.isdelervable ? theme.active : theme.gray }]}>
                            {uiState.isdelervable ? <View style={styles.radioButtonSelected} /> : null}
                        </View>
                        <Text style={[styles.textselectmenu, { paddingHorizontal: PixelPerfect(5) }]}>
                            {t("yes")}
                        </Text>
                    </Pressable>
                    <Pressable style={[layout.rowBox, styles.yesNocon]}
                        onPress={handelDelery}
                    >
                        <View style={[styles.radioButton, { borderColor: !uiState.isdelervable ? theme.active : theme.gray }]}>
                            {!uiState.isdelervable ? <View style={styles.radioButtonSelected} /> : null}
                        </View>
                        <Text style={[styles.textselectmenu, { paddingHorizontal: PixelPerfect(5) }]}>
                            {t("no")}
                        </Text>
                    </Pressable>
                </View>
                {errors.PaperDelevery && touched.PaperDelevery && <Text style={styles.errorText}>{t(errors.PaperDelevery as any)}</Text>}
            </View>

            {/* Inks: Image Upload */}
            {type == "Inks" && (
                <View>
                    <Text style={[layout.textAlign, styles.label]}>{t("productImages")}</Text>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Pressable style={{ justifyContent: "center", alignItems: "center" }}
                            onPress={(() => {
                                setstate(old => ({ ...old, showFiltter: true }))
                            })}>
                            {values?.ImageUrl ? 
                                <ImageWithFallback
                                    uri={typeof values?.ImageUrl === 'object' ? values?.ImageUrl?.uri : values?.ImageUrl}
                                    type={offerData.type}
                                    style={styles.imagePreview}
                                    resizeMode="cover"
                                /> : <AddPhotoImage />}
                        </Pressable>
                    </View>
                    {errors.ImageUrl && <Text style={styles.errorText}>{t(errors.ImageUrl as any)}</Text>}
                </View>
            )}
        </>
    );

    // ===== MODALS & DROPDOWNS - ORGANIZED BY TYPE =====

    // ===== TYPE 1: PAPER MODALS =====
    const renderPaperModals = (setFieldValue, setFieldError) => (
        <>
            {uiState.showtype && (
                <DropDowenMenu
                    onCloseFn={(val) => {
                        if (typeof val?.id === "string") {
                            setstate((old) => ({
                                ...old,
                                showtype: false,
                            }));
                            setFieldError("PaperType", "You must pick a city!");
                        } else {
                            setFieldValue("PaperType", val.id);
                            setstate((old) => ({
                                ...old,
                                showtype: false,
                                selectedPaperType: val,
                            }));
                        }
                    } }
                    title={t("paperTypew")}
                    currentFilter={uiState.paperType}
                    // items={formattedPaperTypes}
                    items={uiState.paperTypeList}
                    style={{ flex: 0.3 }} name={formattedPaperTypes}                />
            )}

            {uiState.showSize && (
                <DropDowenMenu
                    onCloseFn={(val) => {
                        if (typeof val?.id === "string") {
                            setstate((old) => ({
                                ...old,
                                showSize: false,
                            }));
                            setFieldError("PaperSize", "You must pick a city!");
                        } else {
                            setFieldValue("PaperSize", val.id);
                            setstate((old) => ({
                                ...old,
                                showSize: false,
                                selectedPaperSize: val,
                            }));
                        }
                    }}
                    title={t("paperSizew")}
                    currentFilter={uiState.paperSize}
                    items={paperSize}
                    style={{ flex: 0.3 }}
                />
            )}
        </>
    );

    // ===== TYPE 2: INKS MODALS =====
    const renderInksModals = (setFieldValue, setFieldError) => (
        <>
            {uiState.showColor && (
                <DropDowenMenu
                    onCloseFn={(val) => {
                        if (typeof val?.id === "string") {
                            setstate((old) => ({
                                ...old,
                                showColor: false,
                            }));
                            setFieldError("Color", "You must pick a city!");
                        } else {
                            setFieldValue("Color", val.id);
                            setstate((old) => ({
                                ...old,
                                showColor: false,
                                selectedColor: val,
                            }));
                        }
                    }}
                    title={t("paperTypew")}
                    currentFilter={uiState.color}
                    items={colors}
                    style={{ flex: 0.3 }}
                />
            )}

            {uiState.showInks && (
                <DropDowenMenu
                    onCloseFn={(val) => {
                        if (typeof val?.id === "string") {
                            setstate((old) => ({
                                ...old,
                                showInks: false,
                            }));
                            setFieldError("InksType", "You must pick an ink type!");
                        } else {
                            setFieldValue("InksType", val.id);
                            setstate((old) => ({
                                ...old,
                                showInks: false,
                                selectedInks: val,
                            }));
                        }
                    }}
                    title={t("paperTypew")}
                    currentFilter={uiState.inks}
                    items={inks}
                    style={{ flex: 0.3 }}
                />
            )}
        </>
    );

    // ===== COMMON MODALS (ALL TYPES) =====
    const renderCommonModals = (setFieldValue, setFieldTouched, setFieldError) => (
        <>
            {/* Quantity Selection */}
            {(type === "Paper" || type === "Inks") && uiState.showQuntity && (
                <RadiobuttonChoice
                    onCloseFn={(val) => {
                        setFieldTouched("PaperQuntaity");
                        if (!val?.hasOwnProperty("isSelected")) {
                            setFieldError("PaperQuntaity", "You must choose a market!");
                            setstate((old) => ({
                                ...old,
                                showQuntity: false,
                            }));
                        } else {
                            setFieldValue("PaperQuntaity", val.name);
                            setstate((old) => ({
                                ...old,
                                showQuntity: false,
                                selectedPaperQuntaity: val,
                                forms: { selectedPaperQuntaity: "" },
                            }));
                        }
                    }}
                    title={t("lessOffer")}
                    currentFilter={uiState.quantity}
                    items={amounts}
                    style={{ flex: 0.6 }}
                    type={"activities"}
                    hasTextInput={false}
                    textinputTitle={t('lessOfferw')}
                />
            )}

            {/* Branch Selection */}
            {uiState.showBranches && (
                <DropDowenMenu
                    onCloseFn={(val) => {
                        if (typeof val?.branchId === "string") {
                            setstate((old) => ({
                                ...old,
                                showBranches: false,
                            }));
                            setFieldError("Branches", "You must pick a city!");
                        } else {
                            setFieldValue("Branches", val.branchId);
                            setstate((old) => ({
                                ...old,
                                showBranches: false,
                                selectedBranches: val,
                            }));
                        }
                    }}
                    title={t("Branches")}
                    currentFilter={uiState.branches}
                    items={uiState.branchList}
                    style={{ flex: 0.3 }}
                />
            )}

            {/* Image Picker */}
            {uiState.showFiltter && (
                <FilterOrder
                    title={t('Filter')}
                    items={filterOption}
                    currentFilter={filterOption}
                    onCloseFn={(val) => {
                        setstate(old => ({ ...old, showFiltter: false }))
                        setTimeout(() => {
                            handleCameraPhotos(val.Name);
                        }, 300);
                    }}
                />
            )}
        </>
    );



    return (
        <Container showHint={false}>

            <HeaderWithText
                title={
                    type === "Paper"
                        ? t("editPaperOfferTitle")
                        : type === "Inks"
                            ? t("editInkOfferTitle")
                            : type === "Printers"
                                ? t("editPrinterOfferTitle")
                                : ""
                }
            />
            

            <View style={styles.con}>
                <Formik
                    innerRef={formikRef}
                    validationSchema={type === "Paper" ? AddOfferPaper :( type === "Inks" ? AddOfferInks : AddOfferPrinter ) }
                    validateOnChange={true}
                    validateOnBlur={true}
                    initialValues={{
                        PaperType: offerData.paperId,
                        InksType: offerData.inkId,
                        Brand: offerData.brand,
                        Color: offerData.colorId,
                        PaperSize: offerData.paperSizeId,
                        PaperQuntaity: offerData.min,
                        Branches: offerData.branchId,
                        PaperWidth: offerData.width,
                        InksWidth: offerData.size,
                        PaperPrice: offerData.price,
                        PaperPrice1: offerData.coloredPrice,
                        PaperDescription: offerData.description,
                        PaperFinish: offerData.endDate,
                        PaperDelevery: offerData.includeDelivery,
                        ImageUrl: offerData.imageUrl,
                        ImediatePrinting: offerData.imediatePrinting,
                    }}
                    onSubmit={handleSubmit} >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched, setFieldError }) => {
                    
                      console.log("values",values);
                      
                        return (
                            <>
                                <Content
                                    noPadding
                                    style={styles.body}
                                    scrollEnabled={true}>

                                    {/* ===== TYPE SPECIFIC FORMS ===== */}
                                    {type === "Paper" && renderPaperForm(handleChange, handleBlur, errors, touched, values)}
                                    {type === "Inks" && renderInksForm(handleChange, handleBlur, errors, touched, values)}
                                    {type === "Printers" && renderPrintersForm(handleChange, handleBlur, errors, touched, values)}

                                    {/* ===== COMMON FIELDS (ALL TYPES) ===== */}
                                    {renderCommonFields(handleChange, handleBlur, errors, touched, values)}

                                    {/* ===== SUBMIT BUTTON ===== */}
                                    <Button
                                        title={t('editOffer')}
                                        styleTitle={styles.buttonText}
                                        onPress={handleSubmit}
                                        style={styles.button}
                                        loader={state.loading}
                                        disable={state.loading}
                                    />

                                    {/* ===== TYPE-SPECIFIC MODALS ===== */}
                                    {type === "Paper" && renderPaperModals(setFieldValue, setFieldError)}
                                    {type === "Inks" && renderInksModals(setFieldValue, setFieldError)}

                                    {/* ===== COMMON MODALS (ALL TYPES) ===== */}
                                    {renderCommonModals(setFieldValue, setFieldTouched, setFieldError)}
                                </Content>

                            </>
                        )
                    }}

                </Formik>

            </View>

        </Container>
    );
};

export default Index;

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string) =>
    StyleSheet.create({
        con: {
            flex: 0.9,
            paddingHorizontal: PixelPerfect(16)
        },
        body: {
            marginTop: PixelPerfect(8),
            flex: 0.9
        },
        selectMenueCon: {

        },
        label: {
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(18),
            color: theme.black,
            marginBottom: PixelPerfect(10),
            lineHeight: PixelPerfect(20)
        },
        selectMenue: {
            justifyContent: "space-between",
            backgroundColor: Colors.white,
            height: PixelPerfect(50),
            alignItems: "center",
            borderRadius: PixelPerfect(8),
            paddingHorizontal: PixelPerfect(10),
            marginBottom: PixelPerfect(20),
            borderWidth: PixelPerfect(1),
            borderColor: theme.optionText
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
            textAlign: dir === "rtl" ? "right" : "left",
            marginBottom: PixelPerfect(10),
            paddingHorizontal: PixelPerfect(10)
        },
        hint: {
            fontFamily: Fonts.extraLight,
            fontSize: PixelPerfect(12),
            color: theme.black,
            marginBottom: PixelPerfect(20),
        },
        button: {
            backgroundColor: Colors.secondColor,
            height: PixelPerfect(50),
            alignItems: "center",
            justifyContent: "center",
            marginTop: PixelPerfect(16),
            marginHorizontal: PixelPerfect(10)
        },
        buttonText: {
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(18),
            color: theme.mainColor,
        },
        radioButton: {
            height: PixelPerfect(20),
            width: PixelPerfect(20),
            borderRadius: PixelPerfect(20) / 2,
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
        },
        radioButtonSelected: {
            height: PixelPerfect(10),
            width: PixelPerfect(10),
            borderRadius: PixelPerfect(10) / 2,
            backgroundColor: theme.active,
        },
        yesNocon: {
            alignItems: "center",
            flex: 0.5
        },
        dateCon: {
            backgroundColor: theme.optionText,
            padding: PixelPerfect(5),
            borderRadius: PixelPerfect(5)
        },
        imagePreview: {
            width: PixelPerfect(100),
            height: PixelPerfect(100),
            borderRadius: PixelPerfect(8),
            resizeMode: "cover"
        }
    });