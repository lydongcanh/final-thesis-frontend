import React from "react";
import { FlatList, ScrollView } from "react-native";
import { Layout } from "@ui-kitten/components";
import products from "../../../test/mockData/products.json";
import MinimalProduct from "../components/products/MinimalProduct.js";

export default function HomeScreen() {

    return (
        <ScrollView>
            <Layout style={{ backgroundColor: "#f2f2f2" }}>
                <FlatList
                    data={products}
                    keyExtractor={() => Math.random()}
                    numColumns={2}
                    style={{ flexWrap: "wrap" }}
                    renderItem={({ item }) => <MinimalProduct product={item} />}
                />
            </Layout>
        </ScrollView>
    )
}