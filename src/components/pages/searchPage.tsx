import { Select } from 'antd';
import React from 'react';

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
    const defaultOption = searchCategories.find(category => category.default);
    if (!defaultOption) {
        throw new Error('No default search category found');
    }

    return (
        <Select style={{width: '10%'}} defaultValue={defaultOption.name}>
            {searchCategories.map(category => (
                <Select key={category.name} value={category.name}>{category.name}</Select>
            ))}
        </Select>
    )
}

export default SearchPage;