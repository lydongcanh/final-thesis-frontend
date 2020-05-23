import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Platform, StatusBar, FlatList } from "react-native";
import { Layout, Text, Icon, Button } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { CustomerScreensHeader, Space } from "../../../components/others";
import { MinimalProduct } from "../../../components/products";
import { CustomerProductDetailsService } from "../../../../core/services";
import { Texts } from "../../../../core/texts";

export default function FavouriteScreen({ navigation }) {

    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [favouriteProducts, setFavouriteProducts] = useState();

    const auth = useSelector(state => state.authReducer);
    const account = auth.account;

    useEffect(() => {
        loadFavouriteProducts();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadFavouriteProducts();
        });
      
        return unsubscribe;
    }, []);

    function loadFavouriteProducts() {
        try {
            setIsLoading(true);
            if (auth.loggedIn && auth.account && auth.account.customer) {
                const products = [];
                for(const details of account.customer.customerProductDetails) {
                    if (details.liked)
                        products.push(details.product);
                }
                setFavouriteProducts(products);
                setIsLoaded(true);
            } else {
                navigation.navigate("Login");
                setIsLoaded(true);
            }
        } catch(e) {
            console.log(e);
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }
    
    function getFavouriteProductsUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center" }} />

        if (!isLoaded) {
            return (
                <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text appearance="hint">Có lỗi xảy ra khi load dữ liệu, xin thử lại!</Text>
                    <Space />
                    <Button
                        size="tiny"
                        icon={(style) => <Icon {...style} name="sync" />}
                        onPress={loadFavouriteProducts}
                    >
                        Thử lại
                    </Button>
                </Layout>
            );
        }

        if (favouriteProducts && favouriteProducts.length < 1) {
            return (
                <Text 
                    appearance="hint"
                    style={{ flex: 1, textAlign: "center", textAlignVertical: "center" }}
                >
                    {Texts.NO_FAVOURITE_PRODUCTS}
                </Text>
            );
        }

        return (
            <FlatList
                style={{ margin: 8 }}
                data={favouriteProducts}
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
        );
    }

    return (
        <Layout style={{ 
            flex: 1, 
            marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
        }}>
            <CustomerScreensHeader navigation={navigation} />
            {getFavouriteProductsUI()}
        </Layout>
    );
}