import React, { useState, useEffect } from "react";
import { Platform, StatusBar, Dimensions } from "react-native";
import { Button, Layout, Text } from "@ui-kitten/components";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Divider, ActivityIndicator } from "react-native-paper";
import randomFlatColors from "random-flat-colors"
import { EmployeeScreensHeader, Space, LoadErrorPanel } from "../../../components/others";
import { CustomerOrderService, ProductService } from "../../../../core/services";
import { CUSTOMER_ORDER_TYPES } from "../../../../core/types";
import { getMonths } from "../../../../core/utilities";

export default function AnalystScreen({ navigation }) {

    const TRENDING_PRODUCT_COUNT = 5;

    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [orders, setOrders] = useState([]);
    const [trendingData, setTrendingData] = useState([]);

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            setIsLoading(true);
            const result = await CustomerOrderService.query({ orderState: CUSTOMER_ORDER_TYPES.Completed });
            if (result.error) {
                console.log(result.error);
                setIsLoaded(false);
            } else {
                const orders = result.data;
                let rawData = [];
                let products = { };
                for(const order of orders) {
                    for (const detail of order.orderDetails) {
                        let existFlag = false;

                        let product = {};
                        if (products[detail.productDetails.productId]) {
                            product = products[detail.productDetails.productId];
                        } else {
                            const productResult = await ProductService.getById(detail.productDetails.productId);
                            product = productResult.data;
                            products[detail.productDetails.productId] = product;
                        }
                        detail.productDetails.product = product;

                        for (let i = 0; i < rawData.length; i++) {
                            if (rawData[i].id === product.id) {
                                rawData[i].unit += detail.quantity;
                                existFlag = true;
                                break;
                            }
                        }
            
                        if (!existFlag)
                            rawData.push({
                                id: product.id,
                                name: product.name,
                                unit: 0,
                            });
                    }
                    
                }
                const data = [];
                rawData = rawData.sort((a, b) => a.unit - b.unit);
        
                let otherProductSum = 0;
                for (let i = 0; i < rawData.length; i++) {
                    if (i < TRENDING_PRODUCT_COUNT) {
                        data.push({
                            name: rawData[i].name,
                            unit: rawData[i].unit,
                            color: randomFlatColors()
                        })
                    } else {
                        otherProductSum += rawData[i].unit;
                    }
                }
                data.push({
                    name: "Khác",
                    unit: otherProductSum,
                    color: randomFlatColors()
                });
                setTrendingData(data);
                setOrders(orders);
                setIsLoaded(true);
            }
        } catch (e) {
            console.log(e);
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }

    function openAnalystDetailsScreen() {
        navigation.navigate("TrendingProductAnalyst", {
            orders: orders
        });
    }

    function getRevenueUI() {
        function getLabels() {
            const labels = [];
            for(const month of getMonths())
                labels.push("Th" + month);
            return labels;
        };
        
        function getDatas() {
            const data = [];
            for(const month of getMonths()) {
                let sum = 0;
                for(const order of orders) {
                    const date = new Date(Date.parse(order.creationDate));
                    if (date.getFullYear() === new Date().getFullYear() && (date.getMonth() + 1) === month) {
                        for(const detail of order.orderDetails) {
                            sum += detail.purchasedPrice;
                        }
                    }
                }
                data.push(sum / 1000000);
            }
            return data;
        }

        return (
            <Layout>
                <Text category="label" style={{ marginLeft: 8 }}>Doanh thu</Text>
                <Divider style={{ margin: 4 }} />
                <LineChart
                    data={{
                        labels: getLabels(),
                        datasets: [
                            {
                                data: getDatas(),
                                strokeWidth: 2,
                            },
                        ],
                    }}
                    width={Dimensions.get('window').width + 48}
                    height={220}
                    yAxisSuffix=" Tr"
                    fromZero={true}
                    segments={3}
                    bezier
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#a7a7a7',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 8,
                        },
                    }}
                    style={{
                        marginLeft: 8,
                        marginRight: 98,
                        borderRadius: 8,
                    }}
                />
            </Layout>
        );
    }

    function getTrendingProductUI() {
        return (
            <Layout>
                <Text category="label" style={{ marginLeft: 8 }}>Sản phẩm bán chạy</Text>
                <Divider style={{ margin: 4 }} />
                <PieChart
                    data={trendingData}
                    width={Dimensions.get('window').width - 48}
                    height={220}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                    accessor="unit"
                    backgroundColor="transparent"
                    paddingLeft="16"
                    absolute
                />
            </Layout>
        );
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center", margin: 8 }} />;

        if (!isLoaded)
            return <LoadErrorPanel onReload={loadOrders} />;

        return (
            <Layout style={{ flex: 1 }}>
                <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text category="h6" style={{ marginLeft: 8 }}>Thống kê tháng {getMonths().join(", ")}</Text>
                    <Button
                        size="tiny"
                        appearance="ghost"
                        onPress={openAnalystDetailsScreen}
                        style={{ marginHorizontal: 8, marginVertical: 4 }}
                    >
                        Chi tiết
                    </Button>
                </Layout>
                <Divider />

                <Layout style={{ padding: 16 }}>
                    {getRevenueUI()}
                    <Space value={16}/>
                    {getTrendingProductUI()}
                </Layout>
            </Layout>
        )
    }

    return (
        <Layout style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight }}>
            <EmployeeScreensHeader navigation={navigation} />
            {getContentUI()}
        </Layout>
    );
}