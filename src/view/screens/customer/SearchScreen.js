import React, { useEffect, useState } from "react";
import { ScrollView, FlatList } from "react-native-gesture-handler";
import { Layout, Text, Input, Icon } from "@ui-kitten/components";
import { Surface } from "react-native-paper";
import { Image   } from "react-native";
import { CategoryService } from "../../../core/services";

export default function SearchScreen() {

    const [categories, setCategories] = useState();

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        const result = await CategoryService.getAllRoot();
        if (result.data) {
            for (const category of result.data) {
                setChildren(category);
            }
            setCategories(result.data);
        } else {
            // TODO: display error, load again button
            alert("Failed to load categories!!");
        }
    }

    function setChildren(category) {
        if (category && category.childrenCategories) {
            category.children = category.childrenCategories;
            for (const child of category.children) {
                setChildren(child);
            }
        }
    }

    return (
        <Layout style={{ flex: 1, justifyContent: "flex-start", padding: 16 }}>
            <Input
                icon={(style) => <Icon {...style} name="search" />}
            />
            <ScrollView>
                <FlatList
                    data={categories}
                    numColumns={2}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Surface style={{
                            flex: 1,
                            justifyContent: "center",
                            margin: 8,
                            borderRadius: 4,
                            elevation: 1,
                            padding: 4
                        }}>
                            <Image
                                style={{ width: "100%", height: 150, justifyContent: "center", alignContent: "center" }}
                                source={{ uri: item.imagePath }}
                            / >
                            <Text category="h6" style={{ textAlign: "center", fontWeight: "bold" }}>{item.name}</Text>
                        </Surface>
                    )}
                />
            </ScrollView>
        </Layout>
    );
}