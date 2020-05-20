import React, { useState, useEffect } from "react";
import { Image, FlatList } from "react-native";
import { Card, CardHeader, Text, Layout, Modal, Button } from "@ui-kitten/components";
import { Divider, ActivityIndicator } from "react-native-paper";
import { formatDate, formatCurrency } from "../../../core/utilities";
import { Space } from ".";
import { CustomerOrderService, CustomerService, ProductDetailsService, ProductService } from "../../../core/services";

/**
 * 
 * @param param0 visible, setVisible, order, showCustomerData
 */
export default function OrderDetailsModal({ visible, setVisible, order, showCustomerData }) {

    const [isLoadingCustomer, setIsLoadingCustomer] = useState(true);
    const [isLoadingProductDetails, setIsLoadingProductDetails] = useState(true);

    useEffect(() => {
        loadCustomer();
    }, [order]);

    useEffect(() => {
        loadProductDetails();
    }, [order]);

    async function loadCustomer() {
        if (!order || !showCustomerData)
            return;

        try {
            setIsLoadingCustomer(true);
            const result = await CustomerService.getById(order.customerId);
            order.customer = result.data;
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoadingCustomer(false);
        }
    }

    async function loadProductDetails() {
        if (!order || !order.orderDetails)
            return;

        setIsLoadingProductDetails(true);
        for(const details of order.orderDetails) {
            try {
                if (!details.productDetails) {  
                    const prdResult = await ProductDetailsService.getById(details.productDetailsId);
                    const pResult = await ProductService.getById(prdResult.data.productId);
                    details.productDetails = prdResult.data;
                    details.productDetails.product = pResult.data;
                }
            } catch(e) {
                console.log(e);
            }
        }
        setIsLoadingProductDetails(false);
    }

    function getCustomerInfoUI() {
        if (!showCustomerData)
            return;
            
        if (isLoadingCustomer)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center", margin: 8 }} />

        if (!order.customer)
            return <Text>Lỗi load thông tin khách hàng.</Text>;

        return (
            <Layout>
                <Text category="label">Khách hàng</Text>
                <Divider style={{ marginVertical: 4 }}/>
                <Text>Tên: {order.customer.name}</Text>
                <Text>Số điện thoại: {order.customer.phoneNumber}</Text>
                <Text>Email: {order.customer.email}</Text>
            </Layout>
        );
    }

    function getCartItemsUI() {
        if (!order || !order.orderDetails)
            return;

        return (
            <FlatList
                data={order.orderDetails}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => {
                    if (!item.productDetails) 
                        return <ActivityIndicator style={{ flex: 1, alignContent: "center", margin: 8 }} />

                    if (!item.productDetails.product)
                        return <Text>Lỗi load sản phẩm.</Text>
                    
                    return (
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
                    );
                }}
            />
        );
    }

    function getContentUI() {
        if (!order || !order.orderDetails)
            return;

        return (
            <Layout style={{ flex: 1 }}>
                <Text>Id: {order.id}</Text>
                <Text>Giá: {formatCurrency(CustomerOrderService.calculateFinalPrice(order))}VND</Text>
                <Text>Trạng thái: {order.orderState}</Text>
                <Text>Ngày tạo: {formatDate(order.creationDate)}</Text>
                {getDescriptionUI()}
                
                <Space />
                {getCustomerInfoUI()}

                <Space />
                <Text category="label" style={{ marginBottom: 8 }}>Sản phẩm</Text>
                <Layout style={{ maxHeight: 300 }}>
                    {getCartItemsUI()}
                </Layout>
            </Layout>
        );

        function getDescriptionUI() {
            if (order.description && order.description !== "")
                return <Text>Chú thích: {order.description}</Text>
        }
    }

    return (
        <Modal
            visible={visible}
            backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onBackdropPress={() => setVisible(false)}
            style={{ flex: 1, padding: 8, alignSelf: "center", width: "100%" }}
        >
            <Card
                disabled
                header={() => <CardHeader title="Hóa đơn" />}
                footer={() => (
                    <Layout style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <Button
                            size="tiny"
                            appearance="ghost"
                            onPress={() => setVisible(false)}
                        >
                            OK
                        </Button>
                    </Layout>
                )}
            >
                {getContentUI()}
            </Card>
        </Modal>
    );
}