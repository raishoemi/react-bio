import React, { useEffect, useState } from 'react';
import { Button, Collapse, Modal, notification, Spin, Typography } from 'antd';
import { ExpandAltOutlined, LoadingOutlined } from '@ant-design/icons';
import { createUseStyles } from 'react-jss';
import { useNavigate, useParams } from 'react-router-dom';
import { getTaxonomy, getTaxonomyChildren, getTaxonomyLineage } from '../../../api/taxonomy';
import { Lineage, Taxonomy } from '../../../types';
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
    const [isLineageLoading, setLineageLoading] = useState<boolean>(true);
    const [isLineageUnavailable, setLineageUnavailable] = useState<boolean>(false);
    const navigate = useNavigate()
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
            try {
                const lineage: Lineage = await getTaxonomyLineage(id);
                setLineageLoading(false);
                setTaxonomyLineage(lineage);
            } catch (e: any) {
                if (e instanceof NotFoundError) {
                    setLineageUnavailable(true);
                }
            }
        })();
    }, [id]);

    const loadChildren = async (nodeId: number) => {
        if (!taxonomyLineage) return;
        const newTaxonomyLineage = Lineage.fromNode(taxonomyLineage);
        const node = newTaxonomyLineage.getNode(nodeId.toString());
        if (!node) {
            notification.error({
                message: 'System Error',
                description: 'An error occurred trying to load children',
                placement: 'bottomRight',
            })
            return;
        }
        setLineageLoading(true);
        let children: Lineage[] = [];
        try {
            children = await getTaxonomyChildren(nodeId.toString());
        } catch (e: any) {
            if (e instanceof NotFoundError) notification.warn({ message: 'No children found', placement: 'bottomRight' });
        }
        if (node.children) {
            node.children.push(...children.filter(child => !node.children?.some(c => c.attributes.id === child.attributes.id)));
        } else {
            node.children = children;
        }
        setTaxonomyLineage(newTaxonomyLineage);
        setLineageLoading(false);
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

    const navigateToTaxonomyPage = async (nodeId: number) => {
        navigate(`/taxonomy/${nodeId}`);
    }

    if (!id) return <div>NOT FOUND COMPONENT PLACEHOLDER</div>;

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
                    {isLineageUnavailable ?
                        <Typography.Text italic>Lineage tree unavailable for this taxonomy</Typography.Text>
                        :
                        <div className={classes.treePanelContainer}>
                            {taxonomyLineage && <LineageTree lineage={taxonomyLineage} style={{ height: '30vh', width: '100%' }} loadChildren={loadChildren} hideChildren={hideChildren} goToTaxonomyPage={navigateToTaxonomyPage} />}
                            <div>
                                {isLineageLoading && <Spin delay={500} indicator={<LoadingOutlined />} size={'large'} />}
                                <Button icon={<ExpandAltOutlined />} onClick={() => setLineageModalVisible(true)} />
                            </div>
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
                                <div style={{ width: '100%', height: '80vh' }}>
                                    {taxonomyLineage && <LineageTree style={{ width: '100%', height: '100%' }} lineage={taxonomyLineage} loadChildren={loadChildren} hideChildren={hideChildren} goToTaxonomyPage={navigateToTaxonomyPage} />}
                                    <div style={{ position: 'absolute', right: '1%', bottom: '1%' }}>
                                        {isLineageLoading && <Spin delay={500} indicator={<LoadingOutlined />} size={'large'} />}
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    }
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