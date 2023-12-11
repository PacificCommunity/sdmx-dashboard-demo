import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs, { promises as fsp } from "fs";

import { validate } from "@hyperjump/json-schema/draft-2020-12";

import { saveConfigAsGist } from "@/app/utils/saveConfigAsGist";

import { loadDashboards } from '@/app/utils/loadDashboards'
import { revalidateTag, revalidatePath } from "next/cache";

const configFolderPath = path.join(process.cwd(), "/public/uploads");
const schemaFolderPath = path.join(process.cwd(), "/public/schema");

/**
 * Load list of config files from uploads folder or Github Gist
 * @param NextRequest Get list of dashboard configurations
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
 * Save a new config file to uploads folder or Github Gist
 * @param NextRequest Post a new config file
 * @returns json 
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const configfile = formData.get('configfile') as Blob | null;

        // a file has indeed been submitted
        if (configfile) {
            // load file as Buffer
            const bytes = await configfile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const jsonstring = buffer.toString('utf8');

            const jsonobj = JSON.parse(jsonstring);

            // Load JSON schema from file
            const output = await validate(`${schemaFolderPath}/dashboard.schema.json`, jsonobj)
            if (!output.valid) {
                throw new Error("Invalid JSON file: not matching the schema")
            }

            // Save Dashboard config locally or as a Gist 
            try {
                if (process.env.GIST_TOKEN) {
                    // Save config file in github gist
                    const gist = await saveConfigAsGist(
                        jsonobj.id,
                        jsonstring,
                        process.env.GIST_PUBLIC == 'true' || process.env.GIST_PUBLIC == '1'
                    );
                    // revalidate fetch call for gists
                    revalidateTag('dashboards');
                } else {
                    // Fallback, save file in uploads folder
                    // DashID is any string composed of numbers, letters, and underscores (_) 
                    // Filename should not have spaces, but just in case, replace them with dashes
                    const finalname = `${jsonobj.id.replace(' ', '-')}.json`;
                    fs.writeFileSync(`${configFolderPath}/${finalname}`, buffer);
                }
                // Revalidate cache on successful upload
                revalidatePath('/')
                revalidatePath('/chart/[dashfile]')
                // Return success message
                return NextResponse.json({ success: true });
            } catch (e) {
                throw new Error("Error saving JSON config file");
            }

        }
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: `Error saving file: ${error}` }, { status: 500 });
    }

}