import path from "path";
import fs, { promises as fsp } from "fs";
import yaml from "js-yaml";
import { loadOneYamlFromGists } from "@/app/utils/loadYamlFromGists";

const configFolderPath = path.join(process.cwd(), "/public/uploads");

export const loadDashboardConfig = async (name: string) => {

    // simluate loading time
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    if (process.env.GIST_TOKEN) {
        // Get Gist
        const data = await loadOneYamlFromGists(name)
        if (!data) {
            return 'Error loading Gist from Github'
        } else {
            const yamlDoc: any = await yaml.load(data!, { json: true})
            return yamlDoc
        }
    } else {
        // Load local YAML file
        try {
            const yamlDoc: any = await yaml.load(fs.readFileSync(path.join(configFolderPath, `${name}.yaml`), "utf8"), { json: true})
            return yamlDoc
        }
        catch (error) {
            console.error(error)
            return 'Error loading YAML file from local storage'
        }
    }


}