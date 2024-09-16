const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('dist'))
const now = new Date();

const PORT = 3001

let notes = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(notes);
})

app.get('/info',(request,response)=>{
  response.send(`<p>Phonebook has info for ${notes.length} people</p><p>${now.toString()}</p>`)
})

app.get('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id) 
  const note = notes.find(note => note.id === id)
  if(note){
    response.json(note)
  }else{
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request,response) => {
  const id = Math.floor(Math.random()* 100) + 1;
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or Number Missing'
    })
  }
  if (notes.some(note => note.name === body.name)) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }
  const note = {
    name: body.name,
    number: body.number,
    id : id,
  } 
  notes = notes.concat(note);
  response.json(note)
})



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
