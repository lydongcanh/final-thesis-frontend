import React from "react";
import { Button, Layout, Text } from "@ui-kitten/components";
import { FlatList } from "react-native";

export default function YearSelector({ year, setYear, data = [2020] }) {
    return (
        <Layout style={{ margin: 8 }}>
            <Text category="label" appearance="hint">Chọn năm</Text>
            <FlatList 
                horizontal
                data={data}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Button
                        style={{ marginRight: 8, marginTop: 4, borderRadius: 24 }}
                        status={item === year ? "info" : "basic"}
                        size="tiny"
                        onPress={() => { 
                            if (item != year)
                                setYear(item);
                        }}
                    >
                        {item.toString()}
                    </Button>
                )}
            />
        </Layout>
    );
}