import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs, { promises as fsp } from "fs";
import yaml from "js-yaml";


const configFolderPath = path.join(process.cwd(), "/public/uploads");

/**
 * 
 * @param NextRequest Get the config file content as JSON specified in the URL
 * @param name name of the file to load
 * @returns json 
 */
export async function GET(NextRequest, { params }) {
    try {
        const yamlDoc = await yaml.load(fs.readFileSync(path.join(configFolderPath, params.name), "utf8"));
        return NextResponse.json(yamlDoc);
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({error: `Error loading file ${params.name}`}, {status: 500});
    }

}