import { NotFoundError } from "../errors";
import { Protein, ProteinEvidence, ProteinExtraData } from "../types";
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
    'reviewed',
    'existence',
    'genes(PREFERRED)',
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
    const protein = await parseProteinQueryResponse(await getOne(id, PROTEIN_QUERY_ENDPOINT, proteinQueryColumns));
    if (protein.id !== id) throw new NotFoundError();
    return protein;
}

export async function getRandomProteinId(): Promise<string> {
    return getRandomId(PROTEIN_QUERY_ENDPOINT)
}

export async function getProteinResultsAmount(query: string): Promise<number> {
    return getResultsAmount(query, PROTEIN_QUERY_ENDPOINT);
}

/**
 * Returns null for any missing property
 */
export async function getProteinExtraData(id: string): Promise<ProteinExtraData> {
    const response = await fetch(`https://www.ebi.ac.uk/proteins/api/proteins/${id}`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    if (!response.ok) throw new NotFoundError();
    const json = await response.json();


    return {
        function: getCommentbyType(json.comments, 'FUNCTION'),
        tissueSpecifity: getCommentbyType(json.comments, 'TISSUE_SPECIFICITY'),
        developmentalStage: getCommentbyType(json.comments, 'DEVELOPMENTAL_STAGE'),
        induction: getCommentbyType(json.comments, 'INDUCTION')
    }
}

function getCommentbyType(comments: any, type: string): string | null {
    return comments.filter((c: any) => c.type === type).at(0)?.text.at(0)?.value || null
}

function parseProteinQueryResponse(line: string): Protein {
    const [id, proteinNames, reviewed, existence, preferredGeneName,
        organismName, organismId, proteome, sequence, sequenceLength] = line.split('\t');
    return new Protein(
        id,
        proteinNames.split('(')[0].trim(),
        reviewed === 'reviewed',
        proteinEvidence[existence] ?? ProteinEvidence.Uncertain,
        preferredGeneName,
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
