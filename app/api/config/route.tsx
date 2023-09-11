
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs, { promises as fsp } from "fs";
import yaml from "js-yaml";
import { saveYmlAsGist } from "@/app/utils/saveYmlAsGist";

import { loadDashboards } from '@/app/utils/loadDashboards'
import { revalidateTag } from "next/cache";

const configFolderPath = path.join(process.cwd(), "/public/uploads");

/**
 * Load list of YAML files from uploads folder or Github Gist
 * @param NextRequest Get list of dashboard configs YAML
 * @returns json 
 */
export async function GET(request: NextRequest) {

    const data = await loadDashboards()

    if (data === false) {
        return NextResponse.json({ error: 'Error loading files from Github' }, { status: 500 });
    } else {
        return NextResponse.json(data);
    }
    
}

/**
 * Save a new YAML file to uploads folder or Github Gist
 * @param NextRequest Post a new config YAML file
 * @returns json 
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const yamlfile = formData.get('yamlfile');
        let ymlobj = {};
        let ymlstring = '';
        if (yamlfile instanceof File && yamlfile.name) {
            const bytes = await yamlfile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            try {
                // load buffer (posted file) as String
                ymlstring = buffer.toString()
                // try to load YAML (checks if YAML is valid)
                ymlobj = yaml.load(ymlstring);
            } catch (e) {
                throw new Error("Not a valid YAML file");
            }

            // Save Dashboard YAML 
            try {
                if (process.env.GIST_TOKEN) {
                    // Save YAML in github gist
                    const gist = await saveYmlAsGist(
                        ymlobj.DashID,
                        ymlstring,
                        process.env.GIST_PUBLIC == 'true' || process.env.GIST_PUBLIC == '1'
                    );
                } else {
                    // Fallback, save file in uploads folder
                    // DashID is any string composed of numbers, letters, and underscores (_) 
                    // Filename should not have spaces, but just in case, replace them with dashes
                    const finalname = `${ymlobj.DashID.replace(' ', '-')}.yaml`;
                    fs.writeFileSync(`${configFolderPath}/${finalname}`, buffer);
                }
                // Revalidate cache on success
                revalidateTag('gists')
                // Return success message
                return NextResponse.json({ success: true });
            } catch (e) {
                throw new Error("Error saving YAML");
            }

        }
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: `Error saving file: ${error}` }, { status: 500 });
    }

}