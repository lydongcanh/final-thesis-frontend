import React from "react";
import { Button, Layout, Text } from "@ui-kitten/components";
import { FlatList } from "react-native";

/**
 * @param param0 quarter, setQuarter
 */
export default function QuarterSelector({ quarter, setQuarter }) {

    const data = [1, 2, 3, 4];

    return (
        <Layout style={{ margin: 8 }}>
            <Text category="label" appearance="hint">Chọn quý</Text>
            <FlatList 
                horizontal
                data={data}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Button
                        style={{ marginRight: 8, marginTop: 4, borderRadius: 24 }}
                        status={item === quarter ? "info" : "basic"}
                        size="tiny"
                        onPress={() => setQuarter(item)}
                    >
                        Quý {item}
                    </Button>
                )}
            />
        </Layout>
    );
}