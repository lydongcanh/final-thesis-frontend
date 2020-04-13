import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { ProductService } from "../../../../core/services";
import ManagementTemplateScreen from "./ManagementTemplateScreen";

export default function ProductManagementScreen({ navigation }) {

    function handleNewButton() {
        navigation.navigate("AddProduct");
    }

    function handleConfigButton() {
        alert("Đang cập nhật");
    }

    function getProductListItemUI(employee) {
        return (
            <Text>{JSON.stringify(employee, null, 2)}</Text>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            <ManagementTemplateScreen 
                loadDataAsync={async () => await ProductService.getAll()}
                handleNewButton={handleNewButton}
                handleConfigButton={handleConfigButton}
                getListItemUI={getProductListItemUI}
            />
        </Layout>
    );
}