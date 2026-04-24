import Dexie from 'dexie';

import Queue from "~/util/Queue";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function onDbInit(event) {
    console.log("Database initialized", event);
}

function Db(name) {

    let db = new Dexie(name);

    this.name = name;

    let relationsCount = 0;
    let processedCount = 0;

    let dbVersion = 0;
    let processQueue = new Queue();

    function getDbVersion() {

        return new Promise((resolve, reject) => {

            const request = window.indexedDB.open(name);

            function resolveVersion() {
                const dbVersion = request.result.version;
                request.result.close();
                resolve(dbVersion);
            }

            request.onsuccess = resolveVersion;
            request.onupgradeneeded = resolveVersion;
            request.onerror = function (event) { reject(event);  };
        });
    }

    const createObjectStore = function(storeName, version, options) {

        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(name, version);

            request.onsuccess = function (event) {
                // store the result of opening the database in the db variable.
                const db = event.target.result;

                console.log("Closing the object store", storeName);

                // close the database
                db.close();

                resolve(db);
            };

            request.onupgradeneeded = function(event) {

                const db = event.target.result;

                // Create an objectStore for this database
                const objStore = db.createObjectStore(storeName, options);
                console.log("OBJECT STORE CREATED", objStore);

                objStore.transaction.oncomplete = resolve;
                objStore.transaction.onerror = reject;
            };

            request.onerror = function (event) {
                console.error("Error opening database", event);
                reject(event.target);
            };
        });
    };

    async function processNext() {

        if (processQueue.isEmpty()) {
            return;
        }

        let r = processQueue.dequeue();

        try {

            //const conn = await db.open();
            //dbVersion = conn.verno * 10 + 1;

            if (db.isOpen()) { db.close(); }

            dbVersion = await getDbVersion();

            await createObjectStore(r.name, dbVersion + 1, { autoIncrement: true});

            //db.version(dbVersion+1).stores({ [r.name]: "++" });
            console.log(`IndexedDb (${name}) v${dbVersion}, added object store "${r.name}"`);

            await db.open();
            const table = db.table(r.name);
            let lastKey = await table.bulkAdd(r.instances);

            /*
            var objStore = db.transaction("customers", "readwrite").objectStore("customers");
            customerData.forEach(function (customer) {
                customerObjectStore.add(customer);
            });
            */
            console.log(`IndexedDb (${db.name}) relation ${r.name} loaded (${lastKey} instances).`);

            processedCount++;

        } catch (e) {
            console.error("Open failed: " + e.stack);
            processedCount++;
        }

    }

    /**
     * Add relation table and data into an IndexedDb.
     */
    this.addRelation = async function (relation) {

        relationsCount++;

        console.log(`*** ADDING RELATION #${relationsCount}`, relation.name);
        processQueue.enqueue(relation);

        if (relationsCount - processedCount == 1) {
            while (!processQueue.isEmpty()) {
                try {
                    await processNext();
                } catch (err) {
                    console.error("Table population error:", err, "relation", relation);
                }
            }
        }
    }
}

const appConfig = new Dexie('AppConfiguration');

appConfig.version(1).stores({
    relations: "name",
    appSettings: "",
    userSettings: ""
});

const relationsData = new Db('Relations');


export {
    appConfig,
    relationsData
};
