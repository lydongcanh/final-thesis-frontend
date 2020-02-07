import React, { useEffect, useState } from "react";
import { Card, CardHeader, Input, Select } from "@ui-kitten/components";
import { CategoryService } from "../../../core/services";
import { ActivityIndicator, Button } from "react-native-paper";

/**
 * 
 * @param {*} props mode["create", "edit", "delete"], category, onOk
 */
export default function CategoryForm(props) {

    const [name, setName] = useState(props.mode == "edit" && props.category != null ? props.category.name : "");
    const [description, setDescription] = useState(props.mode == "edit" && props.category != null ? props.category.description : "");
    const [parentSelectIndex, setParentSelectIndex] = useState(0);
    const [allCategories, setAllcategories] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        const result = await CategoryService.getAll();
        if (result.data) {
            setAllcategories(result.data);
        } else {
            // TODO: show error and load again button.
            alert("Failed to load categories!");
        }
    }

    function getCategoryDisplayName(category) {
        return `${category.name}`;
    }

    function getCategorySelectData() {
        if (!allCategories)
            return [];

        const data = [];
        for(let i = 0; i < allCategories.length; i++) {
            data.push({
                index: i,
                text: getCategoryDisplayName(allCategories[i])
            });
        }
        return data;
    }

    function handleCategoryOnSelect({ index }) {
        setParentSelectIndex(index);
    }

    function getCategorySelect() {
        if (!allCategories)
            return <ActivityIndicator />

        return (
            <Select
                data={getCategorySelectData()}
                onSelect={handleCategoryOnSelect}
                label="Parent Category"
            />
        );
    }

    async function handleCreateButtonOnPress() {
        const result = await CategoryService.create({
            name: name,
            description: description,
            parentCategoryId: allCategories[parentSelectIndex].id
        });
        await loadCategories();
        console.log(JSON.stringify(result.data, null, 2));
    }

    function getHeader() {
        return <CardHeader title={props.mode.toUpperCase()} />
    }

    return (
        <Card 
            header={getHeader}
        > 
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
            {getCategorySelect()}
        </Card>
    )
}