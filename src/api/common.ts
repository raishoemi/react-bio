import { NotFoundError } from "../errors";

export enum Endpoint {
    Taxonomy = 'taxonomy',
    Protein = 'uniprot'
}

export async function getResultsAmount(query: string, endpoint: Endpoint): Promise<number> {
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

export async function queryApi(query: string, endpoint: Endpoint, limit: number = 20, offset: number = 0): Promise<string[]> {
    const response = await fetch(`https://www.uniprot.org/${endpoint}/?query=${query}&sort=score&format=tab&limit=${limit}&offset=${offset}`);
    const responseText = await response.text();
    let lines = responseText.split('\n');
    lines.shift(); // First line is header
    lines.pop(); // Last line is empty string
    return lines;
}

export async function getOne(id: string, endpoint: Endpoint): Promise<string> {
    const response = await fetch(`https://www.uniprot.org/taxonomy/?query=${id}&format=tab&sort=score`);
    const responseText = await response.text();
    const lines = responseText.split('\n')
    if (lines.length === 1) throw new NotFoundError();
    return lines[1];
}

export async function getRandomId(endpoint: Endpoint): Promise<number> {
    const response = await fetch(`https://www.uniprot.org/${endpoint}/?random=yes`);
    return parseInt(response.url.split('/').slice(-1)[0]);
}
