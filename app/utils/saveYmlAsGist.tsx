// create gist object to save ymlstring, using GIST_TOKEN to authenticate, and GIST_PUBLIC to set public/private
// return gist object
export const saveYmlAsGist = async (dashID: string, ymlstring: string, notprivate: boolean) => {
    const filename = `dashboard.${dashID}.yaml`;
    let data = {};
    const gist = await fetch('https://api.github.com/gists', {
        method: 'POST',
        body: JSON.stringify({
            description: `Dashboard config for '${dashID}'`,
            public: notprivate,
            files: {
                ...data,
                [filename]: {
                    content: ymlstring
                }
            }
        }),
        headers: {
            'Authorization': `token ${process.env.GIST_TOKEN}`
        }
    });
    console.log(gist)
    return gist
}
