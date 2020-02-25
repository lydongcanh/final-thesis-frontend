import React, { useState } from "react";
import { Input, Icon } from "@ui-kitten/components";

/**
 * @param {*} props placeHolder, defaultValue, onChangeText, onSearch
 */
export default function SearchInput(props) {

    const { placeHolder, defaultValue, onChangeText, onSearch } = props;

    const [searchValue, setSearchValue] = useState(defaultValue);

    function getSearchIcon(style) {
        return <Icon {...style} name="search" />
    }

    function handleOnChangeText(text) {
        setSearchValue(text);
        
        if (onChangeText)
            onChangeText(text);
    }

    function handleOnSearch() {
        if(onSearch)
            onSearch(searchValue);
    }

    return (
        <Input
            placeholder={placeHolder}
            value={searchValue}
            onChangeText={handleOnChangeText}
            onIconPress={handleOnSearch}
            icon={getSearchIcon}
            style={{ borderRadius: 24, margin: 8 }}
        />
    );
}