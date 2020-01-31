import React from "react";
import { SafeAreaView, Text } from "react-native";
import LoginPanel from "../components/molecules/LoginPanel";

export default function HomeScreen() {    
    return (
        <SafeAreaView style={{flex: 1, justifyContent: "flex-start", alignContent: "center", padding: 8}}>
            <Text>Final thesis!</Text>
            <LoginPanel />
        </SafeAreaView>
    );
}