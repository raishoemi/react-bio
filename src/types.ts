export interface Entity {
    id: string;
    name: string;
}

export enum ProteinEvidence {
    ProteinLevelEvidence = 'Experimental evidence at protein level',
    TranscriptLevelEvidence = 'Experimental evidence at transcript level',
    InferredFromHomology = 'Protein inferred from homology',
    Predicted = 'Protein predicted',
    Uncertain = 'Protein uncertain'
}

export class Taxonomy implements Entity {
    constructor(
        public readonly id: string,
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
        return this.id;
    }
}

export class Lineage {
    constructor(
        public readonly name: string,
        public readonly attributes: { id: string; },
        public children: Lineage[] | undefined
    ) { }

    public static fromNode(lineage: Lineage): Lineage {
        return new Lineage(
            lineage.name,
            lineage.attributes,
            lineage.children
        )
    }

    public getNode(id: string): Lineage | undefined {
        if (this.attributes.id.toString() === id) return this;
        if (this.children) {
            for (const child of this.children) {
                const node = child.getNode(id);
                if (node) return node;
            }
        }
        return undefined;
    }
}

export class Protein implements Entity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly reviewed: boolean,
        public readonly evidence: ProteinEvidence,
        public readonly geneName: string,
        public readonly taxonomy: {
            name: string,
            id: string
        },
        public readonly sequence: string,
        public readonly sequenceLength: number,
        public readonly proteome: {
            id: string,
            chromosome: string
        }
    ) { }
}

export type ProteinExtraData = {
    function: string | null;
    tissueSpecifity: string | null;
    developmentalStage: string | null;
    induction: string | null;
}