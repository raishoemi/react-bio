import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProtein } from '../../../api/protein';
import { Protein } from '../../../types';
import { ItemPage, LoadingItemPage } from '../itemPage';


const ProteinPage: React.FC<{}> = () => {
    const { id } = useParams();
    const [protein, setProtein] = useState<Protein>();

    useEffect(() => {
        if (!id) return;
        getProtein(id).then(protein => {
            setProtein(protein);
        });
    }, [id]);

    if (!protein) return <LoadingItemPage />;

    return (
        <ItemPage title={protein.name} panels={[
        ]} />
    );
}

export default ProteinPage;