// This file is loaded BEFORE any other modules via --require flag.
// It ensures environment variables are available before any module imports.
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(process.cwd(), '.env') });
