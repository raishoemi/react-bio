import { getRandomTaxonomyId, queryTaxonomies } from "../../../api";
import { Entity, Protein, Taxonomy } from "../../../types"

abstract class Category {
    constructor(
        public readonly name: string,
        public readonly example: string
    ) { }

    public abstract getEntities(query: string, limit?: number, offset?: number): Promise<Entity[]>;
    public abstract getRandomId(): Promise<number>;
}

class TaxonomyCategory extends Category {
    constructor() {
        super('Taxonomy', 'Homo sapien');
    }

    public async getEntities(query: string, limit?: number, offset?: number): Promise<Taxonomy[]> {
        return queryTaxonomies(query, limit, offset);
    }

    public getRandomId(): Promise<number> {
        return getRandomTaxonomyId();
    }
}

class ProteinCategory extends Category {
    constructor() {
        super('Protein', 'Spliceosome');
    }

    public getEntities(query: string, limit?: number, offset?: number): Promise<Protein[]> {
        throw new Error("Method not implemented.");
    }

    public getRandomId(): Promise<number> {
        throw new Error("Method not implemented.");
    }
}

export type SearchResults = {
    query: string;
    category: Category;
    totalItems: number;
    pages: {
        [pageNumber: number]: Entity[];
    }
}

export { Category, TaxonomyCategory, ProteinCategory };