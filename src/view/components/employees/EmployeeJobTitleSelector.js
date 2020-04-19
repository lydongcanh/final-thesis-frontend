import React from "react";
import { FlatList } from "react-native";
import { Text, Layout, Button } from "@ui-kitten/components";
import { JOB_TITLES } from "../../../core/types";

/**
 * @param props jobTitle, setJobTitle
 */
export default function EmployeeJobTitleSelector({ jobTitle, setJobTitle  }) {

    return (
        <Layout style={{ margin: 8 }}>
            <Text category="label" appearance="hint">Chức vụ</Text>
            <FlatList 
                horizontal
                data={JOB_TITLES}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Button
                        style={{ marginRight: 8, marginTop: 4, borderRadius: 24 }}
                        status={item === jobTitle ? "info" : "basic"}
                        size="tiny"
                        onPress={() => setJobTitle(item)}
                    >
                        {item}
                    </Button>
                )}
            />
        </Layout>
    );
}