"use strict";
console.log('bootstrap.js');
/*
    known issues:
        - id's can get out of sync
        - relationships of seeded data can get out of sync
        - use the admin/dashboard gui to re-stitch together
            - e.g. make sure Readings have an Author and a Spread
            - e.g. make sure Spreads have Position(s)
        - this can cause render errors on the front-end

 */
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const seedDataFile = "bootstrap-data.json";
const {
    global,
    homepage,
    positions,
    spreads,
    readings,
    users,
} = require(`../../data/${seedDataFile}`);

const isFirstRun = async () => {
    console.log('isFirstRun()');
    const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: "type",
        name: "setup"
    });
    // check for init
    const initHasRun = await pluginStore.get({key: "initHasRun"});
    console.log(`  initHasRun: ${initHasRun}`);
    // set init
    await pluginStore.set({key: "initHasRun", value: true});
    return !initHasRun;
};

module.exports = async () => {
    // console.log("bootstrap.exports()");
    const doSeedData = await isFirstRun();
    console.log(`  doSeedData: ${doSeedData}`);

    if (doSeedData) {
        // when is doSeedData/isFirstRun() ever true?
        // if (true) {
        console.log("  seeding data......")
        try {
            console.log("    loading bootstrap data...");
            // strapi.connections.default.raw('ALTER TABLE de2vqr3rt3v6rc.spreads AUTO_INCREMENT=1;')
            // strapi.connections.default.raw('ALTER TABLE de2vqr3rt3v6rc.readings AUTO_INCREMENT=1;')
            // strapi.connections.default.raw('ALTER TABLE de2vqr3rt3v6rc.users AUTO_INCREMENT=1;')
            // await importSeedData();
            console.log("  (seeding disabled) !")
            console.log("  seeding data complete.");
        } catch (error) {
            console.log("  seeding data failed..");
            console.error(error);
        }

    }
};

async function importSeedData() {
    // console.log('importSeedData()');
    // Allow read of application content types
    await setPublicPermissions({
        global: ["find"],
        homepage: ["find"],
        position: ["find", "findone"],
        spread: ["find", "findone"],
        reading: ["find", "findone"],
        user: ["find", "findone", "me"],
    });

    // Create all entries
    await importGlobal();
    await importHomepage();
    await importPositions();
    await importSpreads();
    await importReadings();
    await importUsers();
}

// Create an entry and attach files if there are any
async function createEntry({model, entry, files}) {
    // console.log(`  createEntry()`);
    // console.log(`    model: ${model}`);
    // console.log(`    entry:`);
    // console.log(entry);
    // console.log(`    files:`);
    // console.log(files);
    try {
        const createdEntry = await strapi.query(model).create(entry);
        // console.log(`    checking files...`);
        if (files) {
            await strapi.entityService.uploadFiles(createdEntry, files, {
                model,
            });
        }
    } catch (e) {
        console.log(`    createEntry encountered an error`);
        console.log(e);
    }
}

// global
async function importGlobal() {
    // console.log('--importGlobal()');
    const files = {
        favicon: getFileData("favicon.png"),
        "defaultSeo.shareImage": getFileData("default-image.png"),
    };
    return createEntry({model: "global", entry: global, files});
}

// homepage
async function importHomepage() {
    // console.log('importHomepage()');
    const files = {
        "seo.shareImage": getFileData("default-image.png"),
    };
    await createEntry({model: "homepage", entry: homepage, files});
}

// positions
async function importPositions() {
    // console.log('importPositions()');
    // try to reset id to 1
    // strapi.connections.default.raw('ALTER TABLE de2vqr3rt3v6rc.positions AUTO_INCREMENT=1;')
    // strapi.connections.default.raw('ALTER TABLE "positions" AUTO_INCREMENT=1;')
    const knex = strapi.connections.default;
    // const result = await knex.raw('sequences;'); // doesn't work
    // const result1 = await knex.raw('ALTER SEQUENCE positions RESTART;'); // doesn't work
    // const result2 = await knex.raw('UPDATE positions SET id = DEFAULT;'); // doesn't work
    // const result = await knex('positions').where('prompt', 'Card of the month') // this works !


    // delete all
    // positions.map(async (position) => {
    //   const _id = position.id;
    //   console.log(`--_id: ${_id}`);
    //   // strapi.query('positions').delete({id: _id}); // doesn't work
    // });

    return Promise.all(
        positions.map(async (position) => {
            const files = {
                image: getFileData(`${position.image.url}`),
            };
            return createEntry({
                model: "positions",
                entry: position,
                files,
            });
        })
    );
}

// spreads
async function importSpreads() {
    // console.log('importSpreads()');
    return Promise.all(
        spreads.map(async (spread) => {
            const files = {
                image: getFileData(`${spread.image.url}`),
            };
            return createEntry({
                model: "spreads",
                entry: spread,
                files,
            });
        })
    );
}

// readings
async function importReadings() {
    // console.log('importReadings()');
    return Promise.all(
        readings.map(async (reading) => {
            const files = {
                image: getFileData(`${reading.image.url}`),
            };
            return createEntry({
                model: "readings",
                entry: reading,
                files,
            });
        })
    );
}

// users
async function importUsers() {
    // console.log('importUsers()');
    return Promise.all(
        users.map(async (user) => {
            if (user.image && user.image.url) {
                const files = {
                    image: getFileData(`${user.image.url}`),
                };
                return createUser({
                    entry: user, files,
                });
            } else {
                return createUser({
                    entry: user
                });
            }
        })
    );
}

// Create an entry and attach files if there are any
async function createUser({entry, files = undefined}) {
    // console.log(`  createUser()`);
    // console.log(`    entry:`);
    // console.log(entry);
    // console.log(`    files:`);
    // console.log(files);
    try {
        const createdUser = await strapi.plugins['users-permissions'].services.user.add(entry);
        // console.log(`    checking files...`);
        // await strapi.entityService.uploadFiles( createdUser, files, {'user',});
    } catch (e) {
        console.log(`    createUser() encountered an error`);
        console.log(e);
    }
}

// *************

async function setPublicPermissions(newPermissions) {
    // console.log('  setPublicPermissions()');
    // Find the ID of the public role
    const publicRole = await strapi
        .query("role", "users-permissions")
        .findOne({type: "public"});

    // List all available permissions
    const publicPermissions = await strapi
        .query("permission", "users-permissions")
        .find({
            type: ["users-permissions", "application"],
            role: publicRole.id,
        });

    // Update permission to match new config
    const controllersToUpdate = Object.keys(newPermissions);
    const updatePromises = publicPermissions
        .filter((permission) => {
            // Only update permissions included in newConfig
            if (!controllersToUpdate.includes(permission.controller)) {
                return false;
            }
            if (!newPermissions[permission.controller].includes(permission.action)) {
                return false;
            }
            return true;
        })
        .map((permission) => {
            // Enable the selected permissions
            return strapi
                .query("permission", "users-permissions")
                .update({id: permission.id}, {enabled: true});
        });
    await Promise.all(updatePromises);
}

function getFileSizeInBytes(filePath) {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats["size"];
    return fileSizeInBytes;
}

function getFileData(fileName) {
    // console.log('--getFileData()');
    const filePath = `./data/uploads/${fileName}`;

    // Parse the file metadata
    const size = getFileSizeInBytes(filePath);
    const ext = fileName.split(".").pop();
    const mimeType = mime.lookup(ext);

    return {
        path: filePath,
        name: fileName,
        size,
        type: mimeType,
    };
}

