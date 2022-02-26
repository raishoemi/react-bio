import { AutoComplete, Input, Select, SelectProps } from 'antd';
import React, { useState } from 'react';

const searchCategories = [
    {
        'name': 'Protein',
        'default': true,
    },
    {
        'name': 'Taxonomy',
        'default': false,
    }
]

const SearchPage: React.FunctionComponent<{}> = () => {
    const [options, setOptions] = useState<SelectProps<object>['options']>([]);

    const handleSearch = (value: string) => {
        setOptions([]);
    };

    const onSelect = (value: string) => {
        console.log('onSelect', value);
    };
    
    const defaultOption = searchCategories.find(category => category.default);
    if (!defaultOption) {
        throw new Error('No default search category found');
    }

    return (
        <div>
            <Select style={{width: '10%'}} defaultValue={defaultOption.name}>
                {searchCategories.map(category => (
                    <Select key={category.name} value={category.name}>{category.name}</Select>
                ))}
            </Select>
            <AutoComplete
                dropdownMatchSelectWidth={252}
                style={{ width: 300 }}
                options={options}
                onSelect={onSelect}
                onSearch={handleSearch}
                >
                <Input.Search size="large" placeholder="input here" enterButton />
            </AutoComplete>
        </div>
    )
}

export default SearchPage;