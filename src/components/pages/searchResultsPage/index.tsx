import React, { useEffect, useState } from 'react';
import { Card, Pagination, Select, Skeleton, Typography } from 'antd';
import { createUseStyles } from 'react-jss';
import { Protein, Entity, Taxonomy } from '../../../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { categories, Category, TaxonomyCategory } from '../../../category';

const PAGE_SIZE = 6;

type SearchResults = {
    query: string,
    category: Category,
    totalItems: number;
    pages: {
        [pageNumber: number]: Entity[];
    }
}

const SearchResultsPage: React.FunctionComponent<{}> = () => {
    const classes = useStyles();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState<SearchResults>({
        query: '',
        category: categories.Taxonomy,
        totalItems: 0,
        pages: {},
    });
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
    const [loadingResults, setLoadingResults] = useState<boolean>(true);

    useEffect(() => {
        setLoadingResults(true);
        setCurrentPageNumber(1);
        (async () => {
            const params = new URLSearchParams(location.search);
            const query = params.get('query') ?? ''
            const category = categories[params.get('category') ?? 'Taxonomy'];
            const entities = await category.getEntities(query, PAGE_SIZE);
            const totalItems = await category.getQueryResultSize(query);
            setSearchResults({
                query: query,
                category: category,
                totalItems: totalItems,
                pages: {
                    1: entities
                }
            });
            setLoadingResults(false);
        })();
    }, [location]);

    function navigateToItemPage(itemId: number) {
        navigate(`/${searchResults.category.name.toLowerCase()}/${itemId}`);
    }

    const handlePageChange = (page: number, pageSize: number) => {
        setLoadingResults(true);
        if (page in searchResults.pages) {
            setCurrentPageNumber(page);
        } else {
            searchResults.category.getEntities(searchResults.query, pageSize, (page - 1) * PAGE_SIZE).then(entities => {
                setSearchResults({
                    ...searchResults,
                    pages: {
                        ...searchResults.pages,
                        [page]: entities
                    }
                });
                setCurrentPageNumber(page);
            });
        }
        setLoadingResults(false);
    };


    return (
        <div className={classes.pageContainer}>
            <div className={classes.searchResultItemsContainer}>
                {loadingResults ? Array.from(Array(PAGE_SIZE)).map(i => <Skeleton key={i} active={true} paragraph={{ rows: 1 }} className={classes.searchResultItem} />) :
                    searchResults && (searchResults.category instanceof TaxonomyCategory ?
                        (searchResults.pages[currentPageNumber] as Taxonomy[]).map((taxonomy: Taxonomy) => {
                            const lineage = taxonomy.lineage.join(' / ');
                            return (
                                <Card key={taxonomy.id} hoverable className={classes.searchResultItem}
                                    onClick={() => { navigateToItemPage(taxonomy.id) }}>
                                    <Typography.Paragraph ellipsis={{ tooltip: lineage, rows: 2 }} type='secondary'>
                                        <Typography.Text strong>{taxonomy.name} &#183; </Typography.Text>
                                        {lineage}
                                    </Typography.Paragraph>
                                </Card>
                            );
                        })
                        :
                        (searchResults.pages[currentPageNumber] as Protein[]).map((protein: Protein) => (
                            <Card />
                        ))
                    )}
            </div>
            <Pagination className={classes.pages} current={currentPageNumber} showSizeChanger={false}
                defaultCurrent={1} defaultPageSize={PAGE_SIZE} hideOnSinglePage responsive
                total={searchResults?.totalItems} onChange={handlePageChange} />
        </div>
    );
}

const useStyles = createUseStyles({
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '87%',
    },
    searchResultItemsContainer: {
        display: 'flex',
        marginTop: '2%',
        width: '100%',
        height: '86%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexBasis: 0,
        flexGrow: 1
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
        marginTop: '2%'
    }
});

export default SearchResultsPage;