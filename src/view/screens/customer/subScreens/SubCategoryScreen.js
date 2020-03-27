import React from "react";
import { Layout, Text, Button } from "@ui-kitten/components";
import { ScrollView, FlatList } from "react-native-gesture-handler";

export default function SubCategoryScreen({ navigation, route }) {

    const category = route.params;
    navigation.setOptions({ title: category.name })

    return (
        <Layout style={{ flex: 1 }}>
            <Layout>
                <FlatList
                    horizontal
                    data={category.childrenCategories}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Button 
                            status="danger"
                            size="tiny" 
                            style={{ margin: 8, borderRadius: 8 }}
                        >
                            {item.name}
                        </Button>
                    )}
                />
            </Layout>
            <Layout>
                
            </Layout>
        </Layout>

    );
}