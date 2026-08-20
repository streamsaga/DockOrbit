// loadEnv.js
//
// Must be the FIRST import in server.js. Because of how ES modules
// execute (imports run in the order they appear, each one fully
// finishing before the next starts), importing this file first
// guarantees dotenv.config() has already run by the time any other
// file (database.js, youtubeService.js, etc.) tries to read
// process.env - avoiding the "env var is undefined" timing bug.
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });