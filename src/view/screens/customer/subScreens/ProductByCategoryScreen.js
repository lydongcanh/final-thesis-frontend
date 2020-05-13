import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { ProductService } from "../../../../core/services";
import { LoadErrorPanel } from "../../../components/others";
import { MinimalProduct } from "../../../components/products";

export default function ProductByCategoryScreen({ navigation, route }) {

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState();
    const [isLoaded, setIsLoaded] = useState(false);

    const category = route ? route.params.category : null;
    const account = route ? route.params.account : null;
    navigation.setOptions({ title: category ? category.name : "Lỗi" });

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        if (!category)
            return;

        try {
            setIsLoading(true);
            const result = await ProductService.getByCategoryId(category.id);
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
            setIsLoading(false);
        }
    }
    
    function getConfigPanel() {

    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ margin: 8, flex: 1, alignContent: "center" }} />;

        if (!isLoaded)
            return <LoadErrorPanel onReload={loadProducts} />;

        if (products.length < 1) {
            return (
                <Text 
                    appearance="hint" 
                    style={{ flex: 1, textAlign: "center", textAlignVertical: "center" }}
                >
                    Không có sản phẩm nào phù hợp
                </Text>
            );
        }
        return (
            <Layout>
                {getConfigPanel()}
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

    return (
        <Layout style={{ flex: 1 }}>
            {getContentUI()}
        </Layout>
    )
}