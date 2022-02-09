# Data Structure
This project currently uses [uniprot](https://www.uniprot.org/)'s API directly, which returns a lot of information - some of which we don't want to present to users.  
This section will identify the data structures as they will be used by the UI app.

## Taxonomy
### Sources:
- https://www.ebi.ac.uk/proteins/api/taxonomy/id/:id/node - Anything but lineage
- https://www.ebi.ac.uk/proteins/api/taxonomy/lineage/:id - Lineage

### Structure
|Name|Type|Nullable|Description|
|-|-|-|-|
|id|number|false||
|mnemonic|string|false|Organism identification code. Can be interpreted using [this](https://www.uniprot.org/docs/speclist)|
|id|number|false||
|scientificName|string|true||
|commonName|string|true||
|rank|string|true||
|lineage|string[]|false||

## Protein