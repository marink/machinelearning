import Dexie from 'dexie';

const db = new Dexie('ml-explorer');

db.version(1).stores({
  recent: 'name, savedAt',  // name is primary key — re-loading same file updates in place
});

export default db;
