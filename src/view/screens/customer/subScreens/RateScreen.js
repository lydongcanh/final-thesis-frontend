import React, { useEffect, useState } from "react";
import { FlatList, Image } from "react-native";
import { Layout, Button, Text, Card, Input } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { AirbnbRating } from "react-native-elements";
import { CustomerOrderService, CustomerProductDetailsService, ProductService } from "../../../../core/services";
import { CUSTOMER_ORDER_TYPES } from "../../../../core/types";
import { formatCurrency } from "../../../../core/utilities";

export default function RateScreen({ navigation, route }) {
    
    const { customer } = route.params;

    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [existDetails, setExistDetails] = useState([]);
    const [newDetails, setNewDetails] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setIsLoading(true);

            const orderResult = await CustomerOrderService.query( {
                customerId: customer.id,
                orderState: CUSTOMER_ORDER_TYPES.Completed   
            });
            const cpResult = await CustomerProductDetailsService.getByCustomerId(customer.id);   
            
            await updateRatableProducts(orderResult.data, cpResult.data);
        } catch(e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    async function updateRatableProducts(orders, cpDetails) {
        if (!orders || !cpDetails)
            return [];

        const boughtProducts = [];
        for(const order of orders) {
            for(const orderDetail of order.orderDetails) {
                if (!boughtProducts.includes(orderDetail.productDetails.productId))
                    boughtProducts.push(orderDetail.productDetails.productId);
            }
        }

        const existDetails = [];
        const newDetails = [];
        for(const productId of boughtProducts) {
            let existFlag = false;
            for(const detail of cpDetails) {
                if (detail.productId == productId) {
                    existFlag = true;
                    existDetails.push(detail);
                    break;
                }
            }

            if (!existFlag) {
                const pResult = await ProductService.getById(productId);
                newDetails.push({
                    customerId: customer.id,
                    productId: productId,
                    product: pResult.data,
                    rate: 0,
                    liked: false,
                    comment: ""
                });
            }
        }

        setExistDetails(existDetails);
        setNewDetails(newDetails);
    }

    async function handleUpdateButton(detail) {
        try {
            setIsUpdating(true);
            let result = null;
            if (newDetails.includes(detail)) {
                const a = {
                    customerId: detail.customerId,
                    productId: detail.productId,
                    rate: detail.rate,
                    liked: detail.liked,
                    comment: detail.comment
                };
                console.log(a);
                result = await CustomerProductDetailsService.create(a);
            } else {
                result = await CustomerProductDetailsService.update(detail);
            }
            console.log(result);
        } catch(e) {
            console.log(e);
        } finally {
            setIsUpdating(false);
        }
    }

    function getRateFooterUI(detail) {
        return (
            <Layout style={{ justifyContent: "flex-start" }}>
                <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text>Đánh giá</Text>
                    <AirbnbRating 
                        reviews={[]}
                        showRating={false}
                        defaultRating={detail.rate ? detail.rate : 0}
                        size={20}
                        onFinishRating={rate => detail.rate = rate}
                        style={{ top: 0 }}
                    />
                </Layout>
                <Input 
                    style={{ marginTop: 8 }}
                    value={detail.comment}
                    onChangeText={text => detail.comment = text}
                />
                <Layout style={{ marginTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
                    <Button
                        disabled={isUpdating}
                        size="tiny"
                        onPress={async () => await handleUpdateButton(detail)}
                    >
                        Lưu
                    </Button>
                    {getUpdatingUI()}
                </Layout>
            </Layout>
        );

        function getUpdatingUI() {
            if (isUpdating)
                return <ActivityIndicator />
        }
    }

    function getRateUI(detail) {
        return (
            <Card
                //disabled
                style={{ margin: 16 }}
                onPress={() => alert(newDetails.includes(detail))}
                footer={() => getRateFooterUI(detail)}
            >
                <Layout style={{ flexDirection: "row", backgroundColor: "rgba(0, 0, 0, 0)", alignItems: "center" }}>
                    <Image 
                        source={{ uri: detail.product.mainImage }}
                        style={{ borderRadius: 50, width: 50, height: 50 }}
                    />
                    <Layout style={{ margin: 8, alignContent: "center", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                        <Layout style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                            <Text style={{ fontWeight: "bold" }}>{detail.product.name}</Text>
                        </Layout>
                        <Text appearance="hint" category="label">Giá: {formatCurrency(detail.product.unitPrice)}VNĐ</Text>
                    </Layout>
                </Layout>
            </Card>
        );
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ margin: 8, flex: 1, alignContent: "center" }} />

        return (
            <Layout style={{ flex: 1 }}>
                <FlatList 
                    data={existDetails.concat(newDetails)}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => getRateUI(item)}
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