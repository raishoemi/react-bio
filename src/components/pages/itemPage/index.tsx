import { LoadingOutlined, StopOutlined } from '@ant-design/icons';
import { Collapse, Spin, Tooltip, Typography } from 'antd';
import React from 'react';
import { createUseStyles } from 'react-jss';

type Panel = {
    title: string,
    component: React.ReactNode,
    forceRender: boolean,
    failed?: boolean
}

type ItemPageProps = {
    title: string;
    panels: Panel[]
}

const LoadingItemPage: React.FC<{}> = () => {
    const classes = useStyles();

    return <div className={classes.pageContainer}><Spin delay={500} indicator={<LoadingOutlined />} size={'large'} /></div>;
}

const ItemPage: React.FC<ItemPageProps> = (props) => {
    const classes = useStyles();

    const renderPanelIcon = (isComponentNull: boolean, isFailed: boolean) => {
        if (isFailed) return <Tooltip title='Data for this section is missing'><StopOutlined /></Tooltip>;
        if (isComponentNull) return <Spin delay={200} indicator={<LoadingOutlined />} size={'small'} />;
        return <></>;
    }

    const isPanelDisabled = (panel: Panel) => panel.failed || panel.component === null;

    return <div className={classes.pageContainer}>
        <Typography.Title level={3}>{props.title}</Typography.Title>
        <Collapse defaultActiveKey={['1']} style={{ width: '80%' }}>
            {props.panels.map((panel, index) => (
                <Collapse.Panel
                    extra={renderPanelIcon(panel.component === null, panel.failed === true)}
                    collapsible={isPanelDisabled(panel) ? 'disabled' : 'header'}
                    showArrow={!isPanelDisabled(panel)}
                    forceRender={panel.forceRender}
                    header={panel.title}
                    key={(index + 1).toString()}
                >
                    {panel.component}
                </Collapse.Panel>
            ))}
        </Collapse>
    </div >;
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