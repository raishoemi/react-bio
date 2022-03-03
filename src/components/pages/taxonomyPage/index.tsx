import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTaxonomy } from '../../../api';
import { Taxonomy } from '../../../types';

const TaxonomyPage: React.FC<{}> = () => {
    const { id } = useParams();
    const [taxonomy, setTaxonomy] = useState<Taxonomy>();
    useEffect(() => {
        if (!id) return;
        getTaxonomy(parseInt(id)).then(taxonomy => {
            setTaxonomy(taxonomy);
        });
    }, [id]);

    if (!id) return <div>ERROR COMPONENT PLACEHOLDER</div>;

    if (!taxonomy) return <div>Loading...</div>;

    return (
        <div>
            <h1>{taxonomy.name}</h1>
            <p>{taxonomy.rank}</p>
        </div>
    );
}

export default TaxonomyPage;