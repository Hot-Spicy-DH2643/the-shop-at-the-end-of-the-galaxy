import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import gql from 'graphql-tag';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load and parse all GraphQL schema files
const queryTypeDef = readFileSync(join(__dirname, 'query.graphql'), 'utf-8');
const mutationTypeDef = readFileSync(
  join(__dirname, 'mutation.graphql'),
  'utf-8'
);

// Combine all type definitions
export const typeDefs = gql`
  ${queryTypeDef}
  ${mutationTypeDef}
`;
