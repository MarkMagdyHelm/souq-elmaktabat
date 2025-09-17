import React, { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { Formik, FormikProps } from "formik";
import { validationSchema } from "../../../../Validation/Form1Refistration";
import Inputs from "../../../../Components/inputs";
import DropDowenMenu from "../../../../Components/DropDowenMenus/DropDowenMenu";
import { ArrowDownIcon, ArrowUpIcon } from "../../../../Assets/Svg";
import { ThemeContext } from "../../../../Constants/theming";
import { t } from "i18next";

type Props = {
  formikRef: React.RefObject<FormikProps<any>>;
  email: string;
  state: any;
  setstate: React.Dispatch<React.SetStateAction<any>>;
  setActiveStep: (step: number) => void;
  roles: any[];
  styles: any;
};

const FormStep1 = ({ formikRef, email, state, setstate, setActiveStep, roles, styles }: Props) => {
  const { layout, dir } = useContext(ThemeContext);

  return (
    <Formik
      validationSchema={validationSchema}
      innerRef={formikRef}
      initialValues={{
        Name: "",
        Email: email,
        Password: "",
        ConfirmPassword: "",
        PhoneNumber: "",
        Role: "",
      }}
      onSubmit={() => {}}
    >
      {({ handleChange, handleBlur, errors, touched, setFieldValue, setFieldTouched, setFieldError }) => (
        <>
          <Inputs
            label={t("fullname")}
            options={{
              onBlur: handleBlur("Name"),
              onChangeText: handleChange("Name"),
              placeholder: t("fullnamew"),
              maxLength: 100,
            }}
            password={false}
            showErrorr={(errors.Name && touched.Name) as boolean}
            error={errors.Name as any}
          />

          <Inputs
            label={t("Phone")}
            options={{
              onBlur: handleBlur("PhoneNumber"),
              onChangeText: handleChange("PhoneNumber"),
              placeholder: t("Phonew"),
              maxLength: 11,
              keyboardType: "number-pad",
            }}
            password={false}
            isPhone={true}
            input={{ width: "73%" }}
            showErrorr={(errors.PhoneNumber && touched.PhoneNumber) as boolean}
            error={errors.PhoneNumber as any}
          />

          <Inputs
            label={t("Email")}
            options={{
              onBlur: handleBlur("Email"),
              placeholder: "example@email.com",
              editable: false,
              value: email,
            }}
            password={false}
            showErrorr={(errors.Email && touched.Email) as boolean}
            error={errors.Email as any}
          />

          <Inputs
            label={t("pasword")}
            options={{
              onBlur: handleBlur("Password"),
              onChangeText: handleChange("Password"),
              placeholder: t("paswordw"),
              maxLength: 30,
            }}
            password={true}
            showErrorr={(errors.Password && touched.Password) as boolean}
            error={errors.Password as any}
          />

          <Inputs
            label={t("confirmpasword")}
            options={{
              onBlur: handleBlur("ConfirmPassword"),
              onChangeText: handleChange("ConfirmPassword"),
              placeholder: t("confirmpaswordw"),
              maxLength: 30,
            }}
            password={true}
            showErrorr={(errors.ConfirmPassword && touched.ConfirmPassword) as boolean}
            error={errors.ConfirmPassword as any}
          />

          <Pressable
            style={styles.selectMenueCon}
            onPress={() => {
              setFieldTouched("Role");
              setstate((old) => ({ ...old, showRols: true }));
            }}
          >
            <Text style={[layout.textAlign, styles.label]}>{t("AccountType")}</Text>
            <View style={[layout.rowBox, styles.selectMenue]}>
              <Text style={styles.textselectmenu}>
                {state.selectedRole.id ? (dir === "rtl" ? state.selectedRole.arName : state.selectedRole.name) : t("AccountTypew")}
              </Text>
              {state.showRols ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </View>
            {errors.Role && touched.Role && <Text style={styles.errorText}>{t(errors.Role as any)}</Text>}
          </Pressable>

          {state.showRols && (
            <DropDowenMenu
              onCloseFn={(val) => {
                if (!val?.id) {
                  setstate((old) => ({
                    ...old,
                    showRols: false,
                    forms: { ...state.forms, Role: "You must pick a role!" },
                  }));
                  setFieldError("Role", "You must pick a role!");
                } else {
                  setFieldValue("Role", val.id);
                  setstate((old) => ({
                    ...old,
                    showRols: false,
                    selectedRole: val,
                    forms: { ...state.forms, Role: "" },
                  }));
                  setActiveStep(2);
                }
              }}
              title={t("Choose Account Type")}
              currentFilter={state.selectedRole}
              items={roles}
              style={{ flex: 0.2 }}
            />
          )}
        </>
      )}
    </Formik>
  );
};

export default FormStep1;
