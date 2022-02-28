import { Taxonomy } from './models';

export async function queryTaxonomies(query: string, limit: number=20, offset: number=0): Promise<Taxonomy[]> {
    const response = await fetch(`https://www.uniprot.org/taxonomy/?query=${query}&sort=score&format=tab&limit=${limit}&offset=${offset}`);
    const responseText = await response.text();
    let lines = responseText.split('\n');
    lines.shift(); // First line is header
    lines.pop(); // Last line is empty string
    return lines.map(line => {
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

export async function queryProteins(query: string, limit: number=20, offset: number=0): Promise<Taxonomy[]> {
    return [];
}