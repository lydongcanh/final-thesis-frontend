import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, Layout, Icon, Input } from "@ui-kitten/components";
import { Texts } from "../../../core/texts";
import { login } from "../../redux/actions/authActions";
import { AccountService } from "../../../core/services";
import { Toast } from "native-base";
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
        <Layout style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
                disabled={username === "" || password === "" || isLoading}
                onPress={handleLoginButtonPress}
                size="small"
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
        }
        else {
            dispatch(login(result.account, true));
            if (route && route.params && route.params.shouldGoBack) {
                navigation.goBack();
            } else {
                const screen = result.account.accountType === ACCOUNT_TYPES.Employee ? "EmployeeHome" : "CustomerHome";
                navigation.navigate(screen);
            }
        }

        setIsLoading(false);
    }

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