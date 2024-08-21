import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs, { promises as fsp } from "fs";
import { loadOneJsonFromGists, loadUserGists } from "@/app/utils/loadJsonFromGists";
import { revalidatePath, revalidateTag } from "next/cache";

const configFolderPath = path.resolve("./public", "uploads");

/**
 * 
 * @param NextRequest Get the config file content as JSON specified in the URL
 * @param name name of the file to load
 * @returns json 
 */
export async function GET(request: NextRequest, { params }: { params: any }) {
    if (process.env.GIST_TOKEN) {
        // Get Gist
        const data = await loadOneJsonFromGists(params.name)
        if (!data) {
            return NextResponse.json({ error: 'Error loading Gist from Github' }, { status: 500 })
        } else {
            return NextResponse.json(data)
        }
    } else {
        // Load local JSON file
        try {
            const fileContent = await JSON.parse(fs.readFileSync(path.join(configFolderPath, params.name + '.json'), "utf8"))
            return NextResponse.json(fileContent)
        }
        catch (error) {
            console.error(error)
            return NextResponse.json({ error: `Error loading file ${params.name}` }, { status: 500 })
        }
    }

}


/**
 * 
 * @param NextRequest Delete the config file content specified in the URL
 * @param name name of the file to delete
 * @returns Next response
 */
export async function DELETE(request: NextRequest, { params }: { params: any }) {
    try {
        if (process.env.GIST_TOKEN) {
            // delete gist
            const gistjson = await loadUserGists()
            if (!gistjson.length) {
                return undefined // nothing found
            }
            // Reaching this point means we got a result from the Github API
            // Filter out by file name not matching dashboard.<DashID>.json
            const jsonfiles = gistjson
                .filter((item: any) => Object.keys(item.files)[0] === `dashboard.${params.name}.json`)

            // delete gist
            await fetch(`https://api.github.com/gists/${jsonfiles[0].id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `token ${process.env.GIST_TOKEN}`
                }
            });

            // Revalidate gist fetching cache
            revalidateTag('dashboards');

        } else {
            // delete local file from uploads folder
            await fsp.unlink(path.join(configFolderPath, `${params.name}.json`))
        }

        // Revalidate cache on successful deletion
        revalidatePath('/')

        return NextResponse.json({ message: `File ${params.name}.json deleted` })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: `Error deleting file ${params.name}.json` }, { status: 500 })
    }
}