// create gist object to save config string, using GIST_TOKEN to authenticate, and GIST_PUBLIC to set public/private
// return gist object
export const saveConfigAsGist = async (dashID: string, configstring: string, notprivate: boolean) => {
    const filename = `dashboard.${dashID}.json`;
    let data = {};
    const gist = await fetch('https://api.github.com/gists', {
        method: 'POST',
        body: JSON.stringify({
            description: `Dashboard config for '${dashID}'`,
            public: notprivate,
            files: {
                ...data,
                [filename]: {
                    content: configstring
                }
            }
        }),
        headers: {
            'Authorization': `token ${process.env.GIST_TOKEN}`
        }
    });
    return gist
}
