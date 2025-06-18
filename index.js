const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Serve static frontend
app.use(express.static(path.join(__dirname, 'dist')))





let persons=[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/info", (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
})
app.get('/api/persons', (req, res) => {
  res.json(persons);
})
const generateId=()=>{
     return String(Math.floor(Math.random() * 1000000)); 
}
app.post('/api/persons', (req, res) => {

  const body = req.body
  if(!body.name || !body.number){
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  const person={
    name: body.name,
    number: body.number,
    id: generateId()
  }
 const nameExists = persons.some(p => p.name === person.name);
    if (nameExists) {
        return res.status(400).json({
        error: 'name must be unique'
        });
    }

  persons = persons.concat(person)

  res.json(person)
})
app.get('/api/persons/:id',(req,res)=>{
    const id = req.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
})
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});
// Fallback for React Router
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next(); // skip if it's an API route
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});