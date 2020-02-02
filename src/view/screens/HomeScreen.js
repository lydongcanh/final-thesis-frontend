import React from "react";
import { FlatList, ScrollView } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import products from "../../../test/mockData/products.json";
import MinimalProduct from "../components/products/MinimalProduct.js";
import ProductCarousel from "../components/products/ProductCarousel.js";
import { Divider } from "react-native-paper";

export default function HomeScreen() {

    return (
        <ScrollView>
            <Layout style={{ backgroundColor: "#f2f2f2" }}>
                <ProductCarousel
                    products={products}
                    title="Hot"
                />
                <Divider style={{ margin: 8 }}/>
                <Text category="h6" style={{ margin: 8 }}>All Products</Text>
                <FlatList
                    data={products}
                    keyExtractor={() => Math.random()}
                    numColumns={2}
                    renderItem={({ item }) => <MinimalProduct product={item} />}
                    style={{ flexWrap: "wrap" }}
                />
            </Layout>
        </ScrollView>
    )
}