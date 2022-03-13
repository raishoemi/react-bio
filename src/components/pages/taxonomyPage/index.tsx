import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Button, Collapse, Modal, notification, Popover, Spin, Typography } from 'antd';
import Tree from 'react-d3-tree';
import { ExpandAltOutlined, LoadingOutlined } from '@ant-design/icons';
import { createUseStyles } from 'react-jss';
import { useParams } from 'react-router-dom';
import { getTaxonomy, getTaxonomyChildren, getTaxonomyLineage } from '../../../api/taxonomy';
import { Lineage, Taxonomy } from '../../../types';
import { CustomNodeElementProps, RawNodeDatum, TreeNodeDatum } from 'react-d3-tree/lib/types/common';
import { HierarchyPointNode } from 'd3-hierarchy';
import LineageTree from './lineageTree';
import { NotFoundError } from '../../../errors';

const InfoPanelItem: React.FC<{ name: string, value: string, extraNameProps?: {}, extraValueProps?: {} }> = (props) => (
    <Typography.Paragraph>
        <Typography.Text {...props.extraNameProps} disabled={!props.value} strong>{props.name}: </Typography.Text>
        <Typography.Text {...props.extraValueProps} disabled={!props.value} italic={!props.value}>{props.value || 'No data available'}</Typography.Text>
    </Typography.Paragraph>
);

const TaxonomyPage: React.FC<{}> = () => {
    const { id } = useParams();
    const [taxonomy, setTaxonomy] = useState<Taxonomy>();
    const [taxonomyLineage, setTaxonomyLineage] = useState<Lineage | null>(null);
    const [isLineageModalVisible, setLineageModalVisible] = useState<boolean>(false);
    const classes = useStyles();

    useEffect(() => {
        if (!id) return;
        getTaxonomy(id).then(taxonomy => {
            setTaxonomy(taxonomy);
        });
    }, [id]);

    useEffect(() => {
        if (!id) return;
        (async () => {
            const lineage: Lineage = await getTaxonomyLineage(id);
            setTaxonomyLineage(lineage);
        })();
    }, [id]);

    const loadChildren = async (nodeId: number) => {
        if (!taxonomyLineage) return;
        const newTaxonomyLineage = Lineage.fromNode(taxonomyLineage);
        let children: Lineage[] = [];
        try {
            children = await getTaxonomyChildren(nodeId.toString());
        } catch (e: any) {
            if (e instanceof NotFoundError) notification.warn({ message: 'No children found', placement: 'bottomRight' });
        }
        const node = newTaxonomyLineage.getNode(nodeId.toString());
        if (!node) {
            notification.error({
                message: 'System Error',
                description: 'An error occurred trying to load children',
                placement: 'bottomRight',
            })
            return;
        }
        if (node.children) {
            node.children.push(...children.filter(child => !node.children?.some(c => c.attributes.id === child.attributes.id)));
        } else {
            node.children = children;
        }
        setTaxonomyLineage(newTaxonomyLineage);
    };

    const hideChildren = async (nodeId: number) => {
        if (!taxonomyLineage) return;
        const newTaxonomyLineagee = Lineage.fromNode(taxonomyLineage);
        const node = newTaxonomyLineagee.getNode(nodeId.toString());
        if (!node) {
            notification.error({
                message: 'System Error',
                description: 'An error occurred trying to hiding children',
                placement: 'bottomRight',
            })
            return;
        }
        node.children = []
        setTaxonomyLineage(newTaxonomyLineagee);
    };

    if (!id) return <div>ERROR COMPONENT PLACEHOLDER</div>;

    if (!taxonomy) return <div className={classes.pageContainer}><Spin delay={500} indicator={<LoadingOutlined />} size={'large'} /></div>;

    return (
        <div className={classes.pageContainer}>
            <Typography.Title level={3}>{taxonomy.name}</Typography.Title>
            <Collapse defaultActiveKey={['1']} style={{ width: '80%' }}>
                <Collapse.Panel forceRender header="Details" key="1">
                    <InfoPanelItem extraValueProps={{ copyable: true }} name='Uniprot ID' value={taxonomy.id.toString()} />
                    <InfoPanelItem name='Common Name' value={taxonomy.commonName} />
                    <InfoPanelItem name='Scientific Name' value={taxonomy.scientificName} />
                    <InfoPanelItem name='Mnemonic' value={taxonomy.mnemonic} />
                    <InfoPanelItem name='Rank' value={taxonomy.rank} />
                    <InfoPanelItem name='Lineage' value={taxonomy.lineage.join(' / ')} />
                </Collapse.Panel>
                <Collapse.Panel forceRender header="Tree" key="2">
                    <div className={classes.treePanelContainer}>
                        <LineageTree lineage={taxonomyLineage} style={{ height: '30vh', width: '100%' }} loadChildren={loadChildren} hideChildren={hideChildren} />
                        <Button icon={<ExpandAltOutlined />} onClick={() => setLineageModalVisible(true)} />
                        <Modal
                            visible={isLineageModalVisible}
                            footer={null}
                            onCancel={() => setLineageModalVisible(false)}
                            destroyOnClose
                            centered
                            width={'90vw'}
                            bodyStyle={{ height: '100%' }}
                            className={`ant-modal-content ${classes.lineageModalContainer}`}
                        >
                            <LineageTree lineage={taxonomyLineage} style={{ width: '100%', height: '80vh' }} loadChildren={loadChildren} hideChildren={hideChildren} />
                        </Modal>
                    </div>
                </Collapse.Panel>
            </Collapse>
        </div>
    );
}

const useStyles = createUseStyles({
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '3%',
        height: '83%',
        overflowY: 'auto',
    },
    treePanelContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    lineageModalContainer: {
        height: '80vh'
    },
    lineageTreeNode: {
        width: '50px',
        height: '50px',
        borderRadius: '25px',
        backgroundColor: '#1890ff',
        border: '2px solid black',
    }
});

export default TaxonomyPage;