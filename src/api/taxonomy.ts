import { NotFoundError } from '../errors';
import { Entity, Lineage, Protein, Taxonomy } from '../types';
import { Endpoint, getOne, getRandomId, getResultsAmount, queryApi } from './common';

export async function queryTaxonomies(query: string, limit: number = 20, offset: number = 0): Promise<Taxonomy[]> {
    const lines = await queryApi(query, Endpoint.Taxonomy, limit, offset);
    return lines.map(parseTaxonomyResponse);
}

export async function getTaxonomy(id: string): Promise<Taxonomy> {
    const taxonomy = await parseTaxonomyResponse(await getOne(id, Endpoint.Taxonomy));
    if (taxonomy.id !== id) throw new NotFoundError();
    return taxonomy;
}

export async function getRandomTaxonomyId(): Promise<number> {
    return getRandomId(Endpoint.Taxonomy)
}

export async function getTaxonomyResultsAmount(query: string): Promise<number> {
    return getResultsAmount(query, Endpoint.Taxonomy);
}

export async function getTaxonomyLineage(id: string): Promise<Lineage> {
    const ancestoryResponse = await fetch(`https://www.ebi.ac.uk/proteins/api/taxonomy/lineage/${id}`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    if (!ancestoryResponse.ok) {
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
    const lineage: Lineage = new Lineage(
        root.name, {
        id: root.id,
    }, undefined);
    let currentLineage = lineage;
    ancestory.forEach(ancestor => {
        currentLineage.children = [new Lineage(
            ancestor.name, {
            id: ancestor.id
        }, undefined)];
        currentLineage = currentLineage.children[0];
    });

    // Insert children at the last lineage node
    currentLineage.children = await getTaxonomyChildren(id);
    return lineage;
}

export async function getTaxonomyChildren(id: string): Promise<Lineage[]> {
    const childrenResponse = await fetch(`https://www.ebi.ac.uk/proteins/api/taxonomy/id/${id}/children?pageNumber=1&pageSize=100`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    if (!childrenResponse.ok) throw new NotFoundError();
    let childrenResponseData = await childrenResponse.json();
    const children: Entity[] = childrenResponseData['taxonomies'].map((_: any) => ({ id: _.taxonomyId, name: _.scientificName }));
    return children.map((_: Entity) => new Lineage(_.name, { id: _.id }, undefined));
}

function parseTaxonomyResponse(response: string): Taxonomy {
    const values = response.split('\t');
    return new Taxonomy(values[0], values[1], values[2], values[3],
        values[7], values[8].split(';'), parseInt(values[9]));
}

