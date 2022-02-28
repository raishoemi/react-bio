export type QueryResult = {
    label: string;
    value: number;
}

export type SearchCategory = {
    name: string;
    inputPlaceholder: string;
    queryFunction: (query: string) => Promise<QueryResult[]>;
}
