import { Menu, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useParams } from 'react-router-dom';
import { getTaxonomy } from '../../../api';
import { Taxonomy } from '../../../types';

const TaxonomyPage: React.FC<{}> = () => {
    const { id } = useParams();
    const [taxonomy, setTaxonomy] = useState<Taxonomy>();
    const classes = useStyles();
    useEffect(() => {
        if (!id) return;
        getTaxonomy(parseInt(id)).then(taxonomy => {
            setTaxonomy(taxonomy);
        });
    }, [id]);

    if (!id) return <div>ERROR COMPONENT PLACEHOLDER</div>;

    if (!taxonomy) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: '5%', width: '93%', backgroundColor: 'blue' }}>
            </div>
        </div>
    );
}

const useStyles = createUseStyles({
    pageContainer: {
        marginTop: '5%',
        height: '87%',
        display: 'flex',
        flexDirection: 'column',
    }
});

export default TaxonomyPage;