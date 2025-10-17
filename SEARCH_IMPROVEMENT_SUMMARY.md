# Address Search Improvement - Multi-Token Search

## Overview

Enhanced the address search/suggestion functionality to support multi-token queries. Instead of searching for the complete query string, the system now splits the input into individual tokens and finds addresses that match ALL tokens.

## Example Use Case

**Query:** `"1 B RES PARC LUCIE BAT FENO"`

**Previous Behavior:**

- Searched for exact match: `%1 B RES PARC LUCIE BAT FENO%`
- Often returned no results if the exact sequence wasn't found

**New Behavior:**

- Splits into tokens: `["1", "B", "RES", "PARC", "LUCIE", "BAT", "FENO"]`
- Searches for addresses containing:
  - `%1%` AND
  - `%B%` AND
  - `%RES%` AND
  - `%PARC%` AND
  - `%LUCIE%` AND
  - `%BAT%` AND
  - `%FENO%`
- Returns addresses that match all tokens (regardless of order)

## Changes Made

### 1. AdresseRepository.java

Added new query methods to support 1-5 token searches:

- `findSuggestionsByToken(token1)` - Single token search
- `findSuggestionsByTwoTokens(token1, token2)` - Two tokens with AND
- `findSuggestionsByThreeTokens(token1, token2, token3)` - Three tokens with AND
- `findSuggestionsByFourTokens(token1, token2, token3, token4)` - Four tokens with AND
- `findSuggestionsByFiveTokens(token1, token2, token3, token4, token5)` - Five tokens with AND

Each query uses `ILIKE CONCAT('%', :token, '%')` to match tokens anywhere in the address.

### 2. AdresseServiceImpl.java

Enhanced `getSuggestions(String query)` method:

- **Token Splitting:** Splits query by whitespace into individual tokens
- **Token Filtering:** Keeps all non-empty tokens (including single characters and numbers)
- **Intelligent Search Strategy:**
  1. Start with maximum available tokens (up to 5)
  2. If no results, progressively reduce token count
  3. Falls back to single token search if needed
- **Deduplication:** Removes duplicate results by `idadresse`
- **Result Limiting:** Limits final results to 20 suggestions

## How It Works

### Search Flow

```
Input: "1 B RES PARC LUCIE BAT FENO"
   ↓
Split into tokens: ["1", "B", "RES", "PARC", "LUCIE", "BAT", "FENO"]
   ↓
Try with first 5 tokens: "1", "B", "RES", "PARC", "LUCIE"
   ↓
If no results, try with first 4 tokens: "1", "B", "RES", "PARC"
   ↓
If no results, try with first 3 tokens: "1", "B", "RES"
   ↓
Continue reducing until results are found
   ↓
Return up to 20 unique results
```

### Benefits

1. **Better Match Accuracy:** Finds addresses that contain all search terms
2. **Order Independence:** Tokens can appear in any order in the address
3. **Graceful Degradation:** Falls back to fewer tokens if exact match isn't found
4. **Handles Partial Addresses:** Works well with incomplete or fragmented address data
5. **Case Insensitive:** Uses `ILIKE` for case-insensitive matching

## API Endpoint

```
GET /api/adresses/suggestions?q=1 B RES PARC LUCIE BAT FENO
```

## Database Query Example

For query "1 B RES PARC LUCIE", the generated SQL will be:

```sql
SELECT
    idadresse,
    adresse_complete as adresseComplete,
    numero,
    nom_voie as nomVoie,
    type_voie as typeVoie,
    codepostal,
    commune,
    MIN(latitude) as latitude,
    MIN(longitude) as longitude
FROM dvf.adresse_complete_geom_mv
WHERE adresse_complete ILIKE '%1%'
  AND adresse_complete ILIKE '%B%'
  AND adresse_complete ILIKE '%RES%'
  AND adresse_complete ILIKE '%PARC%'
  AND adresse_complete ILIKE '%LUCIE%'
GROUP BY idadresse, adresse_complete, numero, nom_voie, type_voie, codepostal, commune
ORDER BY commune, nom_voie, numero
LIMIT 100
```

## Testing

To test the new functionality:

1. **Start your application**
2. **Make a request:**
   ```bash
   curl "http://localhost:8080/api/adresses/suggestions?q=1%20B%20RES%20PARC%20LUCIE%20BAT%20FENO"
   ```
3. **Verify:** Results should include addresses containing all the tokens

## Performance Considerations

- Limit set to 100 results at query level (before deduplication)
- Final result set limited to 20 suggestions
- Database uses indexes on `adresse_complete` column for optimal performance
- Fallback strategy prevents excessive database queries
