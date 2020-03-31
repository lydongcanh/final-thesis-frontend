import React from "react";
import { Platform, StatusBar } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import { CustomerScreensHeader } from "../../../components/others";

export default function FavouriteScreen({ navigation }) {
    return (
        <Layout style={{  marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight, }}>
            <CustomerScreensHeader navigation={navigation} />
            <Text>Favourite Screen</Text>
        </Layout>
    );
}