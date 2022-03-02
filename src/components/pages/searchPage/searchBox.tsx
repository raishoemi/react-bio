import { AutoComplete, Input } from 'antd';
import React, { useState } from 'react';
import { Entity } from '../../../types';


type SearchBoxProps = {
    example: string;
    queryFunction: (query: string) => Promise<Entity[]>;
    onSearch: (query: string) => Promise<void>;
    onSelected: (id: number) => void;
    style: object;
}

const SearchBox: React.FunctionComponent<SearchBoxProps> = (props: SearchBoxProps) => {
    const [options, setOptions] = useState<{ label: string, value: number }[]>([])

    const handleInputChanged = (query: string) => {
        props.queryFunction(query).then((results: Entity[]) => {
            setOptions(results.slice(0, 4).map((result: Entity) => { return { label: result.name, value: result.id } }));
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
            <Input.Search placeholder={`E.g. ${props.example}`} enterButton onSearch={handleSearch} />
        </AutoComplete>
    );
};

export default SearchBox;