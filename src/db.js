const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db/userManagementDB.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    createTables(db);
  }
});

const createTables = (db) => {
  db.run(
    `CREATE TABLE user (
              user_id INTEGER PRIMARY KEY AUTOINCREMENT,
              suffix text,
              firstname text, 
              lastname text,
              email text UNIQUE,
              dateofbirth text, 
              gender text,
              role text,
              CONSTRAINT email_unique UNIQUE (email)
              )`,
    (err) => {
      if (err) {
        // Table already created
        console.log("user table exists, not recreating the table");
      } else {
        // Table just created, creating some rows
        console.log("user table created");
        // const insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
        // db.run(insert, ["admin", "admin@example.com", md5("admin123456")])
        // db.run(insert, ["user", "user@example.com", md5("user123456")])
      }
    }
  );

  db.run(
    `CREATE TABLE contact (
              contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
              contact text UNIQUE,
              type text,
              CONSTRAINT contact_unique UNIQUE (contact)
              )`,
    (err) => {
      if (err) {
        // Table already created
        console.log("contact table exists, not recreating the table");
      } else {
        // Table just created, creating some rows
        console.log("contact table created");
      }
    }
  );

  db.run(
    `CREATE TABLE user_contacts (
              user_id INTEGER,
              contact_id INTEGER,
              PRIMARY KEY (user_id, contact_id),
              FOREIGN KEY (user_id) 
              REFERENCES user (user_id) 
                 ON DELETE CASCADE 
                 ON UPDATE NO ACTION,
              FOREIGN KEY (contact_id) 
                 REFERENCES contact (contact_id) 
                    ON DELETE CASCADE 
                    ON UPDATE NO ACTION
              )`,
    (err) => {
      if (err) {
        // Table already created
        console.log("user_contacts table exists, not recreating the table");
      } else {
        // Table just created, creating some rows
        console.log("user_contacts table created");
      }
    }
  );
};

module.exports = db;
