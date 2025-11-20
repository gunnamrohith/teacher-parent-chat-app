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

fetch('/api/students').then(res => res.json()).then(data => {
  data.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.name;
    studentSelect.appendChild(opt);
  });
});

enterChatBtn.onclick = async () => {
  studentId = studentSelect.value;
  senderName = nameInput.value.trim();
  senderRole = roleSelect.value;
  if (!studentId || !senderName) return alert('Please enter all details');
  document.getElementById('setup').classList.add('hidden');
  chatDiv.classList.remove('hidden');
  chatTitle.textContent = `${senderRole} chatting for ${studentSelect.options[studentSelect.selectedIndex].text}`;

  const res = await fetch(`/api/messages/${studentId}`);
  const messages = await res.json();
  messagesDiv.innerHTML = messages.map(m => formatMessage(m)).join('');
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  socket.emit('joinStudentRoom', studentId);
};

sendBtn.onclick = () => {
  const message = messageInput.value.trim();
  if (!message) return;
  socket.emit('chatMessage', { studentId, senderName, senderRole, message });
  messageInput.value = '';
};

socket.on('chatMessage', msg => {
  messagesDiv.innerHTML += formatMessage(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

function formatMessage(m) {
  const ts = m.timestamp ? new Date(m.timestamp) : new Date();
  const timeStr = ts.toLocaleTimeString();

  // Add a CSS class based on the role
  const roleClass = m.sender_role === 'Teacher' ? 'teacher' : 'parent';

  return `
    <div class="message ${roleClass}">
      <div><b>${m.sender_name} (${m.sender_role}):</b> ${m.message}</div>
      <div class="meta">${timeStr}</div>
    </div>
  `;
}