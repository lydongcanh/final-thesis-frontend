import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { FlatList } from "react-native";
import { MinimalProduct } from ".";

/**
 * 
 * @param {*} props products, title
 */
export default function ProductList(props) {
    
    const { products, title } = props;

    return (
        <Layout>
            <Text category="h6" style={{ margin: 8 }}>{title}</Text>
            <FlatList
                data={products}
                keyExtractor={(_, index) => index}
                numColumns={2}
                renderItem={({ item }) => <MinimalProduct product={item} />}
                style={{ flexWrap: "wrap" }}
            />
        </Layout>
    );
}