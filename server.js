const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const dbFile = path.join(__dirname, 'chat.db');
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    sender_name TEXT,
    sender_role TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

const students = [
  { id: 1, name: 'rohith' },
  { id: 2, name: 'pranav' },
  { id: 3, name: 'charan' },
  { id: 4, name: 'mahesh' }
];

app.use(express.static('public'));
app.use(express.json());

app.get('/api/students', (req, res) => res.json(students));

app.get('/api/messages/:studentId', (req, res) => {
  const { studentId } = req.params;
  db.all('SELECT * FROM messages WHERE student_id = ? ORDER BY timestamp ASC', [studentId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

io.on('connection', socket => {
  socket.on('joinStudentRoom', studentId => socket.join(`student-${studentId}`));

  socket.on('chatMessage', msg => {
    const { studentId, senderName, senderRole, message } = msg;
    db.run('INSERT INTO messages (student_id, sender_name, sender_role, message) VALUES (?, ?, ?, ?)',
      [studentId, senderName, senderRole, message],
      function (err) {
        if (err) return console.error(err);
        io.to(`student-${studentId}`).emit('chatMessage', {
          id: this.lastID,
          student_id: studentId,
          sender_name: senderName,
          sender_role: senderRole,
          message,
          timestamp: new Date().toISOString()
        });
      });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
