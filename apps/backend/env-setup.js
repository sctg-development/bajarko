// Load and expand environment variables
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const config = dotenv.config();
dotenvExpand.expand(config);
