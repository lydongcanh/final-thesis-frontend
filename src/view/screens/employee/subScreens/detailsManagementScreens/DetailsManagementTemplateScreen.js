import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Toast } from "native-base";
import { Layout, Button } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { ManagementTypes } from "../../../../types";

/**
 * @param param0 mode, createFunction, updateFunction, resetInputFunction,  canAdd, contentUI
 */
export default function DetailsManagementTemplateScreen({
    route, createFunction, updateFunction, resetInputFunction, canAdd, contentUI
}) {

    const [isLoading, setIsLoading] = useState(false);

    const mode = route ? route.params.mode : ManagementTypes.CREATE;
    const confirmFunction = mode === ManagementTypes.CREATE ? createFunction : updateFunction
    const successMessage = mode === ManagementTypes.CREATE ? "Thêm thành công." : "Cập nhật thành công.";
    const errorMessage = mode === ManagementTypes.CREATE ? "Thêm không thành công." : "Cập nhật không thành công.";

    async function handleConfirmButton() {
        try {
            setIsLoading(true);
            const result = await confirmFunction();
            if (result.error) {
                console.log(result.error);
                Toast.show({
                    text: errorMessage,
                    type: "danger"
                });
            } else {
                Toast.show({
                    text: successMessage,
                    type: "success"
                });

                if (mode && mode === ManagementTypes.CREATE && resetInputFunction)
                    resetInputFunction();
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                text: errorMessage,
                type: "danger"
            });
        } finally {
            setIsLoading(false);
        }
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignContent: "center" }} />

        return (
            <Layout style={{ flex: 1, padding: 16, justifyContent: "space-between" }}>
                <ScrollView>
                    {contentUI}
                </ScrollView>
                <Button
                    style={{ borderRadius: 25 }}
                    disabled={!canAdd()}
                    onPress={handleConfirmButton}
                >
                    Xác nhận
                </Button>
            </Layout>
        );
    }

    return getContentUI();
}