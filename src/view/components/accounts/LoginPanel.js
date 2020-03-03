import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, Layout, Icon, Input, CheckBox } from "@ui-kitten/components";
import { Texts } from "../../../core/texts";
import { login } from "../../redux/actions/authActions";
import { AccountService } from "../../../core/services";
import { Toast } from "native-base";

export default function LoginPanel() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);
    const [isHidingPassword, setIsHidingPassword] = useState(true);

    const dispatch = useDispatch();

    const showPasswordIcon = style => (
        <Icon {...style} name={isHidingPassword ? "eye-off" : "eye"} />
    );

    const cardFooter = () => (
        <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <CheckBox
                text={Texts.REMEMBER_ME}
                checked={keepLoggedIn}
                onChange={setKeepLoggedIn}
                disabled // TODO: enable later...
            />
            <Button
                disabled={username === "" || password === "" }
                onPress={handleLoginButtonPress}
                size="small"
            >
                Đăng nhập
            </Button>
        </Layout>
    );

    async function handleLoginButtonPress() {
        const result = await AccountService.login(username, password);

        if (result.error) {
            Toast.show({
                text: result.error,
                type: "danger"
            });
            return;
        }

        dispatch(login(result.account, keepLoggedIn));
    }

    return (
        <Layout style={{ flex: 1, justifyContent: "space-between" }}>
            <Card
                appearance="filled"
                footer={cardFooter}
            >
                <Input
                    label="Email"
                    maxLength={100}
                    onChangeText={setUsername}
                    value={username}
                />
                <Input
                    icon={showPasswordIcon}
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