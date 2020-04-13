import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { CollectionService } from "../../../../core/services";
import ManagementTemplateScreen from "./ManagementTemplateScreen";

export default function CollectionManagementScreen({ navigation }) {

    function handleNewButton() {
        navigation.navigate("AddCollection");
    }

    function handleConfigButton() {
        alert("Đang cập nhật");
    }

    function getCollectionListItemUI(collection) {
        return (
            <Text>{JSON.stringify(collection, null, 2)}</Text>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            <ManagementTemplateScreen 
                loadDataAsync={async () => await CollectionService.getAll()}
                handleNewButton={handleNewButton}
                handleConfigButton={handleConfigButton}
                getListItemUI={getCollectionListItemUI}
            />
        </Layout>
    );
}