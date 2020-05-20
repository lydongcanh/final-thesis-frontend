import React, { useState, useEffect } from "react";
import { Platform, StatusBar, Dimensions } from "react-native";
import { Button, Layout, Text } from "@ui-kitten/components";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Divider, ActivityIndicator } from "react-native-paper";
import randomFlatColors from "random-flat-colors"
import { EmployeeScreensHeader, Space, LoadErrorPanel } from "../../../components/others";
import { CustomerOrderDetailsService } from "../../../../core/services";

export default function AnalystScreen({ navigation }) {

    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);
    const [trendingData, setTrendingData] = useState([]);

    useEffect(() => {
        loadOrderDetails();
    }, []);

    async function loadOrderDetails() {
        try {
            setIsLoading(true);
            const result = await CustomerOrderDetailsService.getAll();
            if (result.error) {
                console.log(result.error);
                setIsLoaded(false);
            } else {
                setOrderDetails(result.data);
                await updateTrendingData();
                setIsLoaded(true);
            }
        } catch (e) {
            console.log(e);
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }

    async function updateTrendingData() {
        if (!orderDetails || orderDetails.length < 1) {
            setTrendingData([]);
            return;
        }

        let rawData = [];
        for (const detail of orderDetails) {
            let existFlag = false;
            for (let i = 0; i < rawData.length; i++) {
                if (rawData[i].id === detail.productDetails.product.id) {
                    rawData[i].unit += detail.quantity;
                    existFlag = true;
                    break;
                }
            }

            if (!existFlag)
                rawData.push({
                    id: detail.productDetails.product.id,
                    name: detail.productDetails.product.name,
                    unit: 0,
                });
        }

        const data = [];
        rawData = rawData.sort((a, b) => a.unit - b.unit);

        let otherProductSum = 0;
        for (let i = 0; i < rawData.length; i++) {
            if (i < 5) {
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
    }

    function getRevenueUI() {
        return (
            <Layout>
                <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text category="h6" style={{ marginLeft: 8 }}>Doanh thu theo quý</Text>
                    <Button 
                        size="tiny"
                        appearance="ghost"
                        style={{ marginRight: 8 }}
                        onPress={() => alert("Đang cập nhật...")}
                    >
                        Chi tiết
                    </Button>
                </Layout>
                <Divider style={{ margin: 8 }} />
                <LineChart
                    data={{
                        labels: [
                            'Th1',
                            'Th2',
                            'Th3',
                            'Th4',
                            'Th5',
                            'Th6',
                        ],
                        datasets: [
                            {
                                data: [25.35, 45.5, 28.1, 80.4, 99, 43.75],
                                strokeWidth: 2,
                            },
                        ],
                    }}
                    width={Dimensions.get('window').width - 16}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#a7a7a7',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    style={{
                        marginLeft: 8,
                        borderRadius: 16,
                    }}
                />
            </Layout>
        );
    }

    function getTrendingProductUI() {
        return (
            <Layout>
                <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text category="h6" style={{ marginLeft: 8 }}>Sản phẩm bán chạy</Text>
                    <Button 
                        size="tiny"
                        appearance="ghost"
                        style={{ marginRight: 8 }}
                        //onPress={() => alert("Đang cập nhật...")}
                        onPress={() => alert(JSON.stringify(trendingData, null, 2))}
                    >
                        Chi tiết
                    </Button>
                </Layout>
                <Divider style={{ margin: 8 }} />
                <PieChart
                    data={trendingData}
                    width={Dimensions.get('window').width - 16}
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
                    //absolute
                />
            </Layout>
        );
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center", margin: 8 }} />;

        if (!isLoaded)
            return <LoadErrorPanel onReload={loadOrderDetails} />;

        return (
            <Layout style={{ flex: 1 }}>
                {getRevenueUI()}
                <Space value={16}/>
                {getTrendingProductUI()}
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