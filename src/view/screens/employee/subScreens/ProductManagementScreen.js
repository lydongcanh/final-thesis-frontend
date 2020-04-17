import React, { useState } from "react";
import { Image } from "react-native";
import { Layout, Card, Text, Button, Icon } from "@ui-kitten/components";
import { ProductService } from "../../../../core/services";
import { formatCurrency } from "../../../../core/utilities";
import ManagementTemplateScreen from "./ManagementTemplateScreen";
import { ManagementTypes } from "../../../types";

export default function ProductManagementScreen({ navigation }) {

    const [data, setData] = useState([]);

    function handleNewButton() {
        navigation.navigate("ProductDetails", { mode: ManagementTypes.CREATE });
    }

    function handleConfigButton() {
        alert("Đang cập nhật");
    }

    function handleProductInfoButton(product) {
        navigation.navigate("ProductDetails", { product: product })
    }

    function handleProductDetailsButton(product) {
        alert(JSON.stringify(product.category, null, 2));
    }

    function getProductHeader(product) {
        return (
            <Layout style={{ flexDirection: "row", marginLeft: 16, marginTop: 8, alignItems: "center" }}>
                <Image 
                    source={{ uri: product.mainImage }}
                    style={{ borderRadius: 50, width: 50, height: 50 }}
                />
                <Layout style={{ margin: 8, alignContent: "center" }}>
                    <Text style={{ fontWeight: "bold" }}>{product.name}</Text>
                    <Text appearance="hint" category="label">{product.category ? product.category.name : "Chưa chỉnh loại sản phẩm"}</Text>
                    <Text appearance="hint" category="label">{formatCurrency(product.unitPrice)}VND</Text>
                </Layout>
            </Layout>
        );
    }

    function getProductBottomPanel(product) {
        return (
            <Layout style={{ flex: 1, justifyContent: "flex-end", flexDirection: "row" }}>
                <Button 
                    appearance="ghost"
                    size="tiny" 
                    style={{ borderRadius: 20 }}
                    icon={style => <Icon {...style} name="edit-2-outline" />}
                    onPress={() => handleProductInfoButton(product)}
                >
                    Thông tin
                </Button>
                <Button 
                    appearance="ghost"
                    size="tiny" 
                    style={{ borderRadius: 20 }}
                    icon={style => <Icon {...style} name="inbox-outline" />}
                    onPress={() => handleProductDetailsButton(product)}
                >
                    Chi tiết
                </Button>
            </Layout>
        );
    }

    function getProductListItemUI(product) {
        return (
            <Card 
                style={{ margin: 16 }}
                disabled
                header={() => getProductHeader(product)}
            >
                {getProductBottomPanel(product)}
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
                data={data}
                setData={setData}
                navigation={navigation}
            />
        </Layout>
    );
}