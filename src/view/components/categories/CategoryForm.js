import React, { useState } from "react";
import { Button, Card, CardHeader, Input, Text } from "@ui-kitten/components";
import { CategoryService } from "../../../core/services";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";

/**
 * 
 * @param {*} props mode["create", "edit", "delete"], category, onCancel, onOk
 */
export default function CategoryForm(props) {

    const [name, setName] = useState(props.mode == "edit" && props.category != null ? props.category.name : "");
    const [description, setDescription] = useState(props.mode == "edit" && props.category != null ? props.category.description : "");
    const [isProgressing, setIsProgressing] = useState(false);

    async function createCategory() {
        const newCategory = {
            name: name,
            description: description,
        };

        if (props.category)
            newCategory.parentCategoryId = props.category.id;

        const result = await CategoryService.create(newCategory);
        console.log(result);
        // TODO: show error...
    }

    async function updateCategory() {
        const updatedCategory = props.category;
        updatedCategory.name = name;
        updatedCategory.description = description;

        const result = await CategoryService.update(updatedCategory);

        console.log(result);
        // TODO: show error...
    }

    async function deleteCategory() {
        const deleteCategory = props.category;
        const result = await CategoryService.delete(deleteCategory.id);

        console.log(result);
        // TODO: show error...
    }

    async function handleOnOkButtonPress() {
        // TODO: Validate name & description.
        setIsProgressing(true);

        if (props.mode == "create")
            await createCategory();

        if (props.mode == "edit")
            await updateCategory();

        if (props.mode == "delete")
            await deleteCategory();

        setIsProgressing(false);
        await props.onOk();
    }

    function getParentInfo() {
        if (props.mode == "create") {
            return (
                <Input
                    disabled={true}
                    label="Parent Category"
                    value={props.category ? props.category.name : "No parent (Root category)"}
                />
            )
        }
    }

    function getHeader() {
        return <CardHeader title={props.mode.toUpperCase()} />
    }

    function getFooter() {
        return (
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Button appearance="ghost" onPress={props.onCancel}>Cancel</Button>
                <Button appearance="ghost" onPress={handleOnOkButtonPress}>OK</Button>
            </View>
        );
    }

    function getFormContent() {
        if (isProgressing)
            return <ActivityIndicator />

        if (props.mode == "delete") {
            return <Text>Delete {props.category.name} category?</Text>
        }

        return (
            <View>
                <Input
                    label="Name"
                    onChangeText={setName}
                    value={name}
                />
                <Input
                    label="Description"
                    onChangeText={setDescription}
                    value={description}
                />
                {getParentInfo()}
            </View>
        );
    }

    return (
        <Card
            footer={getFooter}
            header={getHeader}
        >
            {getFormContent()}
        </Card>
    )
}