import React from "react";
import { ScrollView, Platform, StatusBar } from "react-native";
import { Layout } from "@ui-kitten/components";
import products from "../../../test/mockData/products.json";
import { Divider } from "react-native-paper";
import { ProductCarousel, ProductList } from "../components/products";

export default function HomeScreen() {

    return (
        <Layout style={{
            marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
        }}>
            <ScrollView>
                <Layout>
                    <ProductCarousel
                        products={products}
                        title="Hot"
                    />
                    <Divider style={{ margin: 8 }} />
                    <ProductList
                        products={products}
                        title="All items"
                    />
                </Layout>
            </ScrollView>
        </Layout>
    )
}