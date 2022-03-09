import { getProteinResultsAmount, getRandomTaxonomyId, getTaxonomyResultsAmount, queryTaxonomies } from './api';
import { Entity, Protein, Taxonomy } from './types';

abstract class Category {
    constructor(
        public readonly name: CategoryName,
        public readonly example: string
    ) { }

    public abstract getEntities(query: string, limit?: number, offset?: number): Promise<Entity[]>;
    public abstract getRandomId(): Promise<number>;
    public abstract getQueryResultSize(query: string): Promise<number>;
}

class TaxonomyCategory extends Category {
    constructor() {
        super(CategoryName.Taxonomy, 'Homo sapien');
    }

    public async getEntities(query: string, limit?: number, offset?: number): Promise<Taxonomy[]> {
        return queryTaxonomies(query, limit, offset);
    }

    public getRandomId(): Promise<number> {
        return getRandomTaxonomyId();
    }

    public getQueryResultSize(query: string): Promise<number> {
        return getTaxonomyResultsAmount(query);
    }
}

class ProteinCategory extends Category {
    constructor() {
        super(CategoryName.Protein, 'Spliceosome');
    }

    public getEntities(query: string, limit?: number, offset?: number): Promise<Protein[]> {
        throw new Error("Method not implemented.");
    }

    public getRandomId(): Promise<number> {
        throw new Error("Method not implemented.");
    }

    public getQueryResultSize(query: string): Promise<number> {
        return getProteinResultsAmount(query);
    }
}

export enum CategoryName {
    Taxonomy = 'Taxonomy',
    Protein = 'Protein'
}

const categories: Record<string, Category> = {};
[
    new TaxonomyCategory(),
    new ProteinCategory()
].forEach(category => {
    categories[category.name] = category;
});

export { Category, TaxonomyCategory, ProteinCategory, categories };