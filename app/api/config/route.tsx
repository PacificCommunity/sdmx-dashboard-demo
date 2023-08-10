
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs, { promises as fsp } from "fs";
import yaml from "js-yaml";

const configFolderPath = path.join(process.cwd(), "/public/uploads");

/**
 * 
 * @param NextRequest Get a list of configs in the uploads folder
 * @returns json 
 */
export async function GET(request: NextRequest) {
    try {

        const filenames = fs.readdirSync(configFolderPath);
      
        const yamlfiles = filenames
            // filter out non yaml files
            .filter(filename => filename.endsWith(".yaml"))
            // create object with human readable name and real file name
            .map((name) => {
                return {
                    name: name
                        .split('.')[1]
                        .replace('_', '.')
                        .replace('-', ' '),
                    date: name
                        .split('.')[0],
                    path: name,
                };
            });
        return NextResponse.json(yamlfiles);
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({error: 'Error loading folder'}, {status: 500});
    }

}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const yamlfile = formData.get('yamlfile');
        if(yamlfile instanceof File && yamlfile.name ) {
            const bytes = await yamlfile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            try {
                const doc = yaml.load(buffer.toString());
                const finalname = `${Date.now()}.${doc.DashID.replace('.','_').replace(' ','-')}.yaml`;
                fs.writeFileSync(`${configFolderPath}/${finalname}`, buffer);

                return NextResponse.json({success: true});
            } catch (e) {
                throw new Error("Not a valid YAML file");
                //return new NextResponse("Not a valid YAML file", {status: 400})
            }

        }
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({error: `Error saving file: ${error}`}, {status: 500});
    }

}