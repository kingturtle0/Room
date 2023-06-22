const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");

const room = document.querySelector("#room");
room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function changeRoomTitle(userCount) {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room [${roomName}] : ${userCount} users`;
}

function handleMessageSubmmit(event) {
  event.preventDefault();
  const input = room.querySelector("form input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom(userCount) {
  welcome.hidden = true;
  room.hidden = false;
  changeRoomTitle(userCount);
  const msgForm = room.querySelector("form");
  msgForm.addEventListener("submit", handleMessageSubmmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomInput = form.querySelector("#room-name");
  const nameInput = form.querySelector("#nick-name");
  socket.emit("enter_room", roomInput.value, nameInput.value, showRoom);
  roomName = roomInput.value;
  room.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, userCount) => {
  changeRoomTitle(userCount);
  addMessage(`${user} joined!`);
});

socket.on("bye", (user, userCount) => {
  changeRoomTitle(userCount);
  addMessage(`${user} left!`);
});

socket.on("new_message", (msg) => {
  addMessage(msg);
});

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
