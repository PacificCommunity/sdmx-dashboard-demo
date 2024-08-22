import fs, { promises as fsp } from "fs";
import path from "path";
import { loadAllJsonFromGists } from "@/app/utils/loadJsonFromGists";
import getServerHostName from "@/app/utils/getServerHostName";

export const loadDashboards = async () => {

    const configFolderPath = path.resolve("./public", "uploads");

    if (process.env.GIST_TOKEN) {
        // Option 1: Load from Github Gist
        const data = await loadAllJsonFromGists()
        if (data === false) {
            return {}
        } else {
            return data
        }
    } else {
        // Option 2: Load from locally uploaded files
        try {

            const filenames = fs.readdirSync(configFolderPath);

            const jsonfiles = filenames
                // filter out non JSON files
                .filter(filename => filename.endsWith(".json"))
                // create object with human readable name and real file name
                .map((name) => {
                    const stats = fs.statSync(`${configFolderPath}/${name}`)
                    return {
                        name: name
                            .split('.')[0]
                            .replace('-', ' '),
                        date: stats.mtime,
                        uri: name.split('.')[0],
                        raw: `${getServerHostName()}/api/config/${name.split('.')[0]}` // use the config API to access the file
                    };
                });
            return jsonfiles
        }
        catch (error) {
            console.error(error)
            return {}
        }
    }
}