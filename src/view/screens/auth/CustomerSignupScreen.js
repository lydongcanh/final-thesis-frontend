import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, Layout, Icon, Input } from "@ui-kitten/components";
import { validateUsername, validatePassword } from "../../../core/validations";
import { Texts } from "../../../core/texts";
import { login } from "../../redux/actions/authActions";
import { AccountService, CustomerService } from "../../../core/services";
import { Toast } from "native-base";
import { Space } from "../../components/others";
import { ActivityIndicator } from "react-native-paper";
import { CUSTOMER_VIP_LEVELS } from "../../../core/types";

export default function CustomerSignupScreen({ navigation }) {
    const [customerName, setCustomerName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
        console.log(customerResult);

        account.customerId = customerResult.data.id;
        const updateAccountResult = await AccountService.update(account);
        console.log(updateAccountResult);

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
            </Card>
        );
    }
    return (
        <Layout style={{ flex: 1, justifyContent: "space-between" }}>
            {getContentUI()}
        </Layout>
    );
}