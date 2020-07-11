const createContactEndpoints = (app, db) => {
  console.log("Creating Contact Endpoints ");
  app.get("/users/:userId/contacts", (req, res, next) => {
    const sql = `select c.* from user_contacts uc, contact c 
    where c.contact_id = uc.contact_id and uc.user_id = ?`;
    const params = [req.params.userId];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows,
      });
    });
  });

  app.get("/users/:userId/contacts/:contactId", (req, res, next) => {
    const sql = `select c.* from user_contacts uc, contact c 
    where c.contact_id = uc.contact_id and uc.user_id = ? and c.contact_id=?`;
    const params = [req.params.userId, req.params.contactId];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows,
      });
    });
  });

  const validateContactRequest = (req) => {
    const errors = [];
    if (!req.body.contact) {
      errors.push("No contact specified");
    }
    if (!req.body.type) {
      errors.push("No type specified");
    }
    return errors;
  };

  app.put("/users/:userId/contacts/:contactId", (req, res, next) => {
    console.log("Put request for ", req.params.userId, req.params.contactId);
    const data = {
      type: req.body.type,
      contact: req.body.contact,
    };
    db.run(
      `UPDATE contact set 
           type = coalesce(?,type), 
           contact = coalesce(?,contact)
           WHERE contact_id = (select uc.contact_id from user_contacts uc where uc.user_id = ? and uc.contact_id = ?)`,
      [data.type, data.contact, req.params.userId, req.params.contactId],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).json({ error: res.message });
          return;
        }
        res.json({
          message: "success",
          data: data,
        });
      }
    );
  });

  app.post("/users/:userId/contacts", (req, res, next) => {
    const errors = validateContactRequest(req);
    if (errors.length) {
      res.status(400).json({ error: errors.join(",") });
      return;
    }
    const data = {
      contact: req.body.contact,
      type: req.body.type,
    };
    const sql = "INSERT INTO contact (contact, type) VALUES (?,?)";
    const params = [data.contact, data.type];
    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      const data = {
        contact_id: this.lastID,
        user_id: req.params.userId,
      };
      const sql =
        "INSERT INTO user_contacts (user_id, contact_id) VALUES (?,?)";
      const params = [data.user_id, data.contact_id];

      db.run(sql, params, function (err, result) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({
          message: "success",
          data: data,
          id: data.contact_id,
        });
      });
    });
  });

  app.delete("/users/:userId/contacts/:contactId", (req, res, next) => {
    console.log(
      "Trying to delete the user with id:",
      req.params.userId,
      req.params.contactId
    );
    db.run(
      "DELETE FROM contact WHERE contact_id = (select uc.contact_id from user_contacts uc where uc.user_id = ? and uc.contact_id = ?)",
      [req.params.userId, req.params.contactId],
      function (err, result) {
        if (err) {
          console.log(err);
          res.status(400).json({ error: res.message });
          return;
        }
        res.json({ message: "deleted", changes: this.changes });
      }
    );
  });
};

module.exports = createContactEndpoints;
