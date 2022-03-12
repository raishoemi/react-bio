import { Entity, Protein, Taxonomy } from './types';

enum Endpoint {
    Taxonomy = 'taxonomy',
    Protein = 'uniprot'
}

export class NotFoundError extends Error { }

export interface Lineage {
    name: string;
    attributes: {
        id: number;
    }
    children: Lineage[] | undefined;
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
    const taxonomy = await parseTaxonomyResponse(await getOne(id, Endpoint.Taxonomy));
    if (taxonomy.id !== id) throw new NotFoundError();
    return taxonomy;
}
export async function getProtein(id: number): Promise<Protein> {
    const protein = parseProteinResponse(await getOne(id, Endpoint.Taxonomy));
    if (protein.id !== id) throw new NotFoundError();
    return protein;
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

export async function getTaxonomyLineage(id: number): Promise<Lineage> {
    const ancestoryResponse = await fetch(`https://www.ebi.ac.uk/proteins/api/taxonomy/lineage/${id}`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    const childrenResponse = await fetch(`https://www.ebi.ac.uk/proteins/api/taxonomy/id/${id}/children?pageNumber=1&pageSize=100`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    if (!ancestoryResponse.ok || !childrenResponse.ok) {
        throw new NotFoundError();
    }
    // Parse lineage response into Lineage object
    let ancestoryResponseData: any[] = (await ancestoryResponse.json())['taxonomies'];
    const ancestory: Entity[] = ancestoryResponseData.map((_: any) => ({ id: _.taxonomyId, name: _.scientificName }));
    const taxonomy = ancestory.shift();
    if (!taxonomy) throw new NotFoundError();
    ancestory.pop(); // last element is empty
    const root = ancestory.pop() ?? taxonomy;
    ancestory.reverse();
    const lineage: Lineage = {
        name: root.name,
        attributes: {
            id: root.id,
        },
        children: undefined
    }
    let currentLineage = lineage;
    ancestory.forEach(ancestor => {
        currentLineage.children = [{
            name: ancestor.name,
            attributes: {
                id: ancestor.id
            },
            children: undefined
        }];
        currentLineage = currentLineage.children[0];
    });

    // Insert children at the last lineage node
    let childrenResponseData = await childrenResponse.json();
    const children: Entity[] = childrenResponseData['taxonomies'].map((_: any) => ({ id: _.taxonomyId, name: _.scientificName }));
    currentLineage.children = children.map((_: Entity) => ({ attributes: { id: _.id }, name: _.name, children: undefined }));
    return lineage;
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
    const response = await fetch(`https://www.uniprot.org/taxonomy/?query=${id}&format=tab&sort=score`);
    const responseText = await response.text();
    const lines = responseText.split('\n')
    if (lines.length === 1) throw new NotFoundError();
    return lines[1];
}

async function getRandomId(endpoint: Endpoint): Promise<number> {
    const response = await fetch(`https://www.uniprot.org/${endpoint}/?random=yes`);
    return parseInt(response.url.split('/').slice(-1)[0]);
}
