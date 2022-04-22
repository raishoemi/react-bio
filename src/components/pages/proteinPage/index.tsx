import { Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProtein } from '../../../api/protein';
import { Protein } from '../../../types';
import { ItemPage, LoadingItemPage } from '../itemPage';
import DetailsPanelItem from '../itemPage/detailsPanelItem';


const ProteinPage: React.FC<{}> = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [protein, setProtein] = useState<Protein>();

    useEffect(() => {
        if (!id) return;
        getProtein(id).then(protein => {
            setProtein(protein);
        });
    }, [id]);

    if (!protein) return <LoadingItemPage />;

    // TOOD: Show reviewed with checked 
    return (
        <ItemPage title={protein.name} panels={[
            {
                title: 'Details',
                component: <>
                    <DetailsPanelItem extraValueProps={{ copyable: true }} name='Uniprot ID' value={protein.id} />
                    <DetailsPanelItem name='Name' value={protein.name} />
                    <DetailsPanelItem name='Evidence' value={protein.evidence} />
                    <DetailsPanelItem name='Organism' isLink value={protein.taxonomy.name} extraValueProps={{ onClick: () => navigate(`/taxonomy/${protein.taxonomy.id}`) }} />
                    <DetailsPanelItem name='Gene' value={protein.geneName} />
                    <DetailsPanelItem name='Chromosome' value={protein.proteome.chromosome} />
                </>,
                forceRender: true
            },
            {
                title: `Sequence (${protein.sequence.length} aa)`,
                component: <Typography.Paragraph>
                    {protein.sequence}
                </Typography.Paragraph>,
                forceRender: true
            }
        ]} />
    );
}

export default ProteinPage;