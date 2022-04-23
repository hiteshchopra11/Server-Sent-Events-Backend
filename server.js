const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/status', (request, response) => response.json({ clients: clients.length }));

const PORT = process.env.PORT || 3000;

let clients = [];
let events = [];

app.listen(PORT, () => {
    console.log(`Events service starting`)
})

function eventsHandler(request, response, next) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
  
    const data = `data: ${JSON.stringify(events)}\n\n`;
  
    response.write(data);
  
    const clientId = Date.now();
  
    const newClient = {
      id: clientId,
      response
    };
  
    clients.push(newClient);
  
    request.on('close', () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter(client => client.id !== clientId);
    });
  }
  
app.get('/events', eventsHandler);

function sendEventsToAll(newEvent) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(newEvent)}\n\n`))
}

async function addnewEvent(request, respsonse, next) {
    req.setTimeout(500000);
    const newEvent = request.body;
    events.push(newEvent);
    respsonse.json(newEvent)
    return sendEventsToAll(newEvent);
}

app.post('/event', addnewEvent);