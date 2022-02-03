const connection = require("../db-config");
const router = require("express").Router();

router.get("/", (req, res) => {
  connection.query("SELECT * FROM motos", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving motos from database");
    } else {
      res.json(result);
    }
  });
});

router.get("/:id", (req, res) => {
  const motoId = req.params.id;
  connection.query(
    "SELECT * FROM motos WHERE id = ?",
    [motoId],
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving moto from database");
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send("Moto not found");
      }
    }
  );
});

router.post("/", (req, res) => {
  const { marque, modele, prix } = req.body;
  connection.query(
    "INSERT INTO motos (marque, modele, prix) VALUES (?,?,?)",
    [marque, modele, prix],
    (err, result) => {
      if (err) {
        res.status(500).send("Error saving the moto");
      } else {
        const id = result.insertId;
        const createdMoto = { id, marque, modele, prix };
        res.status(201).json(createdMoto);
      }
    }
  );
});

router.put("/:id", (req, res) => {
  connection.query(
    "UPDATE motos SET ? WHERE id = ?",
    [req.body, req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a moto");
      } else {
        if (result.affectedRows) {
          const updatedMoto = {
            id: req.params.id,
            marque: req.body.marque,
            modele: req.body.modele,
            prix: req.body.prix,
          };
          res.status(200).json(updatedMoto);
        } else res.status(404).send("Moto not found.");
      }
    }
  );
});

// router.put("/:id", (req, res) => {
//   const godId = req.params.id;
//   const db = connection.promise();
//   let existingGod = null;
//   db.query("SELECT * FROM gods WHERE id = ?", [godId])
//     .then(([results]) => {
//       existingGod = results[0];
//       if (!existingGod) return Promise.reject("RECORD_NOT_FOUND");
//       return db.query("UPDATE gods SET ? WHERE id = ?", [req.body, godId]);
//     })
//     .then(() => {
//       res.status(200).json({ ...existingGod, ...req.body });
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err === "RECORD_NOT_FOUND")
//         res.status(404).send(`God with id ${godId} not found.`);
//       else res.status(500).send("Error updating a god");
//     });
// });

router.delete("/:id", (req, res) => {
  connection.query(
    "DELETE FROM motos WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error deleting a moto");
      } else {
        if (result.affectedRows) res.status(200).send("🎉 Moto deleted!");
        else res.status(404).send("Moto not found.");
      }
    }
  );
});

module.exports = router;
