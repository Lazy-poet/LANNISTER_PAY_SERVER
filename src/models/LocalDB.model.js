import {
  LOCAL_DB_FILENAME,
} from "../types";
import fs from "fs";
import path,  { dirname }  from "path";
import { fileURLToPath } from 'url';
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const dataDirectory = path.join(__dirname, "../data");

export default class LocalDBModel {
  constructor() {
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory);
    }
  }
  addDataToDB = async (data) => {
    await writeFileAsync(
      path.join(dataDirectory, LOCAL_DB_FILENAME),
      JSON.stringify(data, null, 2)
    );
  };

  getDataFromDB = async () => {
    const data = await readFileAsync(
      path.join(dataDirectory, LOCAL_DB_FILENAME),
      "utf-8"
    );
    return JSON.parse(data);
  };
}
