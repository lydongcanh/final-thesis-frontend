import React from "react";
import { Platform, StatusBar } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import { EmployeeScreensHeader } from "../../../components/others";

export default function OrderScreen({ navigation }) {
    return (
        <Layout style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight }}>
            <EmployeeScreensHeader navigation={navigation} />
            <Text>Orders</Text>
        </Layout>
    );
}