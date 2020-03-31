import React from "react";
import { Platform, StatusBar } from "react-native";
import { Layout, Text } from "@ui-kitten/components";

export default function CartScreen() {
    return (
        <Layout style={{
            marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
        }}>
            <Text>Cart Screen</Text>
        </Layout>
    );
}