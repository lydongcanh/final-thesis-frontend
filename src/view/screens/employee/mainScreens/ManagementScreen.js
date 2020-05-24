import React from "react";
import { Platform, StatusBar } from "react-native";
import { Layout, List, ListItem, Icon } from "@ui-kitten/components";
import { EmployeeScreensHeader } from "../../../components/others";

export default function ManagementScreen({ navigation }) {

    const managementFunctionDatas = [
        {
            title: "Sản phẩm & Loại sản phẩm",
            icon: "layers-outline",
            callback: () => navigation.navigate("EmployeeCategoryManagement")
        },
        {
            title: "Bộ sưu tập",
            icon: "bookmark-outline",
            callback: () => navigation.navigate("EmployeeCollectionManagement")
        },
        // {
        //     title: "Khuyến mãi",
        //     icon: "scissors-outline",
        //     callback: () => { alert("Đang cập nhật")}
        // },
        {
            title: "Nhân viên",
            icon: "people-outline",
            callback: () => navigation.navigate("EmployeeEmployeeManagement")
        },
        {
            title: "Khách hàng",
            icon: "person-outline",
            callback: () => navigation.navigate("EmployeeCustomerManagement")
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