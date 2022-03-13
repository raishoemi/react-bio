import { NotFoundError } from "../errors";
import { Protein } from "../types";
import { Endpoint, getOne, getRandomId, getResultsAmount, queryApi } from "./common";


export async function queryProteins(query: string, limit: number = 20, offset: number = 0): Promise<Protein[]> {
    const lines = await queryApi(query, Endpoint.Protein, limit, offset);
    return lines.map(parseProteinResponse);
}
export async function getProtein(id: string): Promise<Protein> {
    const protein = parseProteinResponse(await getOne(id, Endpoint.Protein));
    if (protein.id !== id) throw new NotFoundError();
    return protein;
}
export async function getRandomProteinId(): Promise<number> {
    return getRandomId(Endpoint.Protein)
}
export async function getProteinResultsAmount(query: string): Promise<number> {
    return getResultsAmount(query, Endpoint.Protein);
}
function parseProteinResponse(response: string): Protein {
    const values = response.split('\t');
    return new Protein(values[0], values[1]);
}