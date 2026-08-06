// loadEnv.js
//
// Must be the FIRST import in server.js. Because of how ES modules
// execute (imports run in the order they appear, each one fully
// finishing before the next starts), importing this file first
// guarantees dotenv.config() has already run by the time any other
// file (database.js, youtubeService.js, etc.) tries to read
// process.env - avoiding the "env var is undefined" timing bug.
import dotenv from "dotenv";
dotenv.config();