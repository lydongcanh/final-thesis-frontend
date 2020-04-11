import React from "react";
import { Platform, StatusBar } from "react-native";
import { Layout, Text, List, ListItem, Icon } from "@ui-kitten/components";
import { Divider } from "react-native-paper";
import { EmployeeScreensHeader } from "../../../components/others";

export default function ManagementScreen({ navigation }) {

    const managementFunctionDatas = [
        {
            title: "Sản phẩm",
            icon: "arrow-right-outline",
            callback: () => { alert("Đang cập nhật") }
        },
        {
            title: "Bộ sưu tập",
            icon: "arrow-right-outline",
            callback: () => { alert("Đang cập nhật")}
        },
        {
            title: "Khuyến mãi",
            icon: "arrow-right-outline",
            callback: () => { alert("Đang cập nhật")}
        },
        {
            title: "Nhân viên",
            icon: "arrow-right-outline",
            callback: () => { alert("Đang cập nhật")}
        },
        {
            title: "Khách hàng",
            icon: "arrow-right-outline",
            callback: () => { alert("Đang cập nhật")}
        },
        {
            title: "Tài khoản",
            icon: "arrow-right-outline",
            callback: () => { alert("Đang cập nhật")}
        },
    ];


    function getManagementFunctionUI({ item }) {
        return (
            <Layout style={{ marginTop: 8, marginBottom: 8 }}>
                <ListItem
                    title={item.title}
                    icon={style => <Icon {...style} name={item.icon} />}
                    accessory={style => <Icon {...style} name="chevron-right-outline" />}
                    onPress={item.callback}
                />
            </Layout>
        );
    }

    return (
        <Layout style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight }}>
            <EmployeeScreensHeader navigation={navigation} />
            <Layout style={{ flex: 1, padding: 4 }}>
                <List
                    style={{ backgroundColor: "white" }}
                    data={managementFunctionDatas}
                    renderItem={getManagementFunctionUI}
                />
            </Layout>
        </Layout>
    );
}