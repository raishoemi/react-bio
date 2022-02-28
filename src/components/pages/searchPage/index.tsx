import React, { useState } from 'react';
import { Button, Select } from 'antd';
import { createUseStyles } from 'react-jss';
import { queryTaxonomies } from '../../../api';
import { Taxonomy } from '../../../models';
import SearchBox from './searchBox';
import { QueryResult, SearchCategory } from './types';


const searchCategories: SearchCategory[] = [
    {
        name: 'Taxonomy',
        inputPlaceholder: 'E.g. Homo Sapien',
        queryFunction: (query: string): Promise<QueryResult[]> => {
            return queryTaxonomies(query).then((taxonomies: Taxonomy[]) => (
                taxonomies.map((taxonomy: Taxonomy) => {
                    return {
                        label: taxonomy.name.scientific,
                        value: taxonomy.id
                    }
                })
            ));
        }
    },
    {
        name: 'Protein',
        inputPlaceholder: 'E.g. PROTEIN NAME',
        queryFunction: (query: string): Promise<QueryResult[]> => {
            return Promise.resolve([]);
        }
    },
]

const SearchPage: React.FunctionComponent<{}> = () => {
    const classes = useStyles();
    const [chosenCategory, setChosenCategory] = useState<SearchCategory>(searchCategories[0]);

    const onCategorySelected = (category: string) => {
        const selectedCategory = searchCategories.find(searchCategory => searchCategory.name === category);
        if (selectedCategory) {
            setChosenCategory(selectedCategory);
        }
    };

    return (
        <div className={classes.searchRow}>
            <Select
                defaultValue={searchCategories[0].name}
                dropdownMatchSelectWidth={false}
                onSelect={onCategorySelected}
                style={{ flex: 0.1 }}
            >
                {searchCategories.map(category => (
                    <Select.Option key={category.name} value={category.name}>{category.name}</Select.Option>
                ))}
            </Select>
            <div style={{ flex: 0.01 }}></div>
            <SearchBox style={{ flex: 0.3 }} onSearch={(v) => { console.log(`onSearch: ${v}`) }} placeholder={chosenCategory.inputPlaceholder} queryFunction={chosenCategory.queryFunction} onSelected={(v) => { console.log(`onSelected: ${v}`) }} />
            <div style={{ flex: 0.02 }}></div>
            <Button type='dashed'>Random</Button>
        </div>
    );
}

const useStyles = createUseStyles({
    searchRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

export default SearchPage;