import { Typography } from 'antd';
import React from 'react';
import { Protein } from '../../../../types';

type Props = {
    protein: Protein;
}

const ProteinCard: React.FC<Props> = (props) => {
    const organismName = props.protein.organism.name.scientific || props.protein.organism.name.common;

    return <Typography.Paragraph ellipsis={{ tooltip: organismName, rows: 2 }} type='secondary'>
        <Typography.Text strong>{props.protein.name} &#183; </Typography.Text>
        {organismName}
    </Typography.Paragraph>;

};

export default ProteinCard;