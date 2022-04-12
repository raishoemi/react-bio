import { LoadingOutlined } from '@ant-design/icons';
import { Collapse, Spin, Typography } from 'antd';
import React from 'react';
import { createUseStyles } from 'react-jss';

type ItemPageProps = {
    title: string;
    panels: {
        title: string,
        component: React.ReactNode,
        forceRender: boolean
    }[]
}

const LoadingItemPage: React.FC<{}> = () => {
    const classes = useStyles();

    return <div className={classes.pageContainer}><Spin delay={500} indicator={<LoadingOutlined />} size={'large'} /></div>;
}

const ItemPage: React.FC<ItemPageProps> = (props) => {
    const classes = useStyles();

    return <div className={classes.pageContainer}>
        <Typography.Title level={3}>{props.title}</Typography.Title>
        <Collapse defaultActiveKey={['1']} style={{ width: '80%' }}>
            {props.panels.map((panel, index) => (
                <Collapse.Panel forceRender={panel.forceRender} header={panel.title} key={(index + 1).toString()}>
                    {panel.component}
                </Collapse.Panel>
            ))}
        </Collapse>
    </div>;
};

const useStyles = createUseStyles({
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '3%',
        height: '83%',
        overflowY: 'auto',
    },
});

export { ItemPage, LoadingItemPage };