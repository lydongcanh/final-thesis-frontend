import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout, Button, Icon, Text } from "@ui-kitten/components";
import { ImageBackground, Dimensions, View, FlatList, Platform, StatusBar } from "react-native";
import { Toast } from "native-base";
import { ActivityIndicator } from "react-native-paper";
import { ProductDetailsService, CustomerCartService } from "../../../../core/services";
import { Space } from "../../../components/others";
import { formatCurrency } from "../../../../core/utilities";
import { Texts } from "../../../../core/texts";

export default function ProductPurchaseScreen({ navigation, route }) {

    const auth = useSelector(state => state.authReducer);

    const { product } = route.params;
    const screenHeight = Dimensions.get("window").height;
    const screenWidth = Dimensions.get("window").width;

    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [productDetails, setProductDetails] = useState();
    const [productColors, setProductColors] = useState();
    const [productSizes, setProductSizes] = useState();
    const [selectedColorIndex, setSelectedColorIndex] = useState();
    const [selectedSizeIndex, setSelectedSizeIndex] = useState();

    navigation.setOptions({ title: product.name });

    useEffect(() => {
        loadProductDetails();
    }, []);

    // TODO: check existed item in customer's cart.
    async function handleAddToCartButton() {
        const color = productColors[selectedColorIndex];
        const size = productSizes[selectedSizeIndex];

        if (!auth.loggedIn || !auth.account) {
            navigation.navigate("Login", { shouldGoBack: true });
            return;
        }

        for (const detail of productDetails) {
            if (detail.color === color && detail.size === size && detail.unitsInStock > 0) {
                setIsLoading(true);
                try {
                    const result = await CustomerCartService.create({
                        quantity: 1,
                        customerId: auth.account.customer.id,
                        productDetailsId: detail.id
                    });

                    if (result.error) {
                        Toast.show({
                            text: result.error,
                            type: "danger"
                        });
                    } else {
                        Toast.show({
                            text: Texts.CART_ITEM_ADDED,
                            type: "success",
                            buttonText: "Thanh toán",
                            duration: 3000,
                            onClose: (reason) => { 
                                if (reason === "user")
                                    navigation.navigate("CustomerCart", { account: auth.account })
                            }
                        });
                    }
                } catch(e) {
                    alert(JSON.stringify(e, null, 2));
                }
                setIsLoading(false);
                return;
            }
        }

        Toast.show({
            text: Texts.NO_AVAILABLE_PRODUCT,
            type: "danger"
        });
    }

    async function loadProductDetails() {
        setIsLoading(true);
        try {
            const detailsResult = await ProductDetailsService.getDetaisByProductId(product.id);
            const details = detailsResult.data;

            const colors = [];
            const sizes = [];
            for (const detail of details) {
                if (!sizes.includes(detail.size))
                    sizes.push(detail.size);

                if (!colors.includes(detail.color))
                    colors.push(detail.color);
            }

            setProductDetails(details);
            setProductColors(colors);
            setProductSizes(sizes);
            setIsLoaded(true);
        } catch (e) {
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }

    /** Render colors & size list. */
    function getButtonsListUI(data, title, selectedIndex, setIndexFunc) {
        return (
            <View>
                <Text category="label">{title}</Text>
                <FlatList
                    horizontal
                    data={data}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) =>
                        <Button
                            status={index === selectedIndex ? "danger" : "basic"}
                            size="tiny"
                            style={{ marginRight: 8, marginTop: 4, borderRadius: 24 }}
                            onPress={() => setIndexFunc(index)}
                        >
                            {item}
                        </Button>
                    }
                />
                <Space />
            </View>
        );
    }

    function getProductDetailsUI() {
        if (isLoading)
            return <ActivityIndicator style={{ margin: 8, flex: 1, alignContent: "center" }} />

        if (!isLoaded) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text appearance="hint">Có lỗi xảy ra khi load dữ liệu, xin thử lại!</Text>
                    <Space />
                    <Button
                        size="tiny"
                        icon={(style) => <Icon {...style} name="sync" />}
                        onPress={loadProductDetails}
                    >
                        Thử lại
                    </Button>
                </View>
            );
        }

        return (
            <View>
                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <Text category="h6" style={{ fontWeight: "bold" }}>{product.name}</Text>
                    <Text category="h6" appearance="hint">{formatCurrency(product.unitPrice)}VND</Text>
                </View>
                <Space />

                {getButtonsListUI(productColors, "Màu", selectedColorIndex, setSelectedColorIndex)}
                {getButtonsListUI(productSizes, "Size", selectedSizeIndex, setSelectedSizeIndex)}
                <Space />

                <Button
                    disabled={!isLoaded || selectedColorIndex === undefined || selectedSizeIndex === undefined}
                    icon={style => <Icon {...style} name="shopping-cart" />}
                    style={{ borderRadius: 24 }}
                    onPress={handleAddToCartButton}
                >
                    Thêm vào giỏ hàng
                </Button>
            </View>
        );
    }

    return (
        <ImageBackground
            source={{ uri: product.mainImage }}
            style={{ 
                height: screenHeight, 
                width: screenWidth, flex: 1, 
                marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
                justifyContent: "flex-end" 
            }}
        >
            <Layout style={{
                padding: 32,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                backgroundColor: "rgba(225, 225, 225, 0.8)"
            }}>
                {getProductDetailsUI()}
            </Layout>
            <Button 
                style={{ borderRadius: 50, position: "absolute", top: 0, left: 0, backgroundColor: "rgba(0, 0, 0, 0)" }}
                onPress={() => navigation.goBack()}
                appearance="ghost"
                status="basic"
                icon={style => <Icon {...style} name="arrow-back" />}
            />
        </ImageBackground>
    );
}