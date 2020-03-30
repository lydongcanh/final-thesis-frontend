import React from "react";
import { Image } from "react-native";
import { Card, Text, Layout, Icon, Button } from "@ui-kitten/components";

/**
 * @param props product, size
 */
export default function MinimalProduct({ product }) {

    function getCardHeader() {
        return (
            <Layout>
                <Image style={{ width: 150, height: 150 }} source={{ uri: product.mainImage }} />
                <Button 
                    size="tiny"
                    status="control"
                    icon={(style) => <Icon {...style} name="heart-outline" />} 
                    style={{ position: "absolute", top: 8, right: 8, height: 24, width: 24, borderRadius: 12 }}
                />
            </Layout>
        );
    }

    return (
        <Card
            style={{ flex: 1, margin: 8 }}
            header={getCardHeader}
        >
            <Text numberOfLines={1} style={{ width: 100 }}>{product.name}</Text>
            <Text appearance="hint" >${product.unitPrice}</Text>
        </Card>
    );
}