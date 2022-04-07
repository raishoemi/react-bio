import { NotFoundError } from "../errors";
import { Protein, ProteinEvidence } from "../types";
import { Endpoint, getOne, getRandomId, getResultsAmount, queryApi } from "./common";

const proteinEvidence: { [key: string]: ProteinEvidence } = {
    'Evidence at protein level': ProteinEvidence.ProteinLevelEvidence,
    'Evidence at transcript level': ProteinEvidence.TranscriptLevelEvidence,
    'Inferred from homology': ProteinEvidence.InferredFromHomology,
    'Predicted': ProteinEvidence.Predicted
}

export async function queryProteins(query: string, limit: number = 20, offset: number = 0): Promise<Protein[]> {
    const response = await fetch(`https://www.ebi.ac.uk/proteins/api/proteins?offset=${offset}&size=${limit}&protein=${query}`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    const proteinsJson = await response.json();
    return proteinsJson.map(parseProteinResponse);
}
export async function getProtein(id: string): Promise<Protein> {
    const response = await fetch(`https://www.ebi.ac.uk/proteins/api/proteins/${id}`, {
        headers: {
            'Accept': 'application/json'
        }
    })
    return parseProteinResponse(await response.json())
}
export async function getRandomProteinId(): Promise<number> {
    return getRandomId(Endpoint.Protein)
}
export async function getProteinResultsAmount(query: string): Promise<number> {
    const response = await fetch(`https://www.ebi.ac.uk/proteins/api/proteins?size=1&protein=${query}`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    const totalRecordsHeader = response.headers.get("x-pagination-totalrecords")
    if (!totalRecordsHeader) throw new Error("No total records header");
    return parseInt(totalRecordsHeader);
}
function parseProteinResponse(response: any): Protein {
    const organismNames = response.organism.names;
    const scientificTaxonomyName = organismNames.filter((name: any) => name.type === 'scientific').at(0)
    const commonTaxonomyName = organismNames.filter((name: any) => name.type === 'common').at(0)

    return new Protein(
        response.accession,
        response.protein.recommendedName ? response.protein.recommendedName.fullName.value : '',
        response.protein.submittedName ? response.protein.submittedName[0].fullName.value : '',
        parseAlternativeNames(response),
        {
            name: {
                scientific: scientificTaxonomyName ? scientificTaxonomyName.value : '',
                common: commonTaxonomyName ? commonTaxonomyName.value : ''
            },
            id: response.organism.taxonomy.toString()
        },
        response.info.type.toLowerCase() === 'swiss-prot',
        {
            value: response.sequence.sequence,
            mass: response.sequence.mass,
            length: response.sequence.length
        },
        proteinEvidence[response.proteinExistence] ?? ProteinEvidence.Uncertain,
        response.gene ? (response.gene.at(0) ? {
            name: response.gene[0].name,
            orfNames: response.gene[0].orfNames?.map((name: any) => name.value),
        } : undefined) : undefined
    );
}

function parseAlternativeNames(response: any): { [fullName: string]: string[] } | undefined {
    if (!response.protein.alternativeName) return undefined;
    return response.protein.alternativeName.map((altName: any) => ({
        [altName.fullName.valuue]: altName.shortName.map((shortName: any) => shortName.value)
    }));
}
