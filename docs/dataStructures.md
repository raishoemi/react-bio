# Data Structure
This project currently uses [uniprot](https://www.uniprot.org/)'s API directly, which returns a lot of information - some of which we don't want to present to users.  
This section will identify the data structures as they will be used by the UI app.  
I know this will end up as typescript objects anyway, but it's easier for me to document it as tables at first just to match data from the website to the API, and map it for easier access.

## Taxonomy
|Name|Type|Nullable|Description|
|-|-|-|-|
|id|number|false||
|mnemonic|string|false|Organism identification code. Can be interpreted using [this](https://www.uniprot.org/docs/speclist)|
|name|{scientific: string, common: string}|false||
|rank|string|true||
|lineage|string[]|false||
|proteomeId|number|true||

## Protein
|Name|Type|Nullable|Description|
|-|-|-|-|
|id|number|false||
|reviewed|boolean|false|Link uniprot's explanation|
|proteinExistence|number|false|Uniprot gives out a string, convert to 1-5 scale|
|name|{recommended: string, alternative: string}|false||
|orgasnism|{id: number, name: string}|false||
|gene|{name: string, synonyms: string[], orfNames: string[]}|true||
|sequence|string|true||
|isoforms|number[]|false|isoforms accessions|
