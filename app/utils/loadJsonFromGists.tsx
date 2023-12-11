/**
 * Load list of dashboard from Github Gist
 * @returns array of dashboards
 */
export const loadAllJsonFromGists = async () => {
    const gistjson = await loadUserGists()
    if (!gistjson.length) {
        return {} // nothing found
    }
    // Reaching this point means we got a result from the Github API
    return gistjson
        // Filter out by file name not matching dashboard.*.json
        .filter((item: any) => Object.keys(item.files)[0].startsWith("dashboard.") && Object.keys(item.files)[0].endsWith(".json"))
        // Map results to object with human readable name, update date, and raw url
        .map((item: any) => {
            const stats = item.updated_at
            const filename = Object.keys(item.files)[0]
            return {
                name: filename
                    .split('.')[1]
                    .replace('-', ' '),
                date: stats,
                uri: filename.split('.')[1],
                raw: `${item.files[filename].raw_url}`,
            }
        })
}


/**
 * Load a single JSON file from Github Gist
 * @param DashID ID of the dashboard to load
 * @returns raw text of dashboard.*.json
 */
export const loadOneJsonFromGists = async (DashID: string) => {
    // Load all gists from authenticated user
    const gistjson = await loadUserGists()
    if (!gistjson.length) {
        return undefined // nothing found
    }
    // Reaching this point means we got a result from the Github API
    // Filter out by file name not matching dashboard.<DashID>.json
    const jsonfiles = gistjson
        .filter((item: any) => Object.keys(item.files)[0] === `dashboard.${DashID}.json`)

    // return raw text of dashboard.*.json from Gist by fetching raw url from Github API
    const response = await fetch(jsonfiles[0].files[`dashboard.${DashID}.json`].raw_url, {
        method: 'GET',
        headers: {
            'Accept': 'text/plain',
            'Authorization': `token ${process.env.GIST_TOKEN}`
        },
        cache: 'no-store' // do not cache request
    })
    return response.json()
}


/**
 * Helper function
 * Load all gists from a specific user
 * Authenticate using the GIST_TOKEN environment variable
 * @returns array of gists
 */
export const loadUserGists = async () => {
    try {
        const gist = await fetch('https://api.github.com/gists', {
            method: 'GET',
            headers: {
                'Authorization': `token ${process.env.GIST_TOKEN}`
            },
            next: {
                tags: ['dashboards']
            },
            // cache: 'no-store' // do not cache request
        })
        return await gist.json()
    }
    catch (error) {
        console.error(error)
        return []
    }
}