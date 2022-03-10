import { AutoComplete, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Entity } from '../../types';


type SearchBoxProps = {
    example: string;
    queryFunction: (query: string) => Promise<Entity[]>;
    onSearch: (query: string) => void;
    onSelected: (id: number) => void;
    style: object;
}

const SearchBox: React.FunctionComponent<SearchBoxProps> = (props: SearchBoxProps) => {
    const [options, setOptions] = useState<{ label: string, value: string }[]>([])
    const [query, setQuery] = useState<string>('');
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setQuery(params.get('query') ?? '');
    }, [location]);

    const handleInputChanged = (query: string) => {
        props.queryFunction(query).then((results: Entity[]) => {
            setOptions(results.slice(0, 4).map((result: Entity) => { return { label: result.name, value: result.id.toString() } }));
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
            <Input.Search value={query} placeholder={`E.g. ${props.example}`} enterButton onSearch={handleSearch} />
        </AutoComplete>
    );
};

export default SearchBox;