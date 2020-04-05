import React, { useState, useEffect } from "react";
import { Platform, StatusBar, Image, View, FlatList } from "react-native";
import { Layout, Text, Button, List, ListItem, Icon, Card, CardHeader } from "@ui-kitten/components";
import { useSelector, useDispatch } from "react-redux";
import { Space, CustomerScreensHeader } from "../../../components/others";
import { logout } from "../../../redux/actions/authActions";
import { Divider, ActivityIndicator } from "react-native-paper";
import { Texts } from "../../../../core/texts";
import { CustomerOrderService } from "../../../../core/services";
import { CUSTOMER_ORDER_TYPES } from "../../../../core/types";
import { formatCurrency } from "../../../../core/utilities";

export default function AccountInfoScreen({ navigation }) {

    const accountFunctionDatas = [
        {
            title: "Thông tin cá nhân",
            icon: "edit",
            callback: handleAccountDetailsButton
        },
        {
            title: "Đổi mật khẩu",
            icon: "lock",
            callback: handleChangePasswordButton
        },
        {
            title: "Hóa đơn đã hoàn tất",
            icon: "pricetags",
            callback: handleCompletedOrdersButton
        },
    ];

    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [orders, setOrders] = useState([]);

    const dispatch = useDispatch();
    const auth = useSelector(state => state.authReducer);
    const account = auth.account;

    useEffect(() => {
        loadOrders();
    }, [navigation]);

    async function loadOrders() {
        try {
            if (!account || !account.customer) {
                setIsLoaded(true);
                return;
            }

            const result = await CustomerOrderService.getByCustomerId(account.customer.id);
            if (result.error) {
                setIsLoaded(false);
                return;
            }

            setOrders(result.data);
            setIsLoaded(true);
        } catch (e) {
            console.log(e);
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }

    function handleAccountDetailsButton() {
        navigation.navigate("CustomerAccountDetails", { customer: account.customer })
    }

    function handleChangePasswordButton() {

    }

    function handleCompletedOrdersButton() {

    }

    function getOrders(completed) {
        if (!orders || orders.length < 1)
            return [];

        // TODO: recheck business logic...
        return orders.filter(order => {
            return (order.orderState === CUSTOMER_ORDER_TYPES.Completed) === completed;
        });
    }

    function getOrderUI(order) {
        return (
            <Card
                onPress={() => alert(JSON.stringify(order, null, 2))}
                style={{ flex: 1, margin: 4, borderRadius: 8 }}
            >
                <Text appearance="hint">
                    Trạng thái: {order.orderState}
                </Text>
                <Text appearance="hint">
                    Giá: {formatCurrency(CustomerOrderService.calculateFinalPrice(order))}VND
                </Text>
                <Text appearance="hint">
                    Địa chỉ: {order.shipAddress.number}, {order.shipAddress.street}, {order.shipAddress.district}, {order.shipAddress.city}
                </Text>
                <Text appearance="hint">
                    Ngày đặt hàng: {new Date(Date.parse(order.creationDate)).toLocaleDateString()}
                </Text>
            </Card>
        );
    }

    function getUnCompletedOrdersUI() {
        if (!orders || orders.length < 1)
            return <Text>{Texts.NO_UNCOMPLETED_CUSTOMER_ORDER}</Text>

        return (
            <Layout style={{ flex: 2, padding: 8 }}>
                <Text category="label" style={{ fontWeight: "bold" }}>Đơn hàng chờ xử lý</Text>
                <Divider style={{ marginTop: 4, marginBottom: 4 }} />
                <FlatList
                    data={getOrders(false)}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => getOrderUI(item)}
                />
            </Layout>
        );
    }

    function getAccountFunctionUI({ item }) {
        return (
            <Layout>
                <ListItem
                    title={item.title}
                    icon={style => <Icon {...style} name={item.icon} />}
                    accessory={style => <Icon {...style} name="chevron-right-outline" />}
                    onPress={item.callback}
                />
                <Divider />
            </Layout>
        );
    }

    function getLoggedInUI() {
        const customer = account.customer;

        return (
            <Layout style={{ flex: 1, margin: 16, justifyContent: "space-between" }}>
                <Layout style={{ alignItems: "center" }}>
                    <Layout style={{ elevation: 8, borderRadius: 50 }}>
                        <Image
                            style={{ width: 100, height: 100, borderRadius: 50 }}
                            source={{ uri: customer.imagePath }}
                        />
                    </Layout>
                    <Text category="h5" style={{ fontWeight: "bold" }} >{customer.name}</Text>
                    <Text appearance="hint" >{customer.vipLevel}</Text>
                </Layout>

                <Layout style={{ flex: 1, padding: 4 }}>
                    <List
                        style={{ backgroundColor: "white" }}
                        data={accountFunctionDatas}
                        renderItem={getAccountFunctionUI}
                    />
                </Layout>

                {getUnCompletedOrdersUI()}

                <Button
                    size="tiny"
                    style={{ borderRadius: 24, position: "absolute", top: 0, left: 0 }}
                    status="basic"
                    appearance="outline"
                    onPress={() => dispatch(logout())}
                >
                    Đăng xuất
                </Button>
            </Layout>
        );
    }

    function getUnloggedInUI() {
        return (
            <Layout style={{
                flex: 1,
                margin: 16,
                justifyContent: "center",
                marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
            }}>
                <Button
                    style={{ borderRadius: 24 }}
                    status="info"
                    onPress={() => navigation.navigate("Login")}
                >
                    ĐĂNG NHẬP
                </Button>
                <Space />

                <Button
                    style={{ borderRadius: 24 }}
                    status="basic"
                    onPress={() => navigation.navigate("CustomerSignup")}
                >
                    ĐĂNG KÝ
                </Button>
            </Layout>
        )
    }

    function getAccountContent() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignSelf: "center" }} />

        if (!isLoaded) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text appearance="hint">Có lỗi xảy ra khi load dữ liệu, xin thử lại!</Text>
                    <Space />
                    <Button
                        size="tiny"
                        icon={(style) => <Icon {...style} name="sync" />}
                        onPress={loadOrders}
                    >
                        Thử lại
                    </Button>
                </View>
            );
        }

        // TODO: check persisted account.

        if (auth.loggedIn)
            return getLoggedInUI();

        return getUnloggedInUI();
    }

    return (
        <Layout style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight }}>
            <CustomerScreensHeader navigation={navigation} />
            {getAccountContent()}
        </Layout>
    );
}