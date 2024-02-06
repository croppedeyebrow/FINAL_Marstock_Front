const WebSocketComponent = (roomId, name, type) => {
  const socket = new WebSocket(
    `ws://localhost:8111/ws/marstock?room=${roomId}&name=${name}&type=${type}`
  );
  console.log(socket.url);

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const message = event.data;
    // console.log(message);
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
  };

  // WebSocket 객체 반환
  return socket;
};

export default WebSocketComponent;