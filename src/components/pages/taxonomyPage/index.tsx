import React, { useEffect, useState } from 'react';
import { Collapse, Spin, Typography } from 'antd';
import Tree from 'react-d3-tree';
import { LoadingOutlined } from '@ant-design/icons';
import { createUseStyles } from 'react-jss';
import { useParams } from 'react-router-dom';
import { getTaxonomy, getTaxonomyLineage, Lineage } from '../../../api';
import { Taxonomy } from '../../../types';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';

const InfoPanelItem: React.FC<{ name: string, value: string, extraNameProps?: {}, extraValueProps?: {} }> = (props) => (
    <Typography.Paragraph>
        <Typography.Text {...props.extraNameProps} disabled={!props.value} strong>{props.name}: </Typography.Text>
        <Typography.Text {...props.extraValueProps} disabled={!props.value} italic={!props.value}>{props.value || 'No data available'}</Typography.Text>
    </Typography.Paragraph>
);

const TaxonomyPage: React.FC<{}> = () => {
    const { id } = useParams();
    const [taxonomy, setTaxonomy] = useState<Taxonomy>();
    const [taxonomyLineage, setTaxonomyLineage] = useState<RawNodeDatum | null>(null);
    const classes = useStyles();
    useEffect(() => {
        if (!id) return;
        getTaxonomy(parseInt(id)).then(taxonomy => {
            setTaxonomy(taxonomy);
        });
    }, [id]);
    useEffect(() => {
        if (!id) return;
        (async () => {
            const lineage = await getTaxonomyLineage(parseInt(id));
            setTaxonomyLineage(lineage);
        })();
    }, [id]);

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
                    {taxonomyLineage ?
                        <Tree data={taxonomyLineage} orientation={'vertical'} /> :
                        <div>loading</div>}
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
        height: '90%',
        overflowY: 'auto',
    }
});

export default TaxonomyPage;