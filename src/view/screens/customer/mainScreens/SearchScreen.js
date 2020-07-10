import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Image, Platform, StatusBar, FlatList } from "react-native";
import { Layout, Text, Input, Icon, Button } from "@ui-kitten/components";
import { ActivityIndicator, Divider } from "react-native-paper";
import { CategoryService, ProductService } from "../../../../core/services";
import { Space, CustomerScreensHeader } from "../../../components/others";
import { MinimalProduct } from "../../../components/products";

export default function SearchScreen({ navigation }) {

    const [categories, setCategories] = useState();
    const [selectedMainCategory, setSelectedMainCategory] = useState();
    const [selectedSubCategory, setSelectedSubCategory] = useState();
    const [selectedFinalCategory, setSelectedFinalCategory] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const auth = useSelector(state => state.authReducer);
    const account = auth.account;

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [selectedFinalCategory]);

    async function loadProducts() {
        try {
            setIsLoadingProducts(true);
            
            const result =  await ProductService.query({
                categoryId: selectedFinalCategory ? selectedFinalCategory.id : null,
                isSelling: true,
                containsName: (!searchValue || searchValue == "") ? "" : searchValue
            });

            if (result.data) {
                setProducts(result.data);
                setIsLoaded(true);
            } else {
                console.log("Load product by category error.", result);
                setIsLoaded(false);
            }
        } catch(e) {
            console.log(e);
            setIsLoaded(false);
        } finally {
            setIsLoadingProducts(false);
        }
    }

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

    async function handleOnSearch(text) {
        await loadProducts();
    }

    function handleFinalCategoryClick(category) {
        setSelectedFinalCategory(category);
    }

    function handleSubCategoryClick(category) {
        setSelectedSubCategory(category);
    }

    function handleMainCategoryClick(category) {
        setSelectedMainCategory(category);
        setSelectedSubCategory(null);
        setSelectedFinalCategory(null);
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
            <Layout>
                <FlatList
                    horizontal
                    data={selectedSubCategory.childrenCategories.sort((a, b) => a.sortOrder > b.sortOrder)}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Button
                            size="tiny"
                            status={(selectedFinalCategory && item.id === selectedFinalCategory.id) ? "info" : "basic"}
                            onPress={() => handleFinalCategoryClick(item)}
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

    function getCategoriesUI() {
        if (isLoading && !isLoaded)
            return;

        return (
            <Layout style={{ justifyContent: "flex-start" }}>
                {getMainCategoriesUI()}
                {getSubCategoriesUI()}
                {getFinalCategoriesUI()}
            </Layout>
        );
    }

    function getProductsUI() {       
        if (isLoadingProducts)
            return <ActivityIndicator style={{ margin: 8, flex: 1, alignContent: "center" }} />

        if (!products || products.length < 1) {
            return (
                <Text category="p2" style={{ alignSelf: "center", marginTop: 24 }}>
                    Không có sản phẩm nào phù hợp với kết quả tìm kiếm.
                </Text>
            );
        }

        return (
            <Layout style={{ flex: 1 }}>
                <FlatList
                    style={{ margin: 8 }}
                    data={products}
                    keyExtractor={(_, index) => index.toString()}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <MinimalProduct
                            account={account}
                            product={item}
                            navigation={navigation}
                            width={170}
                            height={200}
                        />
                    )}
                />   
            </Layout> 
        );
    }

    function getSearchInputUI() {
        return (
            <Input 
                icon={(style) => <Icon {...style} name="search-outline" />}
                value={searchValue}
                onChangeText={setSearchValue}
                onIconPress={() => handleOnSearch(searchValue)}
                style={{ borderRadius: 50, margin: 8, backgroundColor: "white" }}
            />
        )
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ margin: 8, flex: 1, alignContent: "center" }} />

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
            <Layout style={{ flex: 1, justifyContent: "flex-start" }}>
                {getSearchInputUI()}
                {getCategoriesUI()}
                {getProductsUI()}
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