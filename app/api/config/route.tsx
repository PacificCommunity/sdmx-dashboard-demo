
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
      
        const jsonfiles = filenames
            .filter(filename => filename.endsWith(".yaml") || filename.endsWith(".yml"))
            .map((name) => {
                // filter out non yaml files
                return {
                    name: name
                        .substring(0, name.lastIndexOf("."))
                        .slice(name.indexOf("_") + 1),
                    path: name,
                };
            });
        return NextResponse.json(jsonfiles);
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

            const tmpfilepath = yamlfile.name;
            const finalname = `${Date.now()}_${yamlfile.name}`;
            const bytes = await yamlfile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            try {
                const doc = yaml.load(buffer.toString());
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