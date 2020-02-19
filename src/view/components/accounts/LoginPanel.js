import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, CardHeader, Layout, Icon, Input, CheckBox } from "@ui-kitten/components";
import { Snackbar } from "react-native-paper";
import { validateUsername, validatePassword } from "../../../core/validations";
import { Texts } from "../../../core/texts";
import { login } from "../../redux/actions/authActions";
import { Space } from "../others";
import { AccountService } from "../../../core/services";

export default function LoginPanel() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);
    const [validUsername, setValidUsername] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [editingUsername, setEditingUsername] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [isHidingPassword, setIsHidingPassword] = useState(true);
    const [isShowingSnackbar, setIsShowingSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

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
            />
            <Button
                disabled={!validUsername || !validPassword}
                onPress={handleLoginButtonPress}
                size="small"
            >
                Login
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

    async function handleLoginButtonPress() {
        const result = await AccountService.login(username, password);
        console.log(result);
        if (result.error) {
            setSnackbarMessage(result.error);
            setIsShowingSnackbar(true);
            return;
        }

        dispatch(login(result.account, keepLoggedIn));
    }

    return (
        <Layout style={{ flex: 1, justifyContent: "space-between" }}>
            <Card
                appearance="filled"
                //header={() => <CardHeader title="Login" />}
                footer={cardFooter}
            >
                <Input
                    caption={editingUsername ? validUsername ? "" : Texts.INVALID_USERNAME : ""}
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
                    label="Password"
                    maxLength={100}
                    onChangeText={handlePasswordInputChange}
                    onIconPress={() => setIsHidingPassword(!isHidingPassword)}
                    secureTextEntry={isHidingPassword}
                    status={editingPassword ? validPassword ? "success" : "danger" : "basic"}
                    value={password}
                />
            </Card>
            <Snackbar
                duration={Snackbar.DURATION_SHORT}
                onDismiss={() => setIsShowingSnackbar(false)}
                visible={isShowingSnackbar}
            >
                {snackbarMessage}
            </Snackbar>
        </Layout>
    );
}