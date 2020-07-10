import React, { useState } from "react";
import { Layout, Text, Button, Card, CardHeader } from "@ui-kitten/components";
import { ScrollView } from "react-native-gesture-handler";
import { Divider, ActivityIndicator } from "react-native-paper";
import { Image, View } from "react-native";
import { Toast } from "native-base";
import { AddressInputPanel, Space } from "../../../components/others";
import { formatCurrency } from "../../../../core/utilities";
import { CustomerOrderService, CustomerOrderStateDetailsService, EmailService } from "../../../../core/services";
import { CUSTOMER_ORDER_TYPES } from "../../../../core/types";

export default function CartPurchaseScreen({ navigation, route }) {

    const { cartItems, customer, finalPrice } = route.params;
    const address = customer !== null ? customer.address : null;

    const [isLoading, setIsLoading] = useState(false);

    const [addressNumber, setAddressNumber] = useState(address !== null ? address.number : "");
    const [addressStreet, setAddressStreet] = useState(address !== null ? address.street : "");
    const [addressDistrict, setAddressDistrict] = useState(address !== null ? address.district : "");
    const [addressCity, setAddressCity] = useState(address !== null ? address.city : "");

    async function handlePurchaseButton() {
        try {
            setIsLoading(true);
            const result = await CustomerOrderService.createNewCustomerOrder(
                customer, cartItems, addressNumber, addressStreet, addressDistrict, addressCity);

            console.log(result);
            
            if (!result || result.error) {
                Toast.show({
                    text: "Đặt hàng không thành công",
                    type: "danger",
                    duration: 3000
                });
            } else {
                await CustomerOrderStateDetailsService.create({
                    orderState: CUSTOMER_ORDER_TYPES.Pending,
                    customerOrderId: result.data.id,                  
                });
                
                const address = { number: addressNumber, street: addressStreet, district: addressDistrict, city: addressCity };
                EmailService.sendNewOrderEmail(result.data, address, customer, cartItems);

                navigation.navigate("CustomerHome");
                Toast.show({
                    text: "Đơn hàng đã được đặt thành công",
                    type: "success",
                    buttonText: "Kiếm tra",
                    duration: 6000,
                    onClose: (reason) => { 
                        if (reason === "user")
                            navigation.navigate("CustomerOrders", {  customer: customer });
                    }
                });
            }
        } catch (e) {
            alert(e);
            console.log(e);
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
                    Mua hàng
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