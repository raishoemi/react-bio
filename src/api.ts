import { Taxonomy } from './models';

export async function getTaxonomies(query: string): Promise<Taxonomy[]> {
    const response = await fetch(`https://www.uniprot.org/taxonomy/?query=${query}&sort=score&format=tab`)
    const responseText = await response.text();
    return responseText.split('\n').map(line => {
        const values = line.split('\t');
        return {
            id: parseInt(values[0]),
            mnemonic: values[1],
            name: {
                common: values[3],
                scientific: values[2]
            },
            rank: values[7],
            lineage: values[8].split(';'),
            parentId: parseInt(values[9])
        }
    })
}