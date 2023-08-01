const express = require ('express');
const app = express();
const port =  process.env.PORT || 3001; 
const path = require('path')
const fs = require('fs')


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

//create
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')))

  res.json(notes)

})

// post 
app.post('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')))
  const newNote = req.body; 
  newNote.id = parseInt(Math.random() * 1000);
 //const newNote = { title: req.body.title, text: req.body.text, id: parseInt(Math.random() * 1000) };
  console.log ("new note: "+JSON.stringify( newNote))
  notes.push(newNote);
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes))
  res.json(newNote)
})

// delete 
app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')))
  const idToDelete = req.params.id;
  console.log("Id they want is "+idToDelete);
  const noteIndex = notes.findIndex((note) => note.id == idToDelete);

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'error' });
  }

  notes.splice(noteIndex, 1);

  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));
  res.json({ message: 'note deleted successfully' });
})


app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../public/index.html')) })
app.get('/notes', (req, res) => { res.sendFile(path.join(__dirname, '../public/notes.html')) })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

