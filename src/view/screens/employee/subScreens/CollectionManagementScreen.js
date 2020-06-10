import React, { useState } from "react";
import { Layout, Text, Card } from "@ui-kitten/components";
import { CollectionService } from "../../../../core/services";
import { formatDate } from "../../../../core/utilities";
import ManagementTemplateScreen from "./ManagementTemplateScreen";
import { ManagementTypes } from "../../../types";

export default function CollectionManagementScreen({ navigation }) {

    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");

    function handleNewButton() {
        navigation.navigate("CollectionDetails", { 
            mode: ManagementTypes.CREATE,
            collections: data
        });
    }

    /** When user click on a card. */
    function handleCollectionDetailsButton(collection) {
        navigation.navigate("CollectionDetails", { 
            mode: ManagementTypes.UPDATE,
            collection: collection,
            collections: data
        });
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

    function handleOnSearch(text) {
        setSearchText(text);
    }

    function getData() {
        return data.filter(c => c.name.includes(searchText));
    }

    return (
        <Layout style={{ flex: 1 }}>
            <ManagementTemplateScreen 
                loadDataAsync={async () => await CollectionService.getAll()}
                handleNewButton={handleNewButton}
                getListItemUI={getCollectionListItemUI}
                data={getData()}
                setData={setData}
                navigation={navigation}
                showConfig={false}
                handleOnSearch={handleOnSearch}
            />
        </Layout>
    );
}