import { Button, Select } from 'antd';
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { categories, Category } from '../../category';
import SearchBox from './searchBox';
import { useNavigate } from 'react-router-dom';

const DEFAULT_CATEGORY_NAME = 'Taxonomy' // TODO: Could be retrieved dynamically somehow

const SearchBar: React.FC<{}> = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [chosenCategory, setChosenCategory] = useState<string>(DEFAULT_CATEGORY_NAME);

    const onSearch = (query: string): void => {
        navigate(`/search?query=${query}&category=${chosenCategory}`, { replace: true });
    };

    async function onRandomItem(): Promise<void> {
        const randomItemId = await categories[chosenCategory].getRandomId();
        navigateToItemPage(randomItemId);
    }

    function navigateToItemPage(itemId: number) {
        navigate(`/${chosenCategory.toLowerCase()}/${itemId}`);
    }

    return (
        <div className={classes.searchRow}>
            <Select
                defaultValue={chosenCategory}
                dropdownMatchSelectWidth={false}
                onSelect={setChosenCategory}
                style={{ flex: 0.1 }}
            >
                {Object.keys(categories).map(categoryName => (
                    <Select.Option key={categoryName} value={categoryName}>{categoryName}</Select.Option>
                ))}
            </Select>
            <div style={{ flex: 0.01 }}></div>
            <SearchBox
                style={{ flex: 0.3 }} onSearch={onSearch} example={categories[chosenCategory].example}
                queryFunction={categories[chosenCategory].getEntities} onSelected={navigateToItemPage} />
            <div style={{ flex: 0.02 }}></div>
            <Button type='dashed' onClick={onRandomItem}>Random</Button>
        </div>
    );
};

const useStyles = createUseStyles({
    searchRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    }
});

export default SearchBar;