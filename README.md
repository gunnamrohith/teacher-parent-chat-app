# Teacher ↔ Parent Chat App

A minimal real-time chat prototype for a teacher and a parent to talk **per selected student**. All messages are stored in a local SQLite database.

## Features
- Realtime teacher-parent chat per student (Socket.IO)
- Messages saved to SQLite (`chat.db` auto-created)
- Minimal UI (HTML/CSS/JS) you can extend
- Beginner-friendly stack: Node.js + Express + Socket.IO + SQLite

## Quickstart
1. Install **Node.js v18+**.
2. In this folder:  
   ```bash
   npm install
   npm start
   ```
3. Open **http://localhost:3000** in **two** browser windows/tabs:  
   - **Window A:** select `Teacher`, pick a student (e.g., *Aarav Sharma*), enter a display name.  
   - **Window B:** select `Parent`, pick the **same** student, enter a display name.
4. Chat! Messages appear in real time and are saved to `chat.db`.

## Project Structure
```
teacher-parent-chat-app/
├─ server.js
├─ package.json
├─ public/
│  ├─ index.html
│  ├─ style.css
│  └─ app.js
└─ chat.db (created on first run)
```

## Next Steps (ideas)
- Add login (so each parent only sees their child)
- Typing indicators / unread counts
- Attachments (images / PDFs)
- Export conversation to PDF
- Deploy to Railway/Render with managed DB
