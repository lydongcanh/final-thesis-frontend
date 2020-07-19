import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, Layout, Icon, Input } from "@ui-kitten/components";
import { validateUsername, validatePassword } from "../../../core/validations";
import { Texts } from "../../../core/texts";
import { login } from "../../redux/actions/authActions";
import { AccountService, CustomerService, EmailService } from "../../../core/services";
import { Toast } from "native-base";
import { Space } from "../../components/others";
import { ActivityIndicator } from "react-native-paper";
import { CUSTOMER_VIP_LEVELS } from "../../../core/types";
import { simpleHash } from "../../../core/utilities";

export default function CustomerSignupScreen({ navigation }) {
    const [customerName, setCustomerName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [hashValue, setHashValue] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validCustomerName, setValidCustomerName] = useState(false);
    const [validUsername, setValidUsername] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [editingCustomerName, setEditingCustomerName] = useState(false);
    const [editingUsername, setEditingUsername] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [editingConfirmPassword, setEditingConfirmPassword] = useState(false);
    const [isHidingPassword, setIsHidingPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const showPasswordIcon = style => (
        <Icon {...style} name={isHidingPassword ? "eye-off" : "eye"} />
    );

    const cardFooter = () => (
        <Layout>
            <Button
                disabled={!validUsername || !validPassword || !validConfirmPassword || isLoading}
                onPress={handleSignupButtonPress}
                style={{ borderRadius: 20 }}
            >
                Tạo tài khoản
            </Button>
        </Layout>
    );

    function handleUsernameInputChange(username) {
        setUsername(username);
        setEditingUsername(true);
        setValidUsername(validateUsername(username));
    }

    function handlePasswordInputChange(password) {
        setPassword(password);
        setEditingPassword(true);
        setValidPassword(validatePassword(password));
    }

    function handleCustomerNameInputChange(name) {
        setCustomerName(name);
        setEditingCustomerName(true);
        setValidCustomerName(name !== null & name.length > 0);
    }

    function handleConfirmPasswordInputChange(confirmPassword) {
        setConfirmPassword(confirmPassword);
        setEditingConfirmPassword(true);
        setValidConfirmPassword(
            (password && confirmPassword) &&
            (password !== "" && confirmPassword !== "") &&
            (confirmPassword === password)
        );
    }

    async function handleSignupButtonPress() {
        setIsLoading(true);

        if (simpleHash(username) != hashValue) {
            Toast.show({
                text: "Mã xác nhận không hợp lệ.",
                type: "danger"
            });
            
            setIsLoading(false);
            return;
        }

        const accountResult = await AccountService.customerSignup(username, password);
        if (accountResult.error) {
            Toast.show({
                text: accountResult.error,
                type: "danger"
            });
            
            setIsLoading(false);
            return;
        }
        
        const account = accountResult.data;
        const customerResult = await CustomerService.create({
            accountId: account.id,
            name: customerName,
            email: username,
            vipLevel: CUSTOMER_VIP_LEVELS.VIP_0 
        });
        //console.log(customerResult);

        account.customerId = customerResult.data.id;
        await AccountService.update(account);
        //console.log(updateAccountResult);

        dispatch(login(account, true));
        navigation.navigate("CustomerHome");
        setIsLoading(false);
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center", margin: 8 }} />
        
        return (
            <Card
                appearance="filled"
                footer={cardFooter}
            >
                <Input
                    caption={editingCustomerName ? validCustomerName ? "" : Texts.INVALID_PERSON_NAME : ""}
                    disabled={isLoading}
                    label="Họ & tên"
                    maxLength={100}
                    onChangeText={handleCustomerNameInputChange}
                    status={editingCustomerName ? validCustomerName ? "success" : "danger" : "basic"}
                    value={customerName}
                />
                <Space />

                <Input
                    caption={editingUsername ? validUsername ? "" : Texts.INVALID_USERNAME : ""}
                    disabled={isLoading}
                    label="Email"
                    maxLength={100}
                    onChangeText={handleUsernameInputChange}
                    status={editingUsername ? validUsername ? "success" : "danger" : "basic"}
                    value={username}
                />
                <Space />

                <Input
                    caption={editingPassword ? validPassword ? "" : Texts.INVALID_PASSWORD : ""}
                    icon={showPasswordIcon}
                    disabled={isLoading}
                    label="Mật khẩu"
                    maxLength={100}
                    onChangeText={handlePasswordInputChange}
                    onIconPress={() => setIsHidingPassword(!isHidingPassword)}
                    secureTextEntry={isHidingPassword}
                    status={editingPassword ? validPassword ? "success" : "danger" : "basic"}
                    value={password}
                />
                <Space />

                <Input
                    caption={editingConfirmPassword ? validConfirmPassword ? "" : Texts.INVALID_CONFIRM_PASSWORD : ""}
                    disabled={isLoading}
                    label="Nhập lại mật khẩu"
                    maxLength={100}
                    onChangeText={handleConfirmPasswordInputChange}
                    secureTextEntry={true}
                    status={editingConfirmPassword ? validConfirmPassword ? "success" : "danger" : "basic"}
                    value={confirmPassword}
                />
                <Space />
                <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Input
                        style={{ flex: 4 }}
                        disabled={isLoading}
                        label="Mã xác nhận"
                        maxLength={100}
                        onChangeText={setHashValue}
                        value={hashValue}
                    />
                    <Button
                        onPress={async () => await EmailService.sendEmail(username, "Mã xác nhận", `Mã xác nhận tài khoản: ${simpleHash(username)}`)}
                        size="tiny"
                        style={{ height: 40, top: 22, left: 4 }}
                        disabled={!validateUsername(username)}
                    >
                        Gửi
                    </Button>
                </Layout>
            </Card>
        );
    }
    return (
        <Layout style={{ flex: 1, justifyContent: "space-between" }}>
            {getContentUI()}
        </Layout>
    );
}