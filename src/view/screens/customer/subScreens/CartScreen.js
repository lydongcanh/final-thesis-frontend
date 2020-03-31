import React from "react";
import { View, Image } from "react-native";
import { Layout, Text, Button, ButtonGroup, Icon } from "@ui-kitten/components";
import { FlatList } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import { formatCurrency } from "../../../../core/utilities";

export default function CartScreen({ route }) {

    const { account } = route.params;

    function getFinalPrice() {
        let price = 0;
        for(const item of account.customer.cartItems) {
            price += item.quantity * item.productDetails.product.unitPrice;
        }
        return price;
    }

    return (
        <Layout style={{ flex: 1, justifyContent: "space-between" }}>
            <FlatList
                data={account.customer.cartItems}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Layout style={{ padding: 8, justifyContent: "space-between" }}>
                        <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Layout  style={{ flexDirection: "row" }}>
                                <Image
                                    style={{ width: 75, height: 75, borderRadius: 12, marginRight: 8 }}
                                    source={{ uri: item.productDetails.product.mainImage }}
                                />
                                <Layout style={{ justifyContent: "space-around" }}>
                                    <Text style={{ fontWeight: "bold" }}>{item.productDetails.product.name}</Text>
                                    <Text style={{ fontWeight: "bold" }}>{formatCurrency(item.productDetails.product.unitPrice)}VND</Text>
                                    <Text appearance="hint">Size: {item.productDetails.size} | Màu: {item.productDetails.color}</Text>
                                </Layout>
                            </Layout>
                            <Layout>
                                <ButtonGroup size="tiny" status="basic">
                                    <Button 
                                        disabled={item.quantity <= 1}
                                        icon={style => <Icon {...style} name="minus" />} 
                                        onPress={() => item.quantity--}
                                    />
                                    <Button>{item.quantity.toString()}</Button>
                                    <Button
                                        disabled={item.quantity >= item.productDetails.unitsInStock}
                                        icon={style => <Icon {...style} name="plus" />} 
                                        onPress={() => item.quantity++}
                                    />
                                </ButtonGroup>
                            </Layout>
                        </Layout>
                        <Divider style={{ marginTop: 8 }} />
                    </Layout>
                )}
            />

            <View style={{
                padding: 24,
                backgroundColor: "rgba(235, 235, 235)",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12
            }}>
                <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text >Tổng tiền:</Text>
                    <Text appearance="hint" >{formatCurrency(getFinalPrice())}VND</Text>
                </Layout>
                <Divider style={{ margin: 8 }} />

                <Button style={{ borderRadius: 24 }}>Thanh toán</Button>
            </View>
        </Layout>
    );
}