import { Taxonomy } from './types';

export async function queryTaxonomies(query: string, limit: number = 20, offset: number = 0): Promise<Taxonomy[]> {
    const response = await fetch(`https://www.uniprot.org/taxonomy/?query=${query}&sort=score&format=tab&limit=${limit}&offset=${offset}`);
    const responseText = await response.text();
    let lines = responseText.split('\n');
    lines.shift(); // First line is header
    lines.pop(); // Last line is empty string
    return lines.map(parseTaxonomyResponse);
}

export async function getRandomTaxonomyId(): Promise<number> {
    const response = await fetch('https://www.uniprot.org/taxonomy/?random=yes');
    return parseInt(response.url.split('/').slice(-1)[0]);
}

export async function getTaxonomyResultsAmount(query: string): Promise<number> {
    const CHUNKS_SIZE = 50000;
    let total = 0;
    let currentChinkSize = CHUNKS_SIZE; // First chunk size, to enter the while loop
    let chunksAmount = 0;
    while (currentChinkSize === CHUNKS_SIZE) {
        const response = await fetch(`https://www.uniprot.org/taxonomy/?query=${query}&sort=score&format=list&limit=${CHUNKS_SIZE}&offset=${chunksAmount * CHUNKS_SIZE}`);
        currentChinkSize = (await response.text()).split('\n').length;
        chunksAmount += 1;
        total += currentChinkSize;
    }
    return total;
}

export async function queryProteins(query: string, limit: number = 20, offset: number = 0): Promise<Taxonomy[]> {
    return [];
}

function parseTaxonomyResponse(response: string): Taxonomy {
    const values = response.split('\t');
    return new Taxonomy(parseInt(values[0]), values[1], values[2], values[3],
        values[7], values[8].split(';'), parseInt(values[9]));
}