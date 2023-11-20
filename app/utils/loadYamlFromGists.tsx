/**
 * Load list of dashboard from Github Gist
 * @returns array of dashboards
 */
export const loadAllYamlFromGists = async () => {
    const gistjson = await loadUserGists()
    if (!gistjson.length) {
        return {} // nothing found
    }
    // Reaching this point means we got a result from the Github API
    return gistjson
        // Filter out by file name not matching dashboard.*.yaml
        .filter((item: any) => Object.keys(item.files)[0].startsWith("dashboard.") && Object.keys(item.files)[0].endsWith(".yaml"))
        // Map results to object with human readable name, update date, and raw url
        .map((item : any) => {
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
 * Load a single YAML file from Github Gist
 * @param DashID ID of the dashboard to load
 * @returns raw text of dashboard.*.yaml
 */
export const loadOneYamlFromGists = async (DashID: string) => {
    // Load all gists from authenticated user
    const gistjson = await loadUserGists()
    if (!gistjson.length) {
        return undefined // nothing found
    }
    // Reaching this point means we got a result from the Github API
    // Filter out by file name not matching dashboard.<DashID>.yaml
    const yamlfiles = gistjson
        .filter((item : any) => Object.keys(item.files)[0] === `dashboard.${DashID}.yaml`)

    // return raw text of dashboard.*.yaml from Gist by fetching raw url from Github API
    const response = await fetch(yamlfiles[0].files[`dashboard.${DashID}.yaml`].raw_url, {
        method: 'GET',
        headers: {
            'Accept': 'text/plain',
            'Authorization': `token ${process.env.GIST_TOKEN}`
        },
        cache: 'no-store' // do not cache request
    })
    return response.text()
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