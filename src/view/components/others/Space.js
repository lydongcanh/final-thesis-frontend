import React from "react";
import { View } from "react-native";

export default function Space(props) {
    return (
        <View 
            style={{
                margin: props.value != null ? props.value : 8
            }}
        />
    )
}
