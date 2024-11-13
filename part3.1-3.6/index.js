const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
/* app.use(morgan('tiny')); */

// Custom token to log the body of POST requests
morgan.token('body', (req) => JSON.stringify(req.body));

// Configure Morgan to use the custom token in the 'tiny' format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = 
[
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

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});
// Delete person, if person is not found, return 404. 
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

// Add new person, if name or number is missing, return 400.
// POST request with validation and logging
app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    });
  }

  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    id: Math.floor(Math.random() * 1000),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);
  res.json(person);
});
  
app.get('/info', (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
  console.log(date);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
