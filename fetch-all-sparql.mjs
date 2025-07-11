import fetch from 'node-fetch';
import fs from 'fs';

const SPARQL_ENDPOINT = 'https://virtuoso.virtualtreasury.ie/sparql/';
const minYear = 310;
const maxYear = 2025;
const step = 10; // or smaller if needed

async function fetchRange(from, to) {
  const query = `
    PREFIX crm: <http://erlangen-crm.org/current/>
    PREFIX vrti: <https://www.w3id.org/virtual-treasury/ontology#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT DISTINCT *
    WHERE {
      ?Person a crm:E21_Person;
              crm:P2_has_type ?Gender ;
              vrti:VRTI_ERA  ?TimePeriod .
      OPTIONAL { ?Person crm:P1_is_identified_by ?FirstNameResource .
                 ?FirstNameResource crm:P2_has_type vrti:Forename ;
                                    rdfs:label ?FirstNameLabel . }
      OPTIONAL { ?Person crm:P1_is_identified_by ?FullNameResource .
                 ?FullNameResource crm:P2_has_type vrti:Name ;
                                    rdfs:label ?FullNameLabel . }
      OPTIONAL { ?Person crm:P1_is_identified_by ?Surname .
                 ?Surname crm:P2_has_type vrti:Surname ;
                          rdfs:label ?SurnameLabel . }
      OPTIONAL { ?Person crm:P1_is_identified_by ?VariantNameResource .
                 ?VariantNameResource crm:P2_has_type vrti:NameVariant ;
                                      rdfs:label ?VariantNameLabel . }
      OPTIONAL { ?Person crm:P62i_is_depicted_by ?Image . }
      OPTIONAL { ?Person owl:sameAs ?WikidataPage . }
      OPTIONAL { ?Person vrti:DIB_ID ?DIB_ID . }
      OPTIONAL { ?Person crm:P71i_is_listed_in ?DIB_Page . }
      OPTIONAL {
        ?DeathEvent a crm:E69_Death;
                    crm:P93_took_out_of_existence ?Person .
        OPTIONAL {
          ?DeathEvent crm:P4_has_time-span ?DeathDateResource .
          ?DeathDateResource crm:P81a_end_of_the_begin ?DeathDateLower .
          ?DeathDateResource crm:P82b_end_of_the_end ?DeathDateUpper .  
        }
        OPTIONAL {
          ?DeathEvent crm:P7_took_place_at ?DeathPlaceResource .
          ?DeathPlaceResource rdfs:label ?DeathPlaceLabel .
          FILTER(LANG(?DeathPlaceLabel) = "en")
        }
      }
      OPTIONAL {
        ?BirthEvent a crm:E67_Birth;
                    crm:P98_brought_into_life ?Person .
        OPTIONAL {
          ?BirthEvent crm:P4_has_time-span ?BirthDateResource .
          ?BirthDateResource crm:P81a_end_of_the_begin ?BirthDateLower .
          ?BirthDateResource crm:P82b_end_of_the_end ?BirthDateUpper .
        }
        OPTIONAL {
          ?BirthEvent crm:P7_took_place_at ?BirthPlaceResource .
          ?BirthPlaceResource rdfs:label ?BirthPlaceLabel .
          FILTER(LANG(?BirthPlaceLabel) = "en")
        }
      }
      ?FloruitResource crm:P2_has_type vrti:Floruit ;
                       crm:P4_has_time-span ?FloruitDateResource ;
                       crm:P12_occurred_in_the_presence_of ?Person .
      ?FloruitDateResource crm:P81a_end_of_the_begin ?FloruitLower ;
                           crm:P82b_end_of_the_end ?FloruitUpper .
      BIND(STRAFTER(STR(?TimePeriod), "#") AS ?TimePeriodLabel)
      FILTER(
        (?BirthDateLower >= "${from}"^^xsd:gYear && ?BirthDateLower <= "${to}"^^xsd:gYear) ||
        (?BirthDateUpper >= "${from}"^^xsd:gYear && ?BirthDateUpper <= "${to}"^^xsd:gYear) ||
        (?DeathDateLower >= "${from}"^^xsd:gYear && ?DeathDateLower <= "${to}"^^xsd:gYear) ||
        (?DeathDateUpper >= "${from}"^^xsd:gYear && ?DeathDateUpper <= "${to}"^^xsd:gYear) ||
        (?FloruitLower >= "${from}"^^xsd:gYear && ?FloruitLower <= "${to}"^^xsd:gYear) ||
        (?FloruitUpper >= "${from}"^^xsd:gYear && ?FloruitUpper <= "${to}"^^xsd:gYear)
      )
    }
    ORDER BY ?FullNameLabel
    LIMIT 1000
  `;
  const response = await fetch(SPARQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/sparql-query',
      'Accept': 'application/sparql-results+json',
    },
    body: query,
  });
  return await response.json();
}

let allResults = [];
for (let from = minYear; from < maxYear; from += step) {
  let to = Math.min(from + step, maxYear);
  const data = await fetchRange(from, to);
  if (data.results?.bindings) {
    allResults.push(...data.results.bindings);
    console.log(`Fetched ${data.results.bindings.length} for ${from}-${to}`);
  }
  await new Promise(r => setTimeout(r, 1000)); // avoid rate limits
}
fs.writeFileSync('public/all-sparql-data.json', JSON.stringify(allResults, null, 2));
console.log('All data saved to public/all-sparql-data.json'); 