import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { EmployeeService } from "../../../../core/services";
import ManagementTemplateScreen from "./ManagementTemplateScreen";

export default function EmployeeManagementScreen({ navigation }) {

    function handleNewButton() {
        navigation.navigate("AddEmployee");
    }

    function handleConfigButton() {
        alert("Đang cập nhật");
    }

    function getEmployeeListItemUI(employee) {
        return (
            <Text>{JSON.stringify(employee, null, 2)}</Text>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            <ManagementTemplateScreen 
                loadDataAsync={async () => await EmployeeService.getAll()}
                handleNewButton={handleNewButton}
                handleConfigButton={handleConfigButton}
                getListItemUI={getEmployeeListItemUI}
            />
        </Layout>
    );
}