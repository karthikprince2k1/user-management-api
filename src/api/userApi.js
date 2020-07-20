const createUserEndpoints = (app, db) => {
  console.log("Creating User Endpoints ");
  app.get("/users", (req, res, next) => {
    const sql = "select * from user";
    const params = [];
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

  app.get("/users/:userId", (req, res, next) => {
    const sql = "select * from user where user_id = ?";
    const params = [req.params.userId];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: row,
      });
    });
  });

  const validateUserRequest = (req) => {
    const errors = [];
    if (!req.body.suffix) {
      errors.push("No suffix specified");
    }
    if (!req.body.firstname) {
      errors.push("No firstname specified");
    }
    if (!req.body.lastname) {
      errors.push("No lastname specified");
    }
    if (!req.body.email) {
      errors.push("No email specified");
    }
    if (!req.body.dateofbirth) {
      errors.push("No dateofbirth specified");
    }
    if (!req.body.gender) {
      errors.push("No gender specified");
    }
    if (!req.body.role) {
      errors.push("No role specified");
    }
    return errors;
  };

  app.put("/users/:userId", (req, res, next) => {
    console.log("Put request for ", req.params.userId);
    var data = {
      suffix: req.body.suffix,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      dateofbirth: req.body.dateofbirth,
      gender: req.body.gender,
      role: req.body.role,
    };
    db.run(
      `UPDATE user set 
           suffix = coalesce(?,suffix), 
           firstname = coalesce(?,firstname), 
           lastname = coalesce(?,lastname), 
           email = coalesce(?,email), 
           dateofbirth = coalesce(?,dateofbirth), 
           gender = COALESCE(?,gender), 
           role = coalesce(?,role) 
           WHERE user_id = ?`,
      [
        data.suffix,
        data.firstname,
        data.lastname,
        data.email,
        data.dateofbirth,
        data.gender,
        data.role,
        req.params.userId,
      ],
      (err, result) => {
        if (err) {
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

  app.post("/users/", (req, res, next) => {
    var errors = validateUserRequest(req);
    if (errors.length) {
      res.status(400).json({ error: errors.join(",") });
      return;
    }
    var data = {
      suffix: req.body.suffix,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      dateofbirth: req.body.dateofbirth,
      gender: req.body.gender,
      role: req.body.role,
    };
    var sql =
      "INSERT INTO user (suffix, firstname, lastname, email, dateofbirth, gender, role) VALUES (?,?,?,?,?,?,?)";
    var params = [
      data.suffix,
      data.firstname,
      data.lastname,
      data.email,
      data.dateofbirth,
      data.gender,
      data.role,
    ];
    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: data,
        id: this.lastID,
      });
    });
  });

  app.delete("/users/:userId", (req, res, next) => {
    console.log("Trying to delete the user with id:", req.params.userId);
    db.run("DELETE FROM user WHERE user_id = ?", req.params.userId, function (
      err,
      result
    ) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    });
  });
};

module.exports = createUserEndpoints;
