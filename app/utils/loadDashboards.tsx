import fs, { promises as fsp } from "fs";
import path from "path";
import { loadAllYamlFromGists } from "@/app/utils/loadYamlFromGists";
import getServerHostName from "@/app/utils/getServerHostName";

export const loadDashboards = async () => {

    const configFolderPath = path.join(process.cwd(), "/public/uploads");

    if (process.env.GIST_TOKEN) {
        // Option 1: Load from Github Gist
        const data = await loadAllYamlFromGists()
        if (data === false) {
            return {}
        } else {
            return data
        }
    } else {
        // Option 2: Load from locally uploaded files
        try {

            const filenames = fs.readdirSync(configFolderPath);

            const yamlfiles = filenames
                // filter out non yaml files
                .filter(filename => filename.endsWith(".yaml"))
                // create object with human readable name and real file name
                .map((name) => {
                    const stats = fs.statSync(`${configFolderPath}/${name}`)
                    return {
                        name: name
                            .split('.')[0]
                            .replace('-', ' '),
                        date: stats.mtime,
                        uri: name.split('.')[0],
                        raw: getServerHostName() + '/uploads/' + name
                    };
                });
            return yamlfiles
        }
        catch (error) {
            console.error(error)
            return {}
        }
    }
}