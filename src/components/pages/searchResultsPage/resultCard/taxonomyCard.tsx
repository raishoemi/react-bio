import { Typography } from 'antd';
import React from 'react';
import { Taxonomy } from '../../../../types';

type Props = {
    taxonomy: Taxonomy;
}

const TaxonomyCard: React.FC<Props> = (props) => {
    const lineage = props.taxonomy.lineage.join(' / ');
    
    return <Typography.Paragraph ellipsis={{ tooltip: lineage, rows: 2 }} type='secondary'>
        <Typography.Text strong>{props.taxonomy.name} &#183; </Typography.Text>
        {lineage}
    </Typography.Paragraph>;
};

export default TaxonomyCard;