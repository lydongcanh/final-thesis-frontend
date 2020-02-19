import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, Layout, Icon, Input } from "@ui-kitten/components";
import { Snackbar } from "react-native-paper";
import { validateUsername, validatePassword } from "../../../core/validations";
import { Texts } from "../../../core/texts";
import { login } from "../../redux/actions/authActions";
import { Space } from "../others";
import { AccountService } from "../../../core/services";

export default function CustomerSignupPanel() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [editingUsername, setEditingUsername] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [editingConfirmPassword, setEditingConfirmPassword] = useState(false);
    const [isHidingPassword, setIsHidingPassword] = useState(true);
    const [isShowingSnackbar, setIsShowingSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const dispatch = useDispatch();

    const showPasswordIcon = style => (
        <Icon {...style} name={isHidingPassword ? "eye-off" : "eye"} />
    );

    const cardFooter = () => (
        <Layout style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
                disabled={!validUsername || !validPassword || !validConfirmPassword}
                onPress={handleSignupButtonPress}
                size="small"
            >
                Sign Up
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
        const result = await AccountService.customerSignup(username, password);

        if (result.error) {
            setSnackbarMessage(result.error);
            setIsShowingSnackbar(true);
            return;
        }

        dispatch(login(username, password));
    }

    return (
        <Layout style={{ flex: 1, justifyContent: "space-between"}}>
            <Card
                appearance="filled"
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
                <Space />
                <Input
                    caption={editingConfirmPassword ? validConfirmPassword ? "" : Texts.INVALID_CONFIRM_PASSWORD : ""}
                    label="Confirm Password"
                    maxLength={100}
                    onChangeText={handleConfirmPasswordInputChange}
                    secureTextEntry={true}
                    status={editingConfirmPassword ? validConfirmPassword ? "success" : "danger" : "basic"}
                    value={confirmPassword}
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