import { NotFoundError } from "../errors";

export async function getResultsAmount(query: string, endpoint: string): Promise<number> {
    const response = await fetch(`https://www.uniprot.org/${endpoint}/?query=${query}&format=list&limit=1`);
    const resultsAmount = response.headers.get('x-total-results')
    if (!response.ok || resultsAmount === null) {
        throw new Error('Failed to get results amount');
    }
    return parseInt(resultsAmount);
}

export async function queryApi(query: string, endpoint: string, limit: number = 20, offset: number = 0, columns: string[] = []): Promise<string[]> {
    let requestUrl = `https://www.uniprot.org/${endpoint}/?query=${query}&sort=score&format=tab&limit=${limit}&offset=${offset}`;
    if (columns.length !== 0) {
        requestUrl += `&columns=${columns.join(',')}`
    }
    const response = await fetch(requestUrl);
    const responseText = await response.text();
    let lines = responseText.split('\n');
    lines.shift(); // First line is header
    lines.pop(); // Last line is empty string
    return lines;
}

export async function getOne(id: string, endpoint: string, columns: string[] = []): Promise<string> {
    let requestUrl = `https://www.uniprot.org/${endpoint}/?query=${id}&format=tab&sort=score`;
    if (columns.length !== 0) {
        requestUrl += `&columns=${columns.join(',')}`
    }
    const response = await fetch(requestUrl);
    const responseText = await response.text();
    const lines = responseText.split('\n')
    if (lines.length === 1) throw new NotFoundError();
    return lines[1];
}

export async function getRandomId(endpoint: string): Promise<string> {
    const response = await fetch(`https://www.uniprot.org/${endpoint}/?random=yes`);
    return response.url.split('/').slice(-1)[0];
}
