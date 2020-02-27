import React from "react";
import { View } from "react-native";

/**
 * @param {*} props value?, 
 */
export default function Space(props) {
    return (
        <View 
            style={{
                margin: props.value != null ? props.value : 8
            }}
        />
    )
}
