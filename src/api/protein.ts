import { NotFoundError } from "../errors";
import { Protein, ProteinEvidence } from "../types";
import { getOne, getRandomId, getResultsAmount, queryApi } from "./common";

const PROTEIN_QUERY_ENDPOINT = 'uniprot';

const proteinEvidence: { [key: string]: ProteinEvidence } = {
    'Evidence at protein level': ProteinEvidence.ProteinLevelEvidence,
    'Evidence at transcript level': ProteinEvidence.TranscriptLevelEvidence,
    'Inferred from homology': ProteinEvidence.InferredFromHomology,
    'Predicted': ProteinEvidence.Predicted
}

const proteinQueryColumns = [
    'id',
    'protein names',
    'reviwed',
    'existence',
    'genes(PREFERRED)',
    'genes(ALTERNATIVE)',
    'genes(ORF)',
    'organism',
    'organism-id',
    'proteome',
    'sequence',
    'length'
]

export async function queryProteins(query: string, limit: number = 20, offset: number = 0): Promise<Protein[]> {
    const lines = await queryApi(query, PROTEIN_QUERY_ENDPOINT, limit, offset, proteinQueryColumns);
    return lines.map(parseProteinQueryResponse);
}

export async function getProtein(id: string): Promise<Protein> {
    const protein = await parseProteinQueryResponse(await getOne(id, PROTEIN_QUERY_ENDPOINT));
    if (protein.id !== id) throw new NotFoundError();
    return protein;
}

export async function getRandomProteinId(): Promise<number> {
    return getRandomId(PROTEIN_QUERY_ENDPOINT)
}

export async function getProteinResultsAmount(query: string): Promise<number> {
    return getResultsAmount(query, PROTEIN_QUERY_ENDPOINT);
}

function parseProteinQueryResponse(line: string): Protein {
    const [id, proteinNames, reviewed, existence, preferredGeneName, alternativeGeneNames,
        orfNames, organismName, organismId, proteome, sequence, sequenceLength] = line.split('\t');
    return new Protein(
        id,
        proteinNames.split('(')[0].trim(),
        reviewed === 'reviewed',
        proteinEvidence[existence] ?? ProteinEvidence.Uncertain,
        {
            primaryName: preferredGeneName,
            alternativeNames: alternativeGeneNames.split(' '),
            orfNames: orfNames.split(' ')
        },
        {
            name: organismName,
            id: organismId
        },
        sequence,
        parseInt(sequenceLength),
        {
            id: proteome.split(' ')[0],
            chromosome: proteome.substring(proteome.indexOf(' ') + 1)
        }
    );
}
