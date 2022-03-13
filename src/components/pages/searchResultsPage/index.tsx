import React, { useEffect, useState } from 'react';
import { Pagination, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { createUseStyles } from 'react-jss';
import { Entity } from '../../../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { categories, Category } from '../../../category';
import ResultCard from './resultCard';

const PAGE_SIZE = 6;
const ANIMATION_DURATION_IN_MS = 200;

type SearchResults = {
    query: string,
    category: Category,
    totalItems: number;
    pages: {
        [pageNumber: number]: { unmounting: boolean, entity: Entity }[];
    },
    currentPageNumber: number
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
        currentPageNumber: 1
    });
    const [loadingResults, setLoadingResults] = useState<boolean>(true);

    useEffect(() => {
        setLoadingResults(true);
        (async () => {
            const params = new URLSearchParams(location.search);
            const query = params.get('query') ?? ''
            const category = categories[params.get('category') ?? 'Taxonomy'];
            const entities = await category.getEntities(query, PAGE_SIZE);
            const totalItems = await category.getQueryResultSize(query);
            const newSearchResults = {
                query: query,
                category: category,
                totalItems: totalItems,
                pages: {
                    1: entities.map(entity => ({ unmounting: false, entity: entity })),
                },
                currentPageNumber: 1
            };
            setSearchResults(newSearchResults);
            setLoadingResults(false);
        })();
    }, [location]);

    function navigateToItemPage(itemId: string) {
        navigate(`/${searchResults.category.name.toLowerCase()}/${itemId}`);
    }

    const handleResultsUnmounting = (nextPageNumber: number, newSearchResults?: SearchResults) => {
        const getPage = (unmounting: boolean, pageNumber: number) => (
            searchResults.pages[pageNumber].map(pageContent =>
                ({ unmounting: unmounting, entity: pageContent.entity }))
        );
        setSearchResults({
            ...searchResults,
            pages: {
                ...searchResults.pages,
                [searchResults.currentPageNumber]: getPage(true, searchResults.currentPageNumber)
            }
        });
        setTimeout(() => {
            setSearchResults({
                ...(newSearchResults ? newSearchResults : searchResults),
                currentPageNumber: nextPageNumber
            });
        }, ANIMATION_DURATION_IN_MS);
    }

    const handlePageChange = (pageNumber: number, pageSize: number) => {
        setLoadingResults(true);
        if (pageNumber in searchResults.pages) {
            handleResultsUnmounting(pageNumber);
        } else {
            searchResults.category.getEntities(searchResults.query, pageSize, (pageNumber - 1) * PAGE_SIZE).then(entities => {
                const newSearchResults = {
                    ...searchResults,
                    pages: {
                        ...searchResults.pages,
                        [pageNumber]: entities.map(entity => ({ unmounting: false, entity: entity }))
                    }
                }
                handleResultsUnmounting(pageNumber, newSearchResults);
            });
        }
        setLoadingResults(false);
    };

    return (
        <div className={classes.pageContainer}>
            <div className={classes.searchResultItemsContainer}>
                {loadingResults ?
                    <div className={classes.loadingSpinnerContainer}>
                        <Spin delay={ANIMATION_DURATION_IN_MS} indicator={<LoadingOutlined />} size={'large'} />
                    </div> :
                    searchResults && searchResults.pages[searchResults.currentPageNumber].map(pageContent => (
                        <ResultCard key={pageContent.entity.id} entity={pageContent.entity} pageSize={PAGE_SIZE} unmounting={pageContent.unmounting}
                            animationDurationInMs={ANIMATION_DURATION_IN_MS} onClick={navigateToItemPage} categoryName={searchResults.category.name} />)
                    )
                }
            </div>
            <Pagination className={classes.pages} current={searchResults.currentPageNumber} showSizeChanger={false}
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
    loadingSpinnerContainer: {
        display: 'flex',
        alignItems: 'center',
        height: '100%'
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
        flexGrow: 1,
        ...Object.assign({}, ...[...Array(PAGE_SIZE).keys()].map(i => {
            return {
                [`& > :nth-child(${i + 1})`]: {
                    'animation-delay': `${i * 15}ms`
                }
            }
        })),
    },
    pages: {
        marginTop: '2%'
    }
});

export default SearchResultsPage;