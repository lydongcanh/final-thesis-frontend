import React from "react";
import { Image } from "react-native";
import { Layout, Text, Button } from "@ui-kitten/components";
import { formatCurrency } from "../../../core/utilities";

/**
 * 
 * @param param0 product
 */
export default function ProductVerticalListItem({ product, showCategory = true, showRemoveButton = false }) {
    
    function getCategory() {
        if (showCategory) {
            return (
                <Text 
                    appearance="hint" 
                    category="label"
                >
                    {product.category ? product.category.name : "Chưa chỉnh loại sản phẩm"}
                </Text>
            );
        }
    }
    return (
        <Layout style={{ flexDirection: "row", marginLeft: 16, marginTop: 8, alignItems: "center" }}>
            <Image 
                source={{ uri: product.mainImage }}
                style={{ borderRadius: 50, width: 50, height: 50 }}
            />
            <Layout style={{ margin: 8, alignContent: "center" }}>
                <Text style={{ fontWeight: "bold" }}>{product.name}</Text>
                {getCategory()}
                <Text appearance="hint" category="label">{formatCurrency(product.unitPrice)}VND</Text>
            </Layout>
            <Button
                style={{ position: "absolute", right: 0 }}
                size="tiny"
                appearance="ghost"
            />
        </Layout>
    );
}