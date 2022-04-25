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
    title: React.ReactNode;
    panels: Panel[]
}

const LoadingItemPage: React.FC<{}> = () => {
    const classes = useStyles();

    return <div className={classes.pageContainer}><Spin delay={500} indicator={<LoadingOutlined />} size={'large'} /></div>;
}

const ItemPage: React.FC<ItemPageProps> = (props) => {
    const classes = useStyles();

    const withFailedTooltip = (element: React.ReactNode): React.ReactNode => (
        <Tooltip title='Data for this section is missing'>{element}</Tooltip>
    )

    const renderPanelIcon = (isComponentNull: boolean, isFailed: boolean) => {
        if (isFailed) return withFailedTooltip(<StopOutlined />);
        if (isComponentNull) return <Spin delay={200} indicator={<LoadingOutlined />} size={'small'} />;
        return <></>;
    }

    const isPanelDisabled = (panel: Panel) => panel.failed || panel.component === null;

    const sortPanelsByFailed = (panel1: Panel, panel2: Panel): number => {
        if (panel1.failed === panel2.failed) return 0;
        if (panel1.failed) return 1;
        return -1;
    }

    return <div className={classes.pageContainer}>
        <Typography.Title level={3}>{props.title}</Typography.Title>
        <Collapse defaultActiveKey={['1']} style={{ width: '80%' }}>
            {props.panels.sort(sortPanelsByFailed).map((panel, index) => (
                <Collapse.Panel
                    extra={renderPanelIcon(panel.component === null, panel.failed === true)}
                    collapsible={isPanelDisabled(panel) ? 'disabled' : 'header'}
                    showArrow={!panel.failed}
                    forceRender={panel.forceRender}
                    header={panel.failed ? withFailedTooltip(panel.title) : panel.title}
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