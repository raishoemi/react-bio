export type Taxonomy = {
    id: number;
    mnemonic: string;
    name: {
        common: string;
        scientific: string;
    },
    rank: string;
    lineage: string[];
    parentId: number;
}