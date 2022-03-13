import { NotFoundError } from "./errors";

export interface Entity {
    id: string;
    name: string;
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
        return this.id.toString();
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

// https://www.uniprot.org/uniprot/?query=reviewed:yes+AND+organism:9606&format=tab

export class Protein implements Entity {
    constructor(
        public readonly id: string,
        public readonly name: string,
    ) { }
}