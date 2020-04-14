import React from "react";
import { Button, Layout, Text } from "@ui-kitten/components";
import { FlatList } from "react-native";
import { GENDERS } from "../../../core/types";

/**
 * @param pros gender, setGender
 */
export default function GenderSelector({ gender, setGender }) {

    return (
        <Layout style={{ margin: 8 }}>
            <Text category="label" appearance="hint">Giới tính</Text>
            <FlatList 
                horizontal
                data={GENDERS}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Button
                        style={{ marginRight: 8, marginTop: 4, borderRadius: 24 }}
                        status={item === gender ? "success" : "basic"}
                        size="tiny"
                        onPress={() => setGender(item)}
                    >
                        {item}
                    </Button>
                )}
            />
        </Layout>
    );
}