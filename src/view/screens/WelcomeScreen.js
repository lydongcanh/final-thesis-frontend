import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Button, Text, Icon } from "@ui-kitten/components";
import { ImageBackground, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Toast } from "native-base";
import { ACCOUNT_TYPES } from "../../core/types";
import { AccountService } from "../../core/services";
import { Space } from "../components/others";
import { login } from "../redux/actions/authActions";

export default function WelcomeScreen({ navigation }) {

    const backgroundUri = "https://mfiles.alphacoders.com/622/622416.jpg";
    const auth = useSelector(state => state.authReducer);
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        login();
    }, []);

    async function login() {
        try {
            setIsLoading(true);     
            if (auth.account) {
                const result = await AccountService.login(auth.account.username, auth.account.password);
                if (result.error) {
                    Toast.show({
                        text: "Mật khẩu đã được thay đổi, vui lòng đăng nhập lại",
                        type: "warning",
                        duration: 3000
                    });
                } else {
                    const screen = auth.account.accountType === ACCOUNT_TYPES.Employee ? "EmployeeHome" : "CustomerHome";
                    setIsLoaded(true);
                    dispatch(login(result.account, true));
                    navigation.navigate(screen);
                }
            }
        } catch(e) {
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignSelf: "center" }} />

        if (!isLoaded) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text appearance="hint">Có lỗi xảy ra khi đăng nhập, xin thử lại!</Text>
                    <Space />
                    <Button
                        size="tiny"
                        icon={(style) => <Icon {...style} name="sync" />}
                        onPress={login}
                    >
                        Thử lại
                    </Button>
                </View>
            );
        }

        return (
            <View style={{ top: "70%", flex: .225, justifyContent: "space-between", margin: 24 }}>
                <Button
                    style={{ borderRadius: 24, backgroundColor: "black", borderWidth: 0 }}
                    status="danger"
                    onPress={() => navigation.navigate("Login")}
                >
                    ĐĂNG NHẬP
                </Button>
                <Button
                    style={{ borderRadius: 24, backgroundColor: "white", borderWidth: 0 }}
                    textStyle={{ color: "black" }}
                    appearance="outline"
                    onPress={() => navigation.navigate("CustomerSignup")}
                >
                    ĐĂNG KÝ
                </Button>
                <Button
                    style={{ borderRadius: 24 }}
                    textStyle={{ textDecorationLine: "underline", color: "white" }}
                    appearance="ghost"
                    status="basic"
                    onPress={() => navigation.navigate("CustomerHome")}
                >
                    Bỏ qua
                </Button>
            </View>
        )
    }

    return (
        <Layout>
            <ImageBackground
                blurRadius={isLoading ? 3 : .5}
                style={{ width: "100%", height: "100%" }}
                source={{ uri: backgroundUri }}
            >
                {getContentUI()}
            </ImageBackground>
        </Layout>
    )
}