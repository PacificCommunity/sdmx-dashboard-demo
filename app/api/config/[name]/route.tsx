import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs, { promises as fsp } from "fs";
import yaml from "js-yaml";
import { loadOneYamlFromGists } from "@/app/utils/loadYamlFromGists";
import { validate } from "@hyperjump/json-schema/draft-2020-12";

const configFolderPath = path.join(process.cwd(), "/public/uploads");

/**
 * 
 * @param NextRequest Get the config file content as JSON specified in the URL
 * @param name name of the file to load
 * @returns json 
 */
export async function GET(request: NextRequest, { params }: {params: any}) {
    if (process.env.GIST_TOKEN) {
        // Get Gist
        const data = await loadOneYamlFromGists(params.name)
        if (!data) {
            return NextResponse.json({ error: 'Error loading Gist from Github' }, { status: 500 })
        } else {
            const yamlDoc = await yaml.load(data!)
            return NextResponse.json(yamlDoc)
        }
    } else {
        // Load local YAML file
        try {
            if (params.name.endsWith(".json")){
                const fileContent = await JSON.parse(fs.readFileSync(path.join(configFolderPath, params.name), "utf8"))
                const output = await validate("./public/schema/dashboard.schema.json", fileContent)
                if(output.valid) {
                    return NextResponse.json(fileContent)
                } else {
                    throw new Error("Invalid JSON file: not matching the schema")
                }
            } else {
                const yamlDoc = await yaml.load(fs.readFileSync(path.join(configFolderPath, `${params.name}`), "utf8"))
                return NextResponse.json(yamlDoc)
            }
        }
        catch (error) {
            console.error(error)
            return NextResponse.json({error: `Error loading file ${params.name}`}, {status: 500})
        }
    }

}
