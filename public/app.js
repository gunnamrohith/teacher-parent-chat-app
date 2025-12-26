const socket = io();

const studentSelect = document.getElementById('student');
const roleSelect = document.getElementById('role');
const nameInput = document.getElementById('name');
const enterChatBtn = document.getElementById('enterChat');

const chatDiv = document.getElementById('chat');
const chatTitle = document.getElementById('chatTitle');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

let studentId, senderName, senderRole;

/* Load students */
fetch('/api/students')
  .then(res => res.json())
  .then(data => {
    data.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name;
      studentSelect.appendChild(opt);
    });
  });

/* Enter chat */
enterChatBtn.onclick = async () => {
  studentId = studentSelect.value;
  senderName = nameInput.value.trim();
  senderRole = roleSelect.value;

  if (!studentId || !senderName) {
    alert('Please fill all details');
    return;
  }

  document.getElementById('setup').classList.add('hidden');
  chatDiv.classList.remove('hidden');

  chatTitle.textContent = `${senderRole} • ${studentSelect.options[studentSelect.selectedIndex].text}`;

  const res = await fetch(`/api/messages/${studentId}`);
  const messages = await res.json();

  messagesDiv.innerHTML = messages.map(formatMessage).join('');
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  socket.emit('joinStudentRoom', studentId);
};

/* Send message */
sendBtn.onclick = sendMessage;
messageInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  socket.emit('chatMessage', {
    studentId,
    senderName,
    senderRole,
    message
  });

  messageInput.value = '';
}

/* Receive message */
socket.on('chatMessage', msg => {
  messagesDiv.innerHTML += formatMessage(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

function formatMessage(m) {
  const ts = m.timestamp ? new Date(m.timestamp) : new Date();
  const time = ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const roleClass = m.sender_role === 'Teacher' ? 'teacher' : 'parent';

  return `
    <div class="message ${roleClass}">
      <strong>${m.sender_name}</strong><br/>
      ${m.message}
      <div class="meta">${time}</div>
    </div>
  `;
}