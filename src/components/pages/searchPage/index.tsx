import React, { useState } from 'react';
import { Button, Card, Pagination, Select } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { createUseStyles } from 'react-jss';
import { getTaxonomyResultsAmount, queryTaxonomies } from '../../../api';
import { Protein, Entity, Taxonomy } from '../../../types';
import { Category, ProteinCategory, SearchResults, TaxonomyCategory } from './types';
import SearchBox from './searchBox';
import { useNavigate } from 'react-router-dom';


const PAGE_SIZE = 6;

const categories: Category[] = [
    new TaxonomyCategory(),
    new ProteinCategory(),
];

const SearchPage: React.FunctionComponent<{}> = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [chosenCategory, setChosenCategory] = useState<Category>(categories[0]);
    const [searchResults, setSearchResults] = useState<SearchResults>();
    const [currentPageItems, setCurrentPageItems] = useState<Entity[]>([]);

    const onCategorySelected = (category: string) => {
        const selectedCategory = categories.find(searchCategory => searchCategory.name === category);
        if (selectedCategory) {
            setChosenCategory(selectedCategory);
        }
    };

    async function onSearch(query: string) {
        const taxonomies = await queryTaxonomies(query, PAGE_SIZE);
        const totalItems = await getTaxonomyResultsAmount(query);
        setSearchResults({ category: chosenCategory, query: query, totalItems: totalItems, pages: { 1: taxonomies } });
        setCurrentPageItems(taxonomies);
    };

    function navigateToItemPage(itemId: number) {
        navigate(`/${chosenCategory.name.toLowerCase()}/${itemId}`);
    }

    const handlePageChange = (page: number, pageSize: number) => {
        if (!searchResults) return;
        if (page in searchResults.pages) {
            setCurrentPageItems(searchResults.pages[page]);
        } else {
            queryTaxonomies(searchResults.query, pageSize, (page - 1) * PAGE_SIZE).then(taxonomies => {
                // searchResults.pages[page] = taxonomies;
                setCurrentPageItems(taxonomies);
            });
        }
    };

    return (
        <div className={classes.pageContainer}>
            <div className={classes.searchRow}>
                <Select
                    defaultValue={chosenCategory.name}
                    dropdownMatchSelectWidth={false}
                    onSelect={onCategorySelected}
                    style={{ flex: 0.1 }}
                >
                    {categories.map(category => (
                        <Select.Option key={category.name} value={category.name}>{category.name}</Select.Option>
                    ))}
                </Select>
                <div style={{ flex: 0.01 }}></div>
                <SearchBox style={{ flex: 0.3 }} onSearch={onSearch} example={chosenCategory.example} queryFunction={chosenCategory.getEntities} onSelected={navigateToItemPage} />
                <div style={{ flex: 0.02 }}></div>
                <Button type='dashed'>Random</Button>
            </div>
            <div className={classes.searchResultItemsContainer}>
                {searchResults && (searchResults.category instanceof TaxonomyCategory ?
                    (currentPageItems as Taxonomy[]).map((taxonomy: Taxonomy) => (
                        <Card key={taxonomy.id} id={taxonomy.id.toString()} hoverable className={classes.searchResultItem}
                            onClick={() => { navigateToItemPage(taxonomy.id) }}>
                            <Meta style={{ marginTop: '-2%' }} title={taxonomy.name} description={taxonomy.lineage.join(' / ')} />
                        </Card>
                    ))
                    :
                    (currentPageItems as Protein[]).map((protein: Protein) => (
                        <Card />
                    ))
                )}
            </div>
            <Pagination showSizeChanger={false} className={classes.pages} defaultCurrent={1} defaultPageSize={PAGE_SIZE} hideOnSinglePage responsive total={searchResults?.totalItems} onChange={handlePageChange} />
        </div>
    );
}

const useStyles = createUseStyles({
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '87%',
        marginTop: '5%'
    },
    searchRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    searchResultItemsContainer: {
        display: 'flex',
        marginTop: '2%',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
    },
    searchResultItem: {
        width: '60%',
        marginTop: '1%',
        height: `${(100 / PAGE_SIZE) - 3}%`,
        border: '1px solid #1890ff54',
        transition: '150ms ease-out',
        '&:hover': {
            border: '3px solid #1890ff54',
        }
    },
    pages: {
        marginTop: '1%'
    }
});

export default SearchPage;