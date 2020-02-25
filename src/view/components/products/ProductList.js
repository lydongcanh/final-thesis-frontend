import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native";
import { MinimalProduct } from ".";

/**
 * 
 * @param {*} props products, title
 */
export default function ProductList(props) {

    const { products, title } = props;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text category="h6" style={{ margin: 8 }}>{title}</Text>
            <FlatList
                data={products}
                keyExtractor={(item, index) => item.title + index}
                numColumns={2}
                renderItem={({ item }) => <MinimalProduct product={item} size={150} />}
                style={{ flexWrap: "wrap" }}
            />
        </SafeAreaView>
    );
}