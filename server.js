const express = require("express");
const path = require("path");
const fs = require('fs');
var uuid = require('uuid');
const app = express()


const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let notes = fs.readFileSync('./db/db.json');
notes = JSON.parse(notes);

// Displays all notes
app.get("/api/notes", function (req, res) {
  return res.json(notes);
});

// Displays a single note, or returns false
app.get("/api/notes/:id", function (req, res) {
  var chosen = req.params.id;
  for (var i = 0; i < notes.length; i++) {
    if (chosen === notes[i].id) {
      return res.json(notes[i]);
    }
  }
  return res.json(false);
});

app.post("/api/notes", function (req, res) {
  const note = req.body;
  let uid = uuid.v4()
  note.id = uid.toString();
  notes.push(note);
  res.json(note);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 4));
});

app.delete("/api/notes/:id", function (req, res) {
  const chosen = req.params.id;
  notes = notes.filter(function (item) {
    return item.id !== chosen
  });
  res.json(notes);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 4));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

//  Listener
// ===========================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});