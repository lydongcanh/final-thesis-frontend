import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Layout, Input, Button, Icon, Card } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { Toast } from "native-base";
import { Space } from "../../components/others";
import { Texts } from "../../../core/texts";
import { logout } from "../../redux/actions/authActions";
import { validatePassword } from "../../../core/validations";
import { AccountService } from "../../../core/services";

export default function ChangePasswordScreen({ navigation, route }) {
    const account = route ? route.params.account : null;

    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [isHidingPassword, setIsHidingPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [editingConfirmPassword, setEditingConfirmPassword] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validConfirmPassword, setValidConfirmPassword] = useState(false);

    const dispatch = useDispatch();

    function handlePasswordChange(text) {
        setPassword(text);
        setEditingPassword(true);
        setValidPassword(validatePassword(text));
    }

    function handleConfirmPasswordChange(text) {
        setConfirmPassword(text);
        setEditingConfirmPassword(true);
        setValidConfirmPassword(
            (password && text) &&
            (password !== "" && text !== "") &&
            (text === password)
        );
    }

    async function handleConfirmButton() {
        try {
            setIsLoading(true);
            if (password === account.password) {
                Toast.show({
                    text: "Mật khẩu mới không được trùng với mật khẩu cũ.",
                    type: "warning",
                    duration: 3000
                });
                return;
            }

            const tempAccount = account;
            tempAccount.password = password;
            const result = await AccountService.update(tempAccount);
            if (result.error) {
                Toast.show({
                    text: error,
                    type: "warning",
                    duration: 3000
                });
            } else {
                Toast.show({
                    text: "Đổi mật khẩu thành công",
                    type: "success",
                    duration: 5000
                });
                dispatch(logout());
                resetUI();
                navigation.navigate("Welcome");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    function resetUI() {
        setPassword("");
        setConfirmPassword("");
        setIsHidingPassword(true);
        setIsLoading(false);
    }

    const cardFooter = () => (
        <Layout>
            <Button
                disabled={!validPassword || !validConfirmPassword || isLoading}
                style={{ borderRadius: 20 }}
                onPress={handleConfirmButton}
            >
                Đổi mật khẩu
            </Button>
        </Layout>
    );

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center", margin: 8 }} />

        return (
            <Card
                appearance="filled"
                footer={cardFooter}
            >
                <Input
                    caption={editingPassword ? validPassword ? "" : Texts.INVALID_PASSWORD : ""}
                    status={editingPassword ? validPassword ? "success" : "danger" : "basic"}
                    disabled={isLoading}
                    label="Mật khẩu mới"
                    maxLength={100}
                    value={password}
                    onChangeText={handlePasswordChange}
                    onIconPress={() => setIsHidingPassword(!isHidingPassword)}
                    secureTextEntry={isHidingPassword}
                    icon={style => <Icon {...style} name={isHidingPassword ? "eye-off" : "eye"} />}
                />
                <Space />

                <Input
                    caption={editingConfirmPassword ? validConfirmPassword ? "" : Texts.INVALID_CONFIRM_PASSWORD : ""}
                    status={editingConfirmPassword ? validConfirmPassword ? "success" : "danger" : "basic"}
                    disabled={isLoading}
                    label="Nhập lại mật khẩu"
                    maxLength={100}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry={true}
                />
            </Card>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            {getContentUI()}
        </Layout>
    )
}