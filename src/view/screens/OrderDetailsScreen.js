import React, { useState, useEffect } from "react";
import { Image, FlatList } from "react-native";
import { Text, Layout, Button } from "@ui-kitten/components";
import Timeline from 'react-native-timeline-flatlist'
import { Divider, ActivityIndicator } from "react-native-paper";
import { formatDate, formatCurrency } from "../../core/utilities";
import { Space } from "../components/others";
import { CustomerOrderService, CustomerService, CustomerOrderStateDetailsService,
         ProductDetailsService, ProductService } from "../../core/services";

/**
 * @param param0 order, showCustomerData, showId
 */
export default function OrderDetailsScreen({ navigation, route }) {
    
    const order = route ? route.params.order : null;
    const showCustomerData = route ? route.params.showCustomerData : false;
    const showId = route ? route.params.showId : false;
    const shouldReset = route ? route.params.shouldReset : false;

    const [isLoadingCustomer, setIsLoadingCustomer] = useState(true);
    const [isLoadingProductDetails, setIsLoadingProductDetails] = useState(true);
    const [isLoadingStateDetails, setIsLoadingStateDetails] = useState(true);

    useEffect(() => {
        loadCustomer();
        loadProductDetails();
        loadStateDetails();
    }, [order]);

    async function loadCustomer() {
        try {
            if (!order || !showCustomerData)
                return;

            setIsLoadingCustomer(true);
            const result = await CustomerService.getById(order.customerId);
            order.customer = result.data;
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoadingCustomer(false);
        }
    }

    async function loadStateDetails() {
        try {
            if (!order || order.stateDetails)
                return;

            setIsLoadingStateDetails(true);
            const result = await CustomerOrderStateDetailsService.getByOrderId(order.id);
            order.stateDetails = result.data;
        } catch(e) {
            console.log(e);
        } finally {
            setIsLoadingStateDetails(false);
        }
    }

    async function loadProductDetails() {
        if (!order || !order.orderDetails)
            return;

        setIsLoadingProductDetails(true);
        for(const details of order.orderDetails) {
            try {
                const pResult = await ProductService.getById(details.productDetails.productId);
                details.productDetails.product = pResult.data;
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

    function getStateDetailsUI() {
        if (isLoadingStateDetails)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center", margin: 8 }} />

        if (!order || !order.stateDetails)
            return;

        const data = [];
        for(const detail of order.stateDetails) {
            data.push({
                key: detail.orderState,
                time: formatDate(detail.creationDate),
                title: detail.orderState,
                description: detail.description
            });
        }

        return (
            <Timeline 
                data={data}
                innerCircle={"dot"}
            />
        );
    }

    function getCartItemsUI() {
        if (!order || !order.orderDetails)
            return;

        if (isLoadingProductDetails)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center", margin: 8 }} />

        return (
            <FlatList
                data={order.orderDetails}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => {
                    if (!item.productDetails) 
                        return;

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
            <Layout style={{ flex: 1, justifyContent: "flex-start" }}>
                <Layout>
                    <Text category="label" style={{ marginBottom: 8 }}>Thông tin hóa đơn</Text>
                    <Divider style={{ marginBottom: 8 }}/>
                    {getId()}
                    <Text>Giá: {formatCurrency(CustomerOrderService.calculateFinalPrice(order))}VND</Text>
                    <Text>Trạng thái: {order.orderState}</Text>
                    <Text>Ngày tạo: {formatDate(order.creationDate)}</Text>
                    {getDescriptionUI()}
                </Layout>

                <Layout>
                    <Space />
                    {getCustomerInfoUI()}
                </Layout>

                <Layout style={{ flex: 1 }}>
                    <Space />
                    <Text category="label" style={{ marginBottom: 8 }}>Sản phẩm</Text>
                    <Divider style={{ marginBottom: 8 }}/>
                    {getCartItemsUI()}
                </Layout>

                <Layout style={{ flex: 2 }}>
                    <Space />
                    <Text category="label" style={{ marginBottom: 8 }}>Trạng thái</Text>
                    <Divider />
                    <Space />
                    {getStateDetailsUI()}
                </Layout>
            </Layout>
        );

        function getDescriptionUI() {
            if (order.description && order.description !== "")
                return <Text>Chú thích: {order.description}</Text>
        }

        function getId() {
            if (showId)
                return <Text>Id: {order.id}</Text>;
        }
    }

    return (
        <Layout style={{ flex: 1, padding: 16 }}>
            {getContentUI()}
        </Layout>
    );
}