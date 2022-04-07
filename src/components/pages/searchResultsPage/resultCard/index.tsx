
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Card } from 'antd';
import { Entity, Protein, Taxonomy } from '../../../../types';
import { CategoryName } from '../../../../category';
import TaxonomyCard from './taxonomyCard';
import ProteinCard from './proteinCard';

type ResultCardProps = {
    entity: Entity,
    onClick: (id: string) => void,
    pageSize: number,
    categoryName: CategoryName,
    animationDurationInMs: number,
    unmounting: boolean,
}

const ResultCard: React.FC<ResultCardProps> = (props) => {
    const classes = useStyles(props);
    const animationClassName = props.unmounting ? classes.unmountingAnimation : classes.mountingAnimation;
    return <Card hoverable onClick={() => props.onClick(props.entity.id)}
        className={classes.searchResultItem + ` ${animationClassName}`}>
        {
            props.categoryName === CategoryName.Taxonomy ?
                <TaxonomyCard taxonomy={props.entity as Taxonomy} />
                : props.categoryName === CategoryName.Protein ?
                    <ProteinCard protein={props.entity as Protein} />
                    :
                    <div>unknown category placeholder</div>
        }
    </Card>;
};

const useStyles = createUseStyles({
    searchResultItem: {
        animationDuration: (props: ResultCardProps) => `${props.animationDurationInMs}ms`,
        animationTimingFunction: 'ease-out',
        animationIterationCount: 1,
        animationFillMode: 'both',
        width: '60%',
        height: (props: ResultCardProps) => `${(100 / props.pageSize) - 3}%`,
        marginTop: '1%',
        border: '1px solid #1890ff54',
        transition: '150ms ease-out',
        '&:hover': {
            border: '3px solid #1890ff54',
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    mountingAnimation: {
        animationName: '$slideIn',
    },
    unmountingAnimation: {
        animationName: '$slideOut',
    },
    '@keyframes slideIn': {
        from: {
            transform: 'translateX(-10%)',
            opacity: 0
        },
        to: {
            transform: 'translateX(0)',
            opacity: 1
        }
    },
    '@keyframes slideOut': {
        from: {
            transform: 'translateX(0)',
            opacity: 1
        },
        to: {
            transform: 'translateX(10%)',
            opacity: 0
        }
    },
});

export default ResultCard;