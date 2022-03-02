export interface Entity {
    id: number;
    name: string;
}

export class Taxonomy implements Entity {
    constructor(
        public readonly id: number,
        public readonly scientificName: string,
        public readonly commonName: string,
        public readonly mnemonic: string,
        public readonly rank: string,
        public readonly lineage: string[],
        public readonly parentId: number
    ) { }

    /**
     * Because uniprot's api returns multiple names, and we're not sure which will contain a value, we return the first one that is not empty.
     */
    public get name(): string {
        if (this.commonName) return this.commonName;
        if (this.scientificName) return this.scientificName;
        if (this.mnemonic) return this.mnemonic;
        return this.id.toString();
    }
}

export class Protein implements Entity {
    constructor(
        public readonly id: number,
        public readonly name: string,
    ) { }
}