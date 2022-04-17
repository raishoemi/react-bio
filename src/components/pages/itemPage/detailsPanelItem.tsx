import { Typography } from 'antd';
import React from 'react';

type Props = {
    name: string,
    value: string,
    href?: string,
    extraNameProps?: {},
    extraValueProps?: {}
}

const DetailsPanelItem: React.FC<Props> = (props) => (
    <Typography.Paragraph>
        <Typography.Text {...props.extraNameProps} disabled={!props.value} strong>{props.name}: </Typography.Text>
        <Typography.Text {...props.extraValueProps} disabled={!props.value} italic={!props.value}>{props.value || 'No data available'}</Typography.Text>
    </Typography.Paragraph>
);

export default DetailsPanelItem;