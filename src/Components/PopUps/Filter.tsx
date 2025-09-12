
import React, { useContext, useState } from "react"

import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button } from "react-native";
import Modal from "react-native-modal";

import { IFont, ITheme } from "../../Constants/interfaces";
import { ThemeContext } from "../../Constants/theming";
import { Pressable } from "react-native-gesture-handler";


type Props = {

}

const Filter = (props: Props) => {
    const {

    } = props
    const GOVERNORATES = [
        "القاهرة",
        "الاسكندرية",
        "اسيوط",
        "الجيزة",
        "المنوفية",
        "اسوان",
        "الغردقة",
        "الاقصر",
        "سوهاج",
    ];
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selected, setSelected] = useState([]);


    const toggleGovernorate = (item) => {
        if (selected.includes(item)) {
            setSelected(selected.filter((x) => x !== item));
        } else {
            setSelected([...selected, item]);
        }
    };

    const isChecked = (item) => selected.includes(item);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.openButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={{ color: "#fff", fontSize: 16 }}>اختر المحافظة</Text>
            </TouchableOpacity>

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                    style={styles.modal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.sheet}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={{ fontSize: 18 }}>✕</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>اختر المحافظة</Text>
                        </View>

                        {/* List */}
                        <FlatList
                            data={GOVERNORATES}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.row}
                                    onPress={() => toggleGovernorate(item)}
                                >
                                    <View style={[styles.checkbox, isChecked(item) && styles.checked]}>
                                        <Text style={styles.checkMark}>✓</Text>
                                    </View>
                                    <Text style={styles.item}>{item}</Text>
                                 
                                </Pressable>
                            )}
                        />

                        {/* Actions */}
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.button, styles.resetButton]}
                                onPress={() => setSelected([])}
                            >
                                <Text style={{ color: "#007bff", fontSize: 16 }}>
                                    اعادة تعيين
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.searchButton]}
                                onPress={() => {
                                    console.log("المحافظات المختارة:", selected);
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={{ color: "#fff", fontSize: 16 }}>بحث</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );

}

export default Filter

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        container: { flex: 1, justifyContent: "center", alignItems: "center" },
        openButton: {
            backgroundColor: "#007bff",
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 8,
        },
        
        modalOverlay: {
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
        },
        sheet: {
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
            maxHeight: "70%",
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
        },
        title: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "bold" },
        row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
        item: { fontSize: 16 },
        checkbox: {
            width: 22,
            height: 22,
            borderWidth: 1.5,
            borderColor: "#999",
            marginRight: 10,
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center",
        },
        checked: {
            backgroundColor: "#007bff",
            borderColor: "#007bff",
        },
        checkMark: {
            color: "#000000",
            fontSize: 14,
            fontWeight: "bold",
        },
        actions: { flexDirection: "row", marginTop: 12 },
        button: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
        },
        resetButton: {
            borderWidth: 1,
            borderColor: "#007bff",
            marginRight: 8,
        },
        searchButton: { backgroundColor: "#007bff" },
    })