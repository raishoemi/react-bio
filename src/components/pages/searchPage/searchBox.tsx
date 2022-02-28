import { AutoComplete, Input } from 'antd';
import React, { useState } from 'react';
import { QueryResult } from './types';


type SearchBoxProps = {
    placeholder: string;
    queryFunction: (query: string) => Promise<QueryResult[]>;
    onSearch: (query: string) => void;
    onSelected: (id: number) => void;
    style: object;
}

const SearchBox: React.FunctionComponent<SearchBoxProps> = (props: SearchBoxProps) => {
    const [options, setOptions] = useState<QueryResult[]>([])

    const handleInputChanged = (query: string) => {
        props.queryFunction(query).then(results => {
            setOptions(results.slice(0, 4));
        })
    };

    const handleSearch = (query: string) => {
        setOptions([]);
        props.onSearch(query);
    };

    return (
        <AutoComplete
            options={options}
            onSelect={props.onSelected}
            onSearch={handleInputChanged}
            style={props.style}
        >
            <Input.Search placeholder={props.placeholder} enterButton onSearch={handleSearch} />
        </AutoComplete>
    );
};

export default SearchBox;