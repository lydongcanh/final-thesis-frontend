import React from "react";
import { Card, Text } from "@ui-kitten/components";
import { Platform, StatusBar } from "react-native";

export default function Header() {
    return (
        <Card 
            style={{ 
                backgroundColor: "grey",
                borderRadius: 0, 
                marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
            }}
        >
            <Text style={{ alignContent: "center" }}>Final Thesis</Text>
        </Card>
    );
}