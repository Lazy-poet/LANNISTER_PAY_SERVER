import {
  LOCAL_DB_FILENAME,
  FEE_CONFIGURATION_WITH_SPECIFICITY,
} from "../types";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const dataDirectory = path.join(__dirname, "../data");

export default class LocalDBModel {
  constructor() {
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory);
    }
  }
  public addDataToDB = async (data: FEE_CONFIGURATION_WITH_SPECIFICITY[]) => {
    await writeFileAsync(
      path.join(dataDirectory, LOCAL_DB_FILENAME),
      JSON.stringify(data, null, 2)
    );
  };

  public getDataFromDB = async () => {
    const data = await readFileAsync(
      path.join(dataDirectory, LOCAL_DB_FILENAME),
      "utf-8"
    );
    return JSON.parse(data);
  };
}
