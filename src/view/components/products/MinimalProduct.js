import React from "react";
import { Image } from "react-native";
import { Button, Card, Icon, Layout, Text } from "@ui-kitten/components";
import { Surface } from "react-native-paper";

/**
 * Display only primary infomations of a product.
 * Should be used in a list, carousel...
 * @param props product, size
 */

export default function MinimalProduct(props) {

    const { product, size } = props;
    
    const cardHeader = () => (
        <Image style={{ height: size }} source={{ uri: product.image }} />
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
                icon={style => <Icon {...style} name="shopping-cart-outline" />}
                onPress={() => alert(JSON.stringify(product, null, 2))}
                style={{
                    alignSelf: "center",
                    height: 20,
                    width: 20,
                }}
                status="danger"
            />
        </Layout>
    );

    return (
        <Surface style={{
            borderRadius: 20,
            elevation: 4,
            flex: 1,
            margin: 8,
        }}>
            <Card
                appearance="filled"
                footer={cardFooter}
                header={cardHeader}
                style={{borderRadius: 20}}
            >
                <Text category="s1">{product.title}</Text>
                <Text>Lorem Ipsum</Text>
            </Card>
        </Surface>
    );
}