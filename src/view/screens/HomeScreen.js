import React from "react";
import { ScrollView, Platform, StatusBar } from "react-native";
import { Layout } from "@ui-kitten/components";
import products from "../../../test/mockData/products.json";
import { Divider } from "react-native-paper";
import { ProductCarousel, ProductList } from "../components/products";
import { SafeAreaView } from "react-navigation";

export default function HomeScreen() {

    return (
        <SafeAreaView style={{
            marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
            justifyContent: "center",
            flex: 1
        }}>
            <ScrollView
                scrollEventThrottle={200}
                directionalLockEnabled={true}
                style={{ flex: 1 }}
            >
                <ProductCarousel
                    products={products}
                    title="Hot"
                />
                <Divider style={{ margin: 8 }} />
                <ProductList
                    products={products}
                    title="All items"
                    style={{ flex: 3 }}
                />
            </ScrollView>
        </SafeAreaView>
    )
}