import { Protein, Taxonomy } from './types';

enum Endpoint {
    Taxonomy = 'taxonomy',
    Protein = 'uniprot'
}

export async function queryTaxonomies(query: string, limit: number = 20, offset: number = 0): Promise<Taxonomy[]> {
    const lines = await queryApi(query, Endpoint.Taxonomy, limit, offset);
    return lines.map(parseTaxonomyResponse);
}
export async function queryProteins(query: string, limit: number = 20, offset: number = 0): Promise<Protein[]> {
    const lines = await queryApi(query, Endpoint.Protein, limit, offset);
    return lines.map(parseProteinResponse);
}

export async function getTaxonomy(id: number): Promise<Taxonomy> {
    return parseTaxonomyResponse(await getOne(id, Endpoint.Taxonomy));
}
export async function getProtein(id: number): Promise<Protein> {
    return parseProteinResponse(await getOne(id, Endpoint.Taxonomy));
}

export async function getRandomTaxonomyId(): Promise<number> {
    return getRandomId(Endpoint.Taxonomy)
}

export async function getRandomProteinId(): Promise<number> {
    return getRandomId(Endpoint.Protein)
}

export async function getTaxonomyResultsAmount(query: string): Promise<number> {
    return getResultsAmount(query, Endpoint.Taxonomy);
}
export async function getProteinResultsAmount(query: string): Promise<number> {
    return getResultsAmount(query, Endpoint.Protein);
}

function parseTaxonomyResponse(response: string): Taxonomy {
    const values = response.split('\t');
    return new Taxonomy(parseInt(values[0]), values[1], values[2], values[3],
        values[7], values[8].split(';'), parseInt(values[9]));
}
function parseProteinResponse(response: string): Protein {
    const values = response.split('\t');
    return new Protein(parseInt(values[0]), values[1]);
}

async function getResultsAmount(query: string, endpoint: Endpoint): Promise<number> {
    const CHUNKS_SIZE = 50000;
    let total = 0;
    let currentChinkSize = CHUNKS_SIZE; // First chunk size, to enter the while loop
    let chunksAmount = 0;
    while (currentChinkSize === CHUNKS_SIZE) {
        const response = await fetch(`https://www.uniprot.org/${endpoint}/?query=${query}&sort=score&format=list&limit=${CHUNKS_SIZE}&offset=${chunksAmount * CHUNKS_SIZE}`);
        currentChinkSize = (await response.text()).split('\n').length - 1;
        chunksAmount += 1;
        total += currentChinkSize;
    }
    return total;
}

async function queryApi(query: string, endpoint: Endpoint, limit: number = 20, offset: number = 0): Promise<string[]> {
    const response = await fetch(`https://www.uniprot.org/${endpoint}/?query=${query}&sort=score&format=tab&limit=${limit}&offset=${offset}`);
    const responseText = await response.text();
    let lines = responseText.split('\n');
    lines.shift(); // First line is header
    lines.pop(); // Last line is empty string
    return lines;
}

async function getOne(id: number, endpoint: Endpoint): Promise<string> {
    const response = await fetch(`https://www.uniprot.org/taxonomy/?query=${id}&format=tab`);
    const responseText = await response.text();
    return responseText.split('\n')[1];
}

async function getRandomId(endpoint: Endpoint): Promise<number> {
    const response = await fetch(`https://www.uniprot.org/${endpoint}/?random=yes`);
    return parseInt(response.url.split('/').slice(-1)[0]);
}
