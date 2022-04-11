import { CheckCircleOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import React from 'react';
import { Protein } from '../../../../types';

type Props = {
    protein: Protein;
}

const ProteinCard: React.FC<Props> = (props) => {
    return <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '92%' }}>
            <Typography.Paragraph ellipsis={{ tooltip: props.protein.taxonomy.name, rows: 2 }} type='secondary'>
                <Typography.Text strong>{props.protein.name} &#183; </Typography.Text>
                {props.protein.taxonomy.name}
            </Typography.Paragraph>
        </div>
        {
            props.protein.reviewed &&
            <div style={{ display: 'flex', flexDirection: 'column', width: '8%', justifyContent: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: '20px', color: 'green' }} />
            </div>
        }
    </div>;
};

export default ProteinCard;