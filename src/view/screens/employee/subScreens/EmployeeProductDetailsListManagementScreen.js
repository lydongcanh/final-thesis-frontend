import React, { useState } from "react";
import { Layout, Text, Card } from "@ui-kitten/components";
import ManagementTemplateScreen from "./ManagementTemplateScreen";
import { ProductDetailsService } from "../../../../core/services";
import { ManagementTypes } from "../../../types";

export default function EmployeeProductDetailsListManagementScreen({ navigation, route }) {

    const product = route ? route.params.product : null;
    const [data, setData] = useState([]);
    
    async function loadProductDetailsAsync() {
        if (!product)
            return;
        
        return await ProductDetailsService.getDetaisByProductId(product.id);
    }

    function handleNewButton() {
        navigation.navigate("ProductDetailsListDetails", {
            product: product,
            productDetails: data,
            mode: ManagementTypes.CREATE
        });
    }

    function getProductDetailListItemUI(detail) {
        return (
            <Card
                style={{ margin: 16 }}
                onPress={() => alert(JSON.stringify(detail, null, 2))}
            >
                <Text>Size: {detail.size} | Màu: {detail.color}</Text>
                <Text>Sản phẩm tồn kho: {detail.unitsInStock}</Text>
            </Card>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            <ManagementTemplateScreen 
                loadDataAsync={loadProductDetailsAsync}
                handleNewButton={handleNewButton}
                //handleConfigButton={handleConfigButton}
                getListItemUI={getProductDetailListItemUI}
                data={data}
                setData={setData}
                navigation={navigation}
                showConfig={false}
                showSearchBox={false}
            />
        </Layout>
    );
}