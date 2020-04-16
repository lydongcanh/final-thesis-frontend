import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Image, Platform, StatusBar, FlatList, Dimensions } from "react-native";
import { Layout, Text, Input, Icon, Button, Card } from "@ui-kitten/components";
import { ActivityIndicator, Divider } from "react-native-paper";
import { CategoryService } from "../../../../core/services";
import { Space, CustomerScreensHeader } from "../../../components/others";

export default function SearchScreen({ navigation }) {

    const [categories, setCategories] = useState();
    const [selectedMainCategory, setSelectedMainCategory] = useState();
    const [selectedSubCategory, setSelectedSubCategory] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    const screenWidth = Dimensions.get("window").width;
    const auth = useSelector(state => state.authReducer);
    const account = auth.account;

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

        function setChildren(category) {
            if (category && category.childrenCategories) {
                category.children = category.childrenCategories;
                for (const child of category.children) {
                    setChildren(child);
                }
            }
        }
    }

    function handleSubCategoryClick(category) {
        setSelectedSubCategory(category);
    }

    function handleMainCategoryClick(category) {
        setSelectedMainCategory(category);
        setSelectedSubCategory(null);
    }

    function getMainCategoriesUI() {
        return (
            <Layout>
                <Divider />
                <FlatList
                    horizontal
                    data={categories}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Button
                            disabled={!item || !item.childrenCategories || item.childrenCategories.length < 1}
                            size="tiny"
                            status={(selectedMainCategory && item.id === selectedMainCategory.id) ? "info" : "basic"}
                            onPress={() => handleMainCategoryClick(item)}
                            style={{ margin: 8, borderRadius: 24 }}
                        >
                            {item.name}
                        </Button>
                    )}
                />
                <Divider />
            </Layout>
        );
    }

    function getSubCategoriesUI() {
        if (!selectedMainCategory || 
            !selectedMainCategory.childrenCategories ||
            selectedMainCategory.childrenCategories.length < 1)
            return;

        return (
            <Layout>
                <FlatList
                    horizontal
                    data={selectedMainCategory.childrenCategories.sort((a, b) => a.sortOrder > b.sortOrder)}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Button
                            disabled={!item || !item.childrenCategories || item.childrenCategories.length < 1}
                            size="tiny"
                            status={(selectedSubCategory && item.id === selectedSubCategory.id) ? "info" : "basic"}
                            onPress={() => handleSubCategoryClick(item)}
                            style={{ margin: 8, borderRadius: 24 }}
                        >
                            {item.name}
                        </Button>
                    )}
                />
                <Divider />
            </Layout>
        );
    }

    function getFinalCategoriesUI() {
        if (!selectedSubCategory ||
            !selectedSubCategory.childrenCategories ||
            selectedSubCategory.childrenCategories.length < 1)
            return;

        return (
            <FlatList
                data={selectedSubCategory.childrenCategories.sort((a, b) => a.sortOrder > b.sortOrder)}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Card
                        style={{ margin: 16 }}
                        header={() => getCardHeader(item) }
                    >
                        <Text>{item.name}</Text>
                    </Card>
                )}
            />
        );

        function getCardHeader(item) {
            if (!item)
                return;

            return (
                <Layout style={{ flex: 1 }}>
                    <Image 
                        source={{ uri: item.imagePath }} 
                        style={{ width: screenWidth, height: 100, justifyContent: "flex-start" }} 
                    />
                </Layout>
            );
        }
    }

    function getCategoriesUI() {
        if (isLoading && !isLoaded)
            return;

        return (
            <Layout style={{ flex: 1, justifyContent: "flex-start" }}>
                {getMainCategoriesUI()}
                {getSubCategoriesUI()}
                {getFinalCategoriesUI()}
            </Layout>
        );
    }

    function getContentUI() {
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
            <Layout style={{ flex: 1 }}>
                {/* <Input
                    style={{ borderRadius: 24, marginLeft: 8, marginRight: 8 }}
                    icon={(style) => <Icon {...style} name="search" />}
                /> */}
                {getCategoriesUI()}
            </Layout>
        );
    }

    return (
        <Layout style={{
            flex: 1,
            justifyContent: "flex-start",
            marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
        }}>
            <CustomerScreensHeader navigation={navigation} />
            {getContentUI()}
        </Layout>
    );
}