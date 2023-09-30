const fetch = require("node-fetch");
const pjson = require('./../../package.json');
const NPM_REGISTRY_URL = `https://registry.npmjs.org/${pjson.name}`;

function displayUpdateMessage() {
    console.log(`
------------------[${pjson.name}]------------------
You're not using the last version
Do "npm update ${pjson.name}" to get the new features
------------------------------------------------------
    `);
}

fetch(NPM_REGISTRY_URL)
.then(res => {
    if (!res.ok) {
        throw new Error('Failed to fetch the package info from npm registry');
    }
    return res.json();
})
.then(json => {
    if (pjson.version !== json['dist-tags']?.latest && pjson.version !== json['dist-tags']?.development) {
        displayUpdateMessage();
    }
})
.catch(err => console.error(`[ERROR] Graphsboard: ${err.message}`));