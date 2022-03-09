import React from 'react';
import { createUseStyles } from 'react-jss';
import { Card, Typography } from 'antd';
import { Entity, Taxonomy } from '../../../types';
import { CategoryName } from '../../../category';

type ResultCardProps = {
    entity: Entity,
    onClick: (id: number) => void,
    pageSize: number,
    categoryName: CategoryName,
    animationDurationInMs: number,
    unmounting: boolean,
}

const ResultCard: React.FC<ResultCardProps> = (props) => {
    const classes = useStyles(props);

    if (props.categoryName === CategoryName.Taxonomy) {
        const taxonomy = props.entity as Taxonomy;
        const lineage = taxonomy.lineage.join(' / ');
        const animationClassName = props.unmounting ? classes.unmountingAnimation : classes.mountingAnimation;
        return (<Card hoverable onClick={() => props.onClick(taxonomy.id)}
            className={classes.searchResultItem + ` ${animationClassName}`}>
            <Typography.Paragraph ellipsis={{ tooltip: lineage, rows: 2 }} type='secondary'>
                <Typography.Text strong>{taxonomy.name} &#183; </Typography.Text>
                {lineage}
            </Typography.Paragraph>
        </Card>);
    }
    return (<div></div>);
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