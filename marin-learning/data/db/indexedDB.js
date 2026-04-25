import Dexie from 'dexie';

import Queue from "~/util/Queue";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function onDbInit(event) {
    console.log("Database initialized", event);
}

function getConnection(name) {
    const request = window.indexedDB.open(name, dbVersion);
    request.onsuccess = onDbInit;
    request.onupgradeneeded = onDbInit;
    request.onerror = function(event) {
        console.error("Error opening database", event);
    };
}


function Db(name) {

    let relationsCount = 0;
    let processedRelation = 0;

    const dexieDb = new Dexie(name);

    let isReady = true;
    let retryProcessId = 0;


    const processQueue = new Queue();

    async function processNext() {

        if (processQueue.isEmpty()) {
            return;
        }

        let r = processQueue.dequeue();
        /*
        if (db.isOpen()) {
            db.close();
            console.log("CLOSING DATABASE ...", !db.isOpen());
        }
        */

        try {

            const dbConn = getConnection(name);

            //await db.version(1).stores({ [r.name]: "++" });

            var objStore = db.createObjectStore("names", { autoIncrement: true });

            console.log("*** CREATED RELATION STORE", r.name);

            await db.open();
            isReady = false;

            const table = db[r.name];
            console.log("Opened Table:", table);

            await db.transaction('rw?', table, async () => {
                let lastKey = await table.bulkAdd(r.instances);

                console.log("*** RELATION LOADED ", lastKey, "instances for", r);
                console.log("*** PROCESSING NEXT RELATION", processQueue.peek());
            });

            processedRelation++;

            try {
                await processNext();
            } catch (err) {
                console.error("Table population error:", err, "relation", r);
            }

        } catch (e) {

            processedRelation++;
            console.error("Open failed: " + e.stack);
        }

    }


    this.addRelation = async function (relation) {

        relationsCount++;

        const notBusy = processQueue.isEmpty();

        console.log(`*** ADDING RELATION #${relationsCount}`, relation.name);
        processQueue.enqueue(relation);

        if ((relationsCount - processedRelation) === 1) {

            console.log(`*** READY TO ADD RELATION #${relationsCount}`, relation.name);

            //await processNext();
        } else {

            console.log(`*** RELATION #${relationsCount}`, relation.name, "has been queued");
        }
    }

}

const appConfig = {}

/*
appConfig.version(1).stores({
    relations: "name",
    appSettings: "",
    userSettings: ""
});
*/
const relationsData = new Db('Relations');


export {
    appConfig,
    relationsData
};

/*

    let retries = 0;
    const retryProcessId = setInterval(() => {

        console.log("*** RETRYING", retries, "times for relation", relation);

        if (retries > 1000 || !relationsData.isOpen()) {
            if (relationsData.processQueue.isEmpty()) {

                relationsData.version(1).stores({ [relation.name]: "++" });
                relationsData.open().then(() => {
                    const table = relationsData.table(relation.name);
                    return table.bulkAdd(r.instances)
                        .then(() => {
                            console.log("*** RELATION LOADED", r);
                            relationsData.close();
                            return processNext(q);
                        });
                });
            } else {
                processNext(relationsData.processQueue).then(() => {
                    clearInterval(retryProcessId)
                });
            }
        } else {
            retries++;
        }
    }, 100);

*/
