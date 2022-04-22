import { Typography } from 'antd';
import React from 'react';

type Props = {
    name: string,
    value: React.ReactNode,
    href?: string,
    extraNameProps?: {},
    extraValueProps?: {}
    isLink?: boolean
}

const DetailsPanelItem: React.FC<Props> = (props) => (
    <div style={{ display: 'flex', 'flexDirection': 'row', 'marginTop': '.5%' }}>
        <Typography.Text {...props.extraNameProps} disabled={!props.value} strong>{props.name}: </Typography.Text>
        <div style={{ width: '0.5%' }}></div>
        {props.value instanceof String ?
            (props.isLink ?
                <Typography.Link {...props.extraValueProps} disabled={!props.value} italic={!props.value}>{props.value || 'No data available'}</Typography.Link> :
                <Typography.Text {...props.extraValueProps} disabled={!props.value} italic={!props.value}>{props.value || 'No data available'}</Typography.Text>
            ) :
            props.value
        }
    </div>
);

export default DetailsPanelItem;