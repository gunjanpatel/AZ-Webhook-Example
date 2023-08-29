const Crypto = require('crypto');

module.exports = async function (context, req) {
    context.log('Got request from repo ' + req.body.repository.name);

    const hmac = Crypto.createHmac("sha1", "<function-key-secret>");
    const signature = hmac.update(JSON.stringify(req.body)).digest('hex');
    const shaSignature = `sha1=${signature}`;
    const gitHubSignature = req.headers['x-hub-signature'];

    if (!shaSignature.localeCompare(gitHubSignature)) {
        if (req.body.pages[0].title) {
            return context.res = {
                body: "Page is " + req.body.pages[0].title + ", Action is " + req.body.pages[0].action + ", Event Type is " + req.headers['x-github-event']
            };
        }

        return context.res = {
            status: 400,
            body: ("Invalid payload for Wiki event")
        };
    }

    return context.res = {
        status: 401,
        body: "Signature don't match"
    };
}
