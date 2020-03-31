import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Layout, Text, Input, Icon, Button, Card } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { Image, Platform, StatusBar } from "react-native";
import { CategoryService } from "../../../../core/services";
import { Space, CustomerScreensHeader } from "../../../components/others";

export default function SearchScreen({ navigation }) {

    const [categories, setCategories] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        setIsLoading(true);

        try {
            const result = await CategoryService.getAllRoot();
            if (result.data) {
                for (const category of result.data) {
                    setChildren(category);
                }
                setCategories(result.data);
                setIsLoaded(true);
            } else {
                setIsLoaded(false);
            }
        } catch (e) {
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
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

    function handleCategoryClick(category) {
        navigation.navigate("CustomerSubCategory", category);
    }

    function getCategories() {
        if (isLoading) {
            return <ActivityIndicator style={{ margin: 8, flex: 1, alignContent: "center" }} />
        }

        if (!isLoaded) {
            return (
                <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text appearance="hint">Có lỗi xảy ra khi load dữ liệu, xin thử lại!</Text>
                    <Space />
                    <Button
                        size="tiny"
                        icon={(style) => <Icon {...style} name="sync" />}
                        onPress={loadCategories}
                    >
                        Thử lại
                    </Button>
                </Layout>
            );
        }

        return (
            <FlatList
                data={categories}
                numColumns={2}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Card
                        style={{ flex: 1, margin: 8 }}
                        onPress={() => handleCategoryClick(item)}
                    >
                        <Image
                            style={{ width: "100%", height: 150, justifyContent: "center", alignContent: "center" }}
                            source={{ uri: item.imagePath }}
                        />
                        <Text
                            category="h6"
                            style={{ textAlign: "center", fontWeight: "bold" }}
                        >
                            {item.name}
                        </Text>
                    </Card>
                )}
            />
        );
    }

    return (
        <Layout style={{ 
            flex: 1, 
            justifyContent: "flex-start", 
            marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight 
        }}>
            {/* <Input
                icon={(style) => <Icon {...style} name="search" />}
            /> */}
            <CustomerScreensHeader navigation={navigation} />
            {getCategories()}
        </Layout>
    );
}