import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";
import { Layout, Text, Button, ButtonGroup, Icon } from "@ui-kitten/components";
import { FlatList } from "react-native-gesture-handler";
import { Divider, ActivityIndicator } from "react-native-paper";
import { formatCurrency } from "../../../../core/utilities";
import { Space } from "../../../components/others";
import { CustomerCartService } from "../../../../core/services";
import { Texts } from "../../../../core/texts";

export default function CartScreen({ navigation, route }) {

    const { account } = route.params;
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadCartItems();
    }, [account]);

    async function loadCartItems() {
        try {
            setIsLoading(true);
            const result = await CustomerCartService.getCartItemsByCustomerId(account.customer.id);
            setCartItems(result.data);
            setIsLoaded(true);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }

    function handlePurchaseButton() {
        navigation.navigate("CustomerCartPurchase", {
            cartItems: cartItems,
            customer: account.customer,
            finalPrice: getFinalPrice()
        });
    }

    function handleDeleteCartItemButton(cartItem) {
        CustomerCartService.delete(cartItem.id);
        setCartItems(items => {
            return items.filter(item => item.id !== cartItem.id);
        });
    }

    function handleInscreaseQuantityButton(cartItem) {
        CustomerCartService.inscreaseQuantity(cartItem);
        setCartItems(items => items.map(item => item));
    }

    function handleDecreaseQuantityButton(cartItem) {
        CustomerCartService.decreaseQuantity(cartItem);
        setCartItems(items => items.map(item => item));
    }

    function getProductPrice(product) {
        if (product.isDiscount)
            return product.unitPrice - product.discountAmount;

        return product.unitPrice;
    }

    function getFinalPrice() {
        let price = 0;
        if (!cartItems)
            return price;

        for (const item of cartItems) {
            price += item.quantity * getProductPrice(item.productDetails.product);
        }
        return price;
    }

    function getCartItemsUI() {
        if (!cartItems || cartItems.length < 1) {
            return (
                <Text
                    appearance="hint"
                    style={{ flex: 1, textAlign: "center", textAlignVertical: "center" }}
                >
                    {Texts.NO_CART_ITEMS}
                </Text>
            );
        }

        return (
            <FlatList
                data={cartItems}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Layout style={{ padding: 8, justifyContent: "space-between" }}>
                        <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Layout style={{ flexDirection: "row" }}>
                                <Image
                                    style={{ width: 75, height: 75, borderRadius: 12, marginRight: 8 }}
                                    source={{ uri: item.productDetails.product.mainImage }}
                                />
                                <Layout style={{ justifyContent: "space-around" }}>
                                    <Text numberOfLines={1} style={{ fontWeight: "bold", maxWidth: 150 }}>{item.productDetails.product.name}</Text>
                                    <Text style={{ fontWeight: "bold" }}>{formatCurrency(getProductPrice(item.productDetails.product))}VND</Text>
                                    <Text appearance="hint">{item.productDetails.size} | {item.productDetails.color}</Text>
                                </Layout>
                            </Layout>
                            <Layout style={{ justifyContent: "space-between" }}>
                                <Button
                                    size="tiny"
                                    status="danger"
                                    style={{ width: 16, height: 16, borderRadius: 16, alignSelf: "flex-end" }}
                                    icon={style => <Icon {...style} name="trash-2" />}
                                    onPress={() => handleDeleteCartItemButton(item)}
                                />
                                <ButtonGroup size="tiny" status="basic">
                                    <Button
                                        disabled={item.quantity <= 1}
                                        icon={style => <Icon {...style} name="minus" />}
                                        onPress={() => handleDecreaseQuantityButton(item)}
                                    />
                                    <Button>{item.quantity.toString()}</Button>
                                    <Button
                                        disabled={item.quantity >= item.productDetails.unitsInStock}
                                        icon={style => <Icon {...style} name="plus" />}
                                        onPress={() => handleInscreaseQuantityButton(item)}
                                    />
                                </ButtonGroup>
                            </Layout>
                        </Layout>
                        <Divider style={{ marginTop: 8 }} />
                    </Layout>
                )}
            />
        );
    }

    function getBottomPanelUI() {
        if (!cartItems || cartItems.length < 1) 
            return;

        return (
            <View style={{
                padding: 24,
                backgroundColor: "rgba(245, 245, 245, 1)",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12
            }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text >Tổng tiền:</Text>
                    <Text appearance="hint" >{formatCurrency(getFinalPrice())}VND</Text>
                </View>
                <Divider style={{ margin: 8 }} />

                <Button 
                    style={{ borderRadius: 24 }}
                    onPress={handlePurchaseButton}
                    disabled={getFinalPrice() <= 0}
                >
                    Tiếp tục
                </Button>
            </View>
        );
    }

    function getCartUI() {
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
                        onPress={loadCartItems}
                    >
                        Thử lại
                    </Button>
                </Layout>
            );
        }

        return (
            <Layout style={{ flex: 1, justifyContent: "space-between" }}>
                {getCartItemsUI()}
                {getBottomPanelUI()}
            </Layout>
        );
    }

    return getCartUI();
}