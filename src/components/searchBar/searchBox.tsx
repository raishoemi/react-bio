import { AutoComplete, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Entity } from '../../types';


type SearchBoxProps = {
    example: string;
    onAutoCompleteQuery: (query: string) => Promise<Entity[]>;
    onSearch: (query: string) => void;
    onSelected: (id: string) => void;
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
        props.onAutoCompleteQuery(query).then((results: Entity[]) => {
            setOptions(results.slice(0, 4).map((result: Entity) => { return { label: result.name, value: result.id.toString() } }));
        });
    };

    const handleSearch = (query: string) => {
        setOptions([]);
        props.onSearch(query);
    };

    const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }

    return (
        <AutoComplete
            options={options}
            onSelect={props.onSelected}
            onSearch={handleInputChanged}
            style={props.style}
            searchValue={query}
            value={query}
            onChange={setQuery}
        >
            <Input.Search value={query} onChange={onInputChanged} placeholder={`E.g. ${props.example}`} enterButton onSearch={handleSearch} />
        </AutoComplete>
    );
};

export default SearchBox;