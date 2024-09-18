const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Note = require('./models/note');

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('dist'));

const PORT = process.env.PORT;

app.get('/api/persons', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes);
  });
});

app.get('/info', (request, response) => {
  Note.countDocuments({}).then(count => {
    const now = new Date();
    response.send(`<p>Phonebook has info for ${count} people</p><p>${now.toString()}</p>`);
  });
});

app.get('/api/persons/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    if (note) {
      response.json(note);
    } else {
      response.status(404).end();
    }
  }).catch(error => {
    console.log(error);
    response.status(400).send({ error: 'malformatted id' });
  });
});

app.delete('/api/persons/:id', (request, response) => {
  Note.findByIdAndRemove(request.params.id).then(() => {
    response.status(204).end();
  }).catch(error => {
    console.log(error);
    response.status(400).send({ error: 'malformatted id' });
  });
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or Number Missing'
    });
  }

  Note.findOne({ name: body.name }).then(existingNote => {
    if (existingNote) {
      return response.status(400).json({
        error: 'Name must be unique'
      });
    } else {
      const note = new Note({
        name: body.name,
        number: body.number,
      });

      note.save().then(savedNote => {
        response.json(savedNote);
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
