import React, { useState, useEffect } from "react";
import { Card, Modal, Button, Text, Input, Layout, CardHeader } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { AccountService } from "../../../core/services";
import { Space } from ".";

/**
 * 
 * @param param0 account, visible, setVisible, onUpdated
 */
export function LockAccountModal({ account, visible, setVisible, onUpdated = () => {} }) {

    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState(account ? account.description : "");

    useEffect(() => {
        setDescription(account ? account.description : "");
    }, [account]);

    async function updateAccount() {
        try {
            setIsLoading(true);
            let newAccount = account;
            newAccount.isActive = !account.isActive;
            newAccount.description = description;
            const result = await AccountService.update(newAccount);
            onUpdated(result);
            setVisible(false);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    function getFooterUI() {
        return (
            <Layout style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Button
                    disabled={!description || description == ""}
                    size="tiny"
                    appearance="ghost"
                    onPress={updateAccount}
                >
                    OK
                </Button>
                <Button
                    size="tiny"
                    appearance="ghost"
                    onPress={() => setVisible(false)}
                >
                    Hủy
                </Button>
            </Layout>
        )
    }

    function getContentUI() {
        if (!account)
            return <Text>Lỗi hiển thị thông tin tài khoản.</Text>;

        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center", margin: 8 }} />

        return (
            <Layout style={{ flex: 1 }}>
                <Layout style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                    <Text>Xác nhận muốn</Text>
                    <Text style={{ fontWeight: "bold" }}> {getLockText()}</Text>
                    <Text> tài khoản</Text>
                </Layout>
                <Layout style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                    <Text>{account.username}</Text>
                    <Text>?</Text>
                </Layout>
                <Space />
                <Input
                    label="Ghi chú"
                    maxLength={200}
                    value={description}
                    onChangeText={setDescription}
                />
            </Layout>
        )
    }

    function getLockText() {
        return (account && account.isActive) ? "khóa" : "mở khóa";
    }

    return (
        <Modal
            visible={visible}
            backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onBackdropPress={() => setVisible(false)}
            style={{ padding: 8, alignSelf: "center", width: "100%" }}
        >
            <Card
                disabled 
                footer={getFooterUI}
                header={() => <CardHeader title="Quản lý tài khoản" />}
            >
                {getContentUI()}
            </Card>
        </Modal>
    )
}