import { Button, Popover, Typography } from 'antd';
import Tree from 'react-d3-tree';
import React, { useState } from 'react';
import { CustomNodeElementProps, RawNodeDatum } from 'react-d3-tree/lib/types/common';
import { createUseStyles } from 'react-jss';
import { Lineage } from '../../../types';

type LineageTreeProps = {
    lineage: Lineage;
    style?: {};
    loadChildren: (nodeId: number) => Promise<void>;
    hideChildren: (nodeId: number) => Promise<void>;
    goToTaxonomyPage: (nodeId: number) => Promise<void>;
}

const LineageTree: React.FC<LineageTreeProps> = (props: LineageTreeProps) => {
    const classes = useStyles();
    const [popoverVisibility, setPopoverVisibility] = useState<{ [nodeId: number]: boolean }>({});

    const renderPopoverMenu = (node: RawNodeDatum) => {
        if (!node.attributes || !node.attributes.id) return <>  </>;
        const nodeId = parseInt(node.attributes.id.toString());
        const hidePopover = () => setPopoverVisibility({ ...popoverVisibility, [nodeId]: false });
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Button type='dashed' onClick={() => {
                    props.loadChildren(nodeId);
                    hidePopover();
                }}>Load Children</Button>
                <Button type='dashed' onClick={() => {
                    props.hideChildren(nodeId);
                    hidePopover();
                }}>Hide Children</Button>
                <Button type='dashed' onClick={() => {
                    hidePopover();
                    props.goToTaxonomyPage(nodeId);
                }}>Go To Page</Button>
            </div>
        );
    };

    return (
        props.lineage ?
            <div style={props.style}>
                <Tree
                    data={props.lineage}
                    orientation={'vertical'}
                    hasInteractiveNodes
                    separation={{ siblings: 1.5, nonSiblings: 1.5 }}
                    renderCustomNodeElement={(node: CustomNodeElementProps) => {
                        if (!node.nodeDatum.attributes || !node.nodeDatum.attributes.id) return <>  </>;
                        const nodeId = parseInt(node.nodeDatum.attributes.id.toString());
                        return (
                            <>
                                <foreignObject width={200} height={50} x={-25} y={-25}>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Popover
                                            content={renderPopoverMenu(node.nodeDatum)}
                                            trigger='click'
                                            visible={popoverVisibility[nodeId]}
                                            onVisibleChange={(visible) => setPopoverVisibility({ ...popoverVisibility, [nodeId]: visible })}
                                        >
                                            <div className={classes.lineageTreeNode}></div>
                                        </Popover>
                                        <Typography.Text strong style={{ width: '140px', marginLeft: '10px' }} ellipsis={{ tooltip: node.nodeDatum.name }}>
                                            {node.nodeDatum.name}
                                        </Typography.Text>
                                    </div>
                                </foreignObject>
                            </>
                        )
                    }}
                />
            </div > :
            <div>loading</div>
    );
};

const useStyles = createUseStyles({
    lineageTreeNode: {
        width: '50px',
        height: '50px',
        borderRadius: '25px',
        backgroundColor: '#1890ff',
        border: '2px solid black',
    }
});

export default LineageTree;