import React from "react";
import { Image } from "react-native";
import { Layout, Card, Text } from "@ui-kitten/components";
import { ProductService } from "../../../../core/services";
import { formatCurrency } from "../../../../core/utilities";
import ManagementTemplateScreen from "./ManagementTemplateScreen";
import { ManagementTypes } from "../../../types";

export default function ProductManagementScreen({ navigation }) {

    function handleNewButton() {
        navigation.navigate("ProductDetails", { mode: ManagementTypes.CREATE });
    }

    function handleConfigButton() {
        alert("Đang cập nhật");
    }

    function getProductListItemUI(product) {
        return (
            <Card 
                style={{ margin: 16 }}
                onPress={() => alert(JSON.stringify(product, null, 2))}
            >
                <Layout style={{ flexDirection: "row" }}>
                    <Image 
                        source={{ uri: product.mainImage }}
                        style={{ borderRadius: 50, width: 50, height: 50 }}
                    />
                    <Layout style={{ margin: 8, alignContent: "center" }}>
                        <Text style={{ fontWeight: "bold" }}>{product.name}</Text>
                        <Text appearance="hint">{formatCurrency(product.unitPrice)}VND</Text>
                    </Layout>
                </Layout>
            </Card>
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