import { Typography } from 'antd';
import React from 'react';


const DetailsPanelItem: React.FC<{ name: string, value: string, extraNameProps?: {}, extraValueProps?: {} }> = (props) => (
    <Typography.Paragraph>
        <Typography.Text {...props.extraNameProps} disabled={!props.value} strong>{props.name}: </Typography.Text>
        <Typography.Text {...props.extraValueProps} disabled={!props.value} italic={!props.value}>{props.value || 'No data available'}</Typography.Text>
    </Typography.Paragraph>
);

export default DetailsPanelItem;