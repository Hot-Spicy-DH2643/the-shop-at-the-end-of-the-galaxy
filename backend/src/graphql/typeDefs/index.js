import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load all GraphQL files from the current directory
const typesArray = loadFilesSync(join(__dirname, '*.graphql'));

// Merge all type definitions
export const typeDefs = mergeTypeDefs(typesArray);
