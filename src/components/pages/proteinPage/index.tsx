import { Progress, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProtein, getProteinExtraData } from '../../../api/protein';
import { Protein, ProteinEvidence, ProteinExtraData } from '../../../types';
import { ItemPage, LoadingItemPage } from '../itemPage';
import DetailsPanelItem from '../itemPage/detailsPanelItem';


const ProteinPage: React.FC<{}> = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [protein, setProtein] = useState<Protein>();
    const [proteinExtraData, setProteinExtraData] = useState<ProteinExtraData>();

    useEffect(() => {
        if (!id) return;
        getProtein(id).then(protein => {
            setProtein(protein);
        });
        getProteinExtraData(id).then(proteinExtraData => {
            setProteinExtraData(proteinExtraData);
        });
    }, [id]);

    const proteinEvidenceProgress: { [evidence: string]: { color: string, percentage: number } } = {
        [ProteinEvidence.ProteinLevelEvidence]: {
            color: 'green',
            percentage: 100
        },
        [ProteinEvidence.TranscriptLevelEvidence]: {
            color: '#e1e100',
            percentage: 75
        },
        [ProteinEvidence.InferredFromHomology]: {
            color: 'orange',
            percentage: 50
        },
        [ProteinEvidence.Predicted]: {
            color: 'red',
            percentage: 25
        },
        [ProteinEvidence.Uncertain]: {
            color: 'gray',
            percentage: 0
        },
    }

    if (!protein) return <LoadingItemPage />;

    // TOOD: Show reviewed with checked 
    return (
        <ItemPage title={protein.name} panels={[
            {
                title: 'Details',
                component: <>
                    <DetailsPanelItem extraValueProps={{ copyable: true }} name='Uniprot ID' value={protein.id} />
                    <DetailsPanelItem name='Name' value={protein.name} />
                    <DetailsPanelItem name='Evidence' value={<Tooltip title={protein.evidence}>
                        <Progress
                            style={{ width: '10%' }}
                            trailColor={'gray'}
                            showInfo={false}
                            percent={proteinEvidenceProgress[protein.evidence].percentage}
                            strokeColor={proteinEvidenceProgress[protein.evidence].color}
                            size={'small'}
                        />
                    </Tooltip>} />
                    <DetailsPanelItem name='Organism' isLink value={protein.taxonomy.name} extraValueProps={{ onClick: () => navigate(`/taxonomy/${protein.taxonomy.id}`) }} />
                    <DetailsPanelItem name='Gene' value={protein.geneName} />
                    <DetailsPanelItem name='Chromosome' value={protein.proteome.chromosome} />
                </>,
                forceRender: true
            },
            {
                title: 'Function',
                component: proteinExtraData ?
                    <Typography.Paragraph>
                        {proteinExtraData.function}
                    </Typography.Paragraph>
                    :
                    null,
                forceRender: true,
                failed: proteinExtraData?.function === null
            },
            {
                title: `Sequence (${protein.sequence.length} aa)`,
                component: <Typography.Paragraph>
                    {protein.sequence}
                </Typography.Paragraph>,
                forceRender: true
            },
            {
                title: 'Tissue Specificity',
                component: proteinExtraData ?
                    <Typography.Paragraph>
                        {proteinExtraData.tissueSpecifity}
                    </Typography.Paragraph>
                    :
                    null,
                forceRender: true,
                failed: proteinExtraData?.tissueSpecifity === null
            },
            {
                title: 'Developmental Stage',
                component: proteinExtraData ?
                    <Typography.Paragraph>
                        {proteinExtraData.developmentalStage}
                    </Typography.Paragraph>
                    :
                    null,
                forceRender: true,
                failed: proteinExtraData?.developmentalStage === null
            },
            {
                title: 'Induction',
                component: proteinExtraData ?
                    <Typography.Paragraph>
                        {proteinExtraData.induction}
                    </Typography.Paragraph>
                    :
                    null,
                forceRender: true,
                failed: proteinExtraData?.induction === null
            },
        ]} />
    );
}

export default ProteinPage;