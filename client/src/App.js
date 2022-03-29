import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import TextField from "@material-ui/core/TextField";
import "./App.css";

const socket = io.connect("http://localhost:4000");

function App() {
  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // 서버에서 message 이벤트를 받아 콜백함수를 통해 데이터를 처리한다.
    socket.on("message", ({ name, message }) => {
      // 기존의 채팅과 서버에서 받은 새로운 채팅으로 채팅 목록을 구성한다.
      setChat([...chat, { name, message }]);
    });
  });

  // 사용자 이름과, 사용자가 쓴 메시지의 상태를 바꿔준다.
  const onTextChange = (e) => {
    console.log(e.target.value);
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    // preventDefault=> 해당 이벤트에 대한 사용자 에이전트의 기본 동작을 실행하지 않도록 지정한다.
    // 이벤트 처리를 종료하고 form의 action 처리를 방지한다.
    // onsubmit 이벤트 =>  input 태그의 데이터를 서버에 전송하기 전 동작을 지정
    // onsubmit 이벤트가 종료된 후 action 처리를 방지한다.
    e.preventDefault();
    const { name, message } = state;
    // 아마 preventDefault를 사용하는 이유는 form 태그를 통해서 서버에 데이터를 전송하는 것이 아닌
    // socket.emit을 통해서 이벤트와 정보를 서버에 보내기 위해서이지 않을까 싶다! (나의 뇌피셜..)
    socket.emit("message", { name, message });
    setState({ message: "", name });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        {name}:<span>{message}</span>
      </div>
    ));
  };

  return (
    <div className="card">
      {/* form 안의 button을 클릭하면, onsubmit 에 들어있는 함수를 통해 동작을 처리한다. 
      이 때 onMessageSubmit함수를 넣어주었다. 
      ex) onSubmit="return test()" => test()라는 처리를 반환한다. 
       */}
      <form onSubmit={onMessageSubmit}>
        <h1>Message</h1>
        <div className="name-field">
          {/* <TextField
            name="name"
            onChange={(e) => onTextChange(e)}
            value={state.name}
            label="Name"
          /> */}
          <input
            type="text"
            // label="Name"
            // name 속성은 폼이 제출된 후 서버에서 폼 데이터를 참조하기 위해 사용된다고 한다.
            // 그러나 나같은 경우는 onTextChange를 지정해줄 때 name 속성값을 참조하여 name, 혹은 message를 지정하여 값을 바꾸어주는 것 같다.
            //
            name="name"
            id="outlined-multiline-static"
            onChange={(e) => onTextChange(e)}
            value={state.name || ""}
          ></input>
        </div>
        <div>
          {/* <TextField
            name="message"
            onChange={(e) => onTextChange(e)}
            value={state.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
          /> */}
          <input
            name="message"
            type="text"
            id="outlined-multiline-static"
            onChange={(e) => onTextChange(e)}
            value={state.message || ""}
          ></input>
        </div>
        <button>Send Message</button>
      </form>
      <div className="render-chat">
        <h1>Chat log</h1>
        {renderChat()}
      </div>
    </div>
  );
}

export default App;
