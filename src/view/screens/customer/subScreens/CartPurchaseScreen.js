import React, { useState } from "react";
import { Layout, Text, Input, Button, Card, CardHeader } from "@ui-kitten/components";
import { ScrollView } from "react-native-gesture-handler";
import { Divider, ActivityIndicator } from "react-native-paper";
import { Image, View } from "react-native";
import { AddressInputPanel, Space } from "../../../components/others";
import { formatCurrency } from "../../../../core/utilities";
import { CustomerOrderService } from "../../../../core/services";
import { Toast } from "native-base";

export default function CartPurchaseScreen({ navigation, route }) {

    const { cartItems, customer, finalPrice } = route.params;
    const [isLoading, setIsLoading] = useState(false);

    const [addressNumber, setAddressNumber] = useState();
    const [addressStreet, setAddressStreet] = useState();
    const [addressDistrict, setAddressDistrict] = useState();
    const [addressCity, setAddressCity] = useState();

    async function handlePurchaseButton() {
        try {
            setIsLoading(true);
            const result = await CustomerOrderService.createNewCustomerOrder(
                customer, cartItems, addressNumber, addressStreet, addressDistrict, addressCity);

            if (!result || result.error) {
                Toast.show({
                    text: "Đặt hàng không thành công",
                    type: "danger",
                    duration: 3000
                });
            } else {
                navigation.navigate("CustomerHome");
                Toast.show({
                    text: "Đơn hàng đã được đặt thành công",
                    type: "success",
                    duration: 6000
                });
            }
        } catch (e) {
            alert(e);
        } finally {
            setIsLoading(false);
        }
    }

    /** Validate all infomations */
    function isPurchasable() {
        return addressNumber && addressNumber.length > 0 &&
            addressStreet && addressStreet.length > 0 &&
            addressDistrict && addressDistrict.length > 0 &&
            addressCity && addressCity.length > 0;
    }

    function getCartItemsUI() {
        return (
            cartItems.map(item => (
                <Layout key={item.id} style={{ justifyContent: "space-between" }}>
                    <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Layout style={{ flexDirection: "row" }}>
                            <Image
                                style={{ width: 75, height: 75, borderRadius: 12, marginRight: 8 }}
                                source={{ uri: item.productDetails.product.mainImage }}
                            />
                            <Layout style={{ justifyContent: "space-around" }}>
                                <Text style={{ fontWeight: "bold" }}>{item.productDetails.product.name}</Text>
                                <Text appearance="hint">{item.productDetails.size} | {item.productDetails.color}</Text>
                                <Text appearance="hint">Số lượng: {item.quantity}</Text>
                                <Text appearance="hint">Thành tiền: {formatCurrency(item.productDetails.product.unitPrice * item.quantity)}VND</Text>
                            </Layout>
                        </Layout>
                    </Layout>
                    <Divider style={{ marginTop: 8, marginBottom: 8 }} />
                </Layout>
            ))
        );
    }

    function getBottomPanelUI() {
        return (
            <View style={{
                padding: 24,
                backgroundColor: "rgba(245, 245, 245, 1)",
            }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text >Tổng tiền:</Text>
                    <Text appearance="hint" >{formatCurrency(finalPrice)}VND</Text>
                </View>
                <Divider style={{ margin: 8 }} />

                <Button
                    style={{ borderRadius: 24 }}
                    onPress={handlePurchaseButton}
                    disabled={!isPurchasable()}
                >
                    Thanh toán
                </Button>
            </View>
        );
    }

    function getContent() {
        if (isLoading)
            return <ActivityIndicator style={{ margin: 8, flex: 1, alignContent: "center" }} />

        return (
            <Layout style={{ flex: 1, justifyContent: "space-between" }}>
                <ScrollView style={{ padding: 16 }}>
                    <AddressInputPanel 
                        title="Địa chỉ giao hàng"
                        addressNumber={addressNumber}
                        addressStreet={addressStreet}
                        addressDistrict={addressDistrict}
                        addressCity={addressCity}
                        setAddressNumber={setAddressNumber}
                        setAddressStreet={setAddressStreet}
                        setAddressDistrict={setAddressDistrict}
                        setAddressCity={setAddressCity}
                    />
                    <Space />

                    <Card
                        status="success"
                        header={() => <CardHeader title="Thông tin sản phẩm" />}
                    >
                        {getCartItemsUI()}
                    </Card>
                </ScrollView>

                {getBottomPanelUI()}
            </Layout>
        );
    }

    return getContent();
}