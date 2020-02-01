import React from "react";
import { Image } from "react-native";
import { Button, Card, Icon, Layout, Text } from "@ui-kitten/components";

/**
 * Display only primary infomations of a product.
 * Should be used in a list, carousel...
 * @param props product
 */

export default function MinimalProduct(props) {

    const { product } = props;

    const cardHeader = () => (
        <Image style={{ height: 200 }} source={{ uri: product.image }} />
    );

    const cardFooter = () => (
        <Layout style={{ 
                maxHeight: 50, 
                flexDirection: "row", 
                justifyContent: "space-between" 
            }}
        >
            <Text category="s1" style={{ alignSelf: "center" }}>
                {"$" + product.price}
            </Text>
            <Button
                appearance="ghost"
                icon={style => <Icon {...style} name="shopping-cart" />}
                onPress={() => alert(JSON.stringify(product, null, 2))}
                style={{
                    borderRadius: 8,
                    width: 20,
                    height: 20,
                    alignSelf: "center"
                }}
                status="danger"
            />
        </Layout>
    );

    return (
        <Card
            appearance="filled"
            footer={cardFooter}
            header={cardHeader}
            style={{
                flex: 1,
                margin: 8,
                borderRadius: 20
            }}>
            <Text category="s1">{product.title}</Text>
            <Text>Lorem Ipsum</Text>
        </Card>
    );
}