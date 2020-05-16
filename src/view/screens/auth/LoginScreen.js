import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, Layout, Icon, Input } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { Toast } from "native-base";
import { Texts } from "../../../core/texts";
import { login } from "../../redux/actions/authActions";
import { AccountService } from "../../../core/services";
import { ACCOUNT_TYPES } from "../../../core/types";

/**
 * @param {*} param0 route.params.shouldGoBack 
 */
export default function LoginScreen({ navigation, route }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isHidingPassword, setIsHidingPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
    const dispatch = useDispatch();

    const showPasswordIcon = style => (
        <Icon {...style} name={isHidingPassword ? "eye-off" : "eye"} />
    );

    const cardFooter = () => (
        <Layout>
            <Button
                disabled={username === "" || password === "" || isLoading}
                onPress={handleLoginButtonPress}
                style={{ borderRadius: 20 }}
            >
                Đăng nhập
            </Button>
        </Layout>
    );

    async function handleLoginButtonPress() {
        setIsLoading(true);

        const result = await AccountService.login(username, password);
        if (result.error) {
            Toast.show({
                text: result.error,
                type: "danger"
            });
        } else if (!result.account.isActive) {
            Toast.show({
                text: `Tài khoản đã bị khóa với lý do: ${result.account.description}`,
                type: "warning",
                duration: 6000
            });
        }
        else {
            dispatch(login(result.account, true));
            if (route && route.params && route.params.shouldGoBack) {
                navigation.goBack();
            } else {
                const screen = result.account.accountType === ACCOUNT_TYPES.Employee ? "EmployeeHome" : "CustomerHome";
                navigation.navigate(screen);
            }
            setUsername("");
            setPassword("");
        }

        setIsLoading(false);
    }

    if (isLoading)
        return <ActivityIndicator style={{ flex: 1, alignContent: "center", margin: 8 }} />

    return (
        <Layout style={{ flex: 1, justifyContent: "space-between" }}>
            <Card
                appearance="filled"
                footer={cardFooter}
            >
                <Input
                    label="Email"
                    disabled={isLoading}
                    maxLength={100}
                    onChangeText={setUsername}
                    value={username}
                />
                <Input
                    icon={showPasswordIcon}
                    disabled={isLoading}
                    label="Mật khẩu"
                    maxLength={100}
                    onChangeText={setPassword}
                    onIconPress={() => setIsHidingPassword(!isHidingPassword)}
                    secureTextEntry={isHidingPassword}
                    value={password}
                />
            </Card>
        </Layout>
    );
}