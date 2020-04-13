import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { AccountService } from "../../../../core/services";
import ManagementTemplateScreen from "./ManagementTemplateScreen";

export default function CollectionManagementScreen() {

    function handleConfigButton() {
        alert("Đang cập nhật");
    }

    function getAccountListItemUI(collection) {
        return (
            <Text>{JSON.stringify(collection, null, 2)}</Text>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            <ManagementTemplateScreen 
                loadDataAsync={async () => await AccountService.getAll()}
                handleConfigButton={handleConfigButton}
                getListItemUI={getAccountListItemUI}
            />
        </Layout>
    );
}