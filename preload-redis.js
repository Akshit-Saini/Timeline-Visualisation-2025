import fetch from 'node-fetch';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const SPARQL_ENDPOINT = 'https://virtuoso.virtualtreasury.ie/sparql/';

// Adjust these as needed for your app's supported range
const minYear = 310;
const maxYear = 2025;
const step = 10; // Preload every 10-year range (adjust as needed)

function buildQuery(fromYear, toYear) {
  return `PREFIX crm: <http://erlangen-crm.org/current/>
PREFIX vrti: <https://www.w3id.org/virtual-treasury/ontology#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT DISTINCT *
WHERE {
  ?Person a crm:E21_Person;
          crm:P2_has_type ?Gender ;
          vrti:VRTI_ERA  ?TimePeriod .

  OPTIONAL {
    ?Person crm:P1_is_identified_by ?FirstNameResource .
    ?FirstNameResource crm:P2_has_type vrti:Forename ;
                       rdfs:label ?FirstNameLabel .
  }
  OPTIONAL {
    ?Person crm:P1_is_identified_by ?FullNameResource .
    ?FullNameResource crm:P2_has_type vrti:Name ;
                      rdfs:label ?FullNameLabel .
  }
  OPTIONAL {
    ?Person crm:P1_is_identified_by ?Surname .
    ?Surname crm:P2_has_type vrti:Surname ;
             rdfs:label ?SurnameLabel .
  }
  OPTIONAL {
    ?Person crm:P1_is_identified_by ?VariantNameResource .
    ?VariantNameResource crm:P2_has_type vrti:NameVariant ;
                         rdfs:label ?VariantNameLabel .
  }
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
    (?BirthDateLower >= "${fromYear}"^^xsd:gYear && ?BirthDateLower <= "${toYear}"^^xsd:gYear) ||
    (?BirthDateUpper >= "${fromYear}"^^xsd:gYear && ?BirthDateUpper <= "${toYear}"^^xsd:gYear) ||
    (?DeathDateLower >= "${fromYear}"^^xsd:gYear && ?DeathDateLower <= "${toYear}"^^xsd:gYear) ||
    (?DeathDateUpper >= "${fromYear}"^^xsd:gYear && ?DeathDateUpper <= "${toYear}"^^xsd:gYear) ||
    (?FloruitLower >= "${fromYear}"^^xsd:gYear && ?FloruitLower <= "${toYear}"^^xsd:gYear) ||
    (?FloruitUpper >= "${fromYear}"^^xsd:gYear && ?FloruitUpper <= "${toYear}"^^xsd:gYear)
  )
}
ORDER BY ?FullNameLabel
LIMIT 100`;
}

async function preloadAllRanges() {
  for (let from = minYear; from < maxYear; from += step) {
    const to = Math.min(from + step, maxYear);
    const query = buildQuery(from, to);
    const cacheKey = `sparql:${Buffer.from(query).toString('base64')}`;
    try {
      const response = await fetch(SPARQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sparql-query',
          'Accept': 'application/sparql-results+json',
        },
        body: query,
      });
      if (!response.ok) {
        console.error(`Failed to fetch for range ${from}-${to}:`, response.statusText);
        continue;
      }
      const data = await response.json();
      await redis.set(cacheKey, JSON.stringify(data), 'EX', 86400); // 1 day expiry
      console.log(`Preloaded range ${from}-${to}`);
    } catch (err) {
      console.error(`Error preloading range ${from}-${to}:`, err);
    }
  }
  redis.disconnect();
}

preloadAllRanges(); 