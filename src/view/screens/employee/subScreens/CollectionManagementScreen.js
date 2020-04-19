import React, { useState } from "react";
import { Layout, Text, Card } from "@ui-kitten/components";
import { CollectionService } from "../../../../core/services";
import { formatDate } from "../../../../core/utilities";
import ManagementTemplateScreen from "./ManagementTemplateScreen";
import { ManagementTypes } from "../../../types";

export default function CollectionManagementScreen({ navigation }) {

    const [data, setData] = useState([]);

    function handleNewButton() {
        navigation.navigate("CollectionDetails", { mode: ManagementTypes.CREATE });
    }

    /** When user click on a card. */
    function handleCollectionDetailsButton(collection) {
        navigation.navigate("CollectionDetails", { 
            mode: ManagementTypes.UPDATE,
            collection: collection 
        });
    }

    function handleConfigButton() {
        alert("Đang cập nhật");
    }

    function getCollectionListItemUI(collection) {
        return (
            <Card 
                style={{ margin: 16 }}
                onPress={() => handleCollectionDetailsButton(collection)}
            >
                <Text style={{ fontWeight: "bold" }}>{collection.name}</Text>
                <Text appearance="hint">Ngày tạo: {formatDate(collection.creationDate)}</Text>
                <Text appearance="hint">Số sản phẩm: {collection.details.length}</Text>
            </Card>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            <ManagementTemplateScreen 
                loadDataAsync={async () => await CollectionService.getAll()}
                handleNewButton={handleNewButton}
                handleConfigButton={handleConfigButton}
                getListItemUI={getCollectionListItemUI}
                data={data}
                setData={setData}
                navigation={navigation}
            />
        </Layout>
    );
}