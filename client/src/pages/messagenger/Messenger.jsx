// import "./messenger.css";
// import Topbar from "../../components/topbar/Topbar";
// import Conversation from "../../components/conversation/Conversation";
// import Message from "../../components/message/Message";
// import ChatOnline from "../../components/chatOnline/ChatOnline";
// import { useContext, useEffect, useRef, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import axios from "axios";
// import { io } from 'socket.io-client';

// export default function Messenger() {
//     const [conversations, setConversations] = useState([]);
//     const [currentChat, setCurrentChat] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [arrivalMessage, setArrivalMessage] = useState(null);
//     const [onlineUsers, setOnlineUsers] = useState([]);
//     const [selectedUser, setSelectedUser] = useState([]);
//     const socket = useRef();
//     const { user } = useContext(AuthContext);
//     const scrollRef = useRef();

//     // Handle receiving new messages via socket
//     useEffect(() => {
//         if (arrivalMessage && currentChat?.members.includes(arrivalMessage.senderId)) {
//             setMessages((prev) => [...prev, arrivalMessage]);
//         }
//     }, [arrivalMessage, currentChat]);

//     // Initialize socket connection
//     // useEffect(() => {
//     //     socket.current = io("https://deploy-social-media-socket1.onrender.com");

//     //     socket.current.on("getMessage", (data) => {
//     //         console.log("Received Message via Socket:", data); // Log the data
//     //         setArrivalMessage({
//     //             senderId: data.senderId,
//     //             text: data.text,
//     //             createdAt: Date.now(),
//     //         });
//     //     });

//     //     return () => {
//     //         socket.current.disconnect();
//     //     };
//     // }, []);

//     useEffect(() => {
//         socket.current = io("wss://deploy-social-media-socket1.onrender.com");
    
//         socket.current.on("getMessage", (data) => {
//             console.log("Received Message via Socket:", data);
//             setArrivalMessage({
//                 senderId: data.senderId,
//                 text: data.text,
//                 createdAt: Date.now(),
//             });
//         });
    
//         return () => {
//             socket.current.disconnect();
//         };
//     }, []);
    

//     // Handle online users
//     useEffect(() => {
//         if (user._id) {
//             socket.current.emit("addUser", user._id);
//             socket.current.on("getUsers", (users) => {
//                 setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)));
//             });
//         }
//     }, [user]);

//     // Fetch conversations
//     useEffect(() => {
//         const getConversations = async () => {
//             try {
//                 const res = await axios.get(`https://deploy-social-media-ap1.onrender.com/api/conversations/${user._id}`);
//                 console.log("Conversations Response:", res.data); // Log the response data
//                 if (Array.isArray(res.data)) {
//                     setConversations(res.data);
//                 } else {
//                     console.error("Expected an array for conversations but got:", res.data);
//                 }
//             } catch (error) {
//                 console.log("Error fetching conversations:", error.message);
//             }
//         };
//         getConversations();
//     }, [user._id]);

//     // Fetch messages for the current chat
//     useEffect(() => {
//         if (currentChat?._id) {
//             const getMessages = async () => {
//                 try {
//                     const res = await axios.get(`https://deploy-social-media-ap1.onrender.com/api/messages/${currentChat._id}`);
//                     console.log("Messages Response:", res.data); // Log the response data
//                     if (Array.isArray(res.data)) {
//                         setMessages(res.data);
//                     } else {
//                         console.error("Expected an array for messages but got:", res.data);
//                         setMessages([]); // Optionally reset the messages
//                     }
//                 } catch (error) {
//                     console.log("Error fetching messages:", error.message);
//                 }
//             };
//             getMessages();
//         }
//     }, [currentChat]);

//     // Scroll to the bottom of the chat when new messages arrive
//     useEffect(() => {
//         scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     // Handle sending a new message
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const message = {
//             senderId: user._id,
//             text: newMessage,
//             conversationId: currentChat._id,
//         };

//         const receiverId = currentChat.members.find(member => member !== user._id);

//         socket.current.emit("sendMessage", {
//             senderId: user._id,
//             receiverId,
//             text: newMessage,
//         });

//         try {
//             const res = await axios.post("https://deploy-social-media-ap1.onrender.com/api/messages", message);
//             setMessages([...messages, res.data]);
//             setNewMessage("");
//         } catch (error) {
//             console.log("Error sending message:", error.message);
//         }
//     };

//     const handleConversationClick = async (c) => {
//         setCurrentChat(c);
//         const friendId = c.members.find((member) => member !== user?._id);
//         try {
//           const res = await axios.get(
//             "https://deploy-social-media-ap1.onrender.com/api/users?userId=" + friendId
//           );
//           setSelectedUser(res.data);
//         } catch (error) {
//           console.log("error during getting friend data for chatbox topbar");
//         }
//       };

//     return (
//         <>
//             <Topbar />
//             <div className="messenger">
//                 <div className="chatMenu">
//                     <div className="chatMenuWrapper">
//                         <input placeholder="Search for friends" className="chatMenuInput" />
//                         {conversations.map((c, index) => (
//                             // <div key={index} onClick={() => setCurrentChat(c)}>
//                             <div key={index} onClick={() => handleConversationClick(c)}>
//                                 <Conversation conversation={c} currentUser={user} />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="chatBox">
//                     <div className="chatBoxWrapper">
//                         {currentChat ? (
//                             <>
//                                 <div className="chatBoxTop">
//                                     {Array.isArray(messages) && messages.map((m, index) => (
//                                         <div key={index} ref={scrollRef}>
//                                             <Message message={m} own={m.senderId === user._id}/>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <div className="chatBoxBottom">
//                                     <textarea
//                                         className="chatMessageInput"
//                                         placeholder="Write something..."
//                                         onChange={(e) => setNewMessage(e.target.value)}
//                                         value={newMessage}
//                                     ></textarea>
//                                     <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
//                                 </div>
//                             </>
//                         ) : (
//                             <span className="noConversationText">Open a conversation to chat</span>
//                         )}
//                     </div>
//                 </div>
//                 <div className="chatOnline">
//                     <div className="chatOnlineWrapper">
//                         <ChatOnline
//                             onlineUsers={onlineUsers}
//                             currentId={user._id}
//                             setCurrentChat={setCurrentChat}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

import { useContext, useEffect, useRef, useState } from "react";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import Topbar from "../../components/topbar/Topbar";
import "./messenger.css";
import { AuthContext } from "../../context/AuthContext";
import { BsFillSendFill } from "react-icons/bs";
import { MdVideoCall } from "react-icons/md";
import { BiSolidPhoneCall } from "react-icons/bi";
import axios from "axios";
import { io } from "socket.io-client";

function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const { user } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();
  const Pf = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    // Initialize the socket connection once
    socket.current = io("wss://deploy-social-media-ap1.onrender.com");

    // Setup socket event listeners
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        senderId: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.senderId)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (user?._id) {
      // Emit user ID to server
      socket.current.emit("addUser", user._id);

      // Define a handler function for 'getUsers'
      
      };

      // Setup listener for 'getUsers' event
      socket.current.on("getUsers", (users)=>{
        setOnlineUsers(
          user.followings.filter((f) => users.some((user) => user.userId === f))
        )
      });

      // Cleanup the listener when the user changes or the component unmounts
      // return () => {
      //   socket.current.off("getUsers",users);
      // };
    
  }, [user]);
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          "https://deploy-social-media-ap1.onrender.com/api/conversation/" + user._id
        );
        setConversations(res.data);
      } catch (error) {
        console.log("error during posting conversation members");
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat) {
          const res = await axios.get(
            "https://deploy-social-media-ap1.onrender.com/api/messages/" + currentChat._id
          );
          setMessages(res.data);
        }
      } catch (error) {
        console.log("error during getting chat");
      }
    };
    getMessages();
  }, [currentChat]);

  const handleChatSubmitButton = async (e) => {
    e.preventDefault();
    const message = {
      conversationId: currentChat._id,
      senderId: user._id,
      text: newMessage,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    // Immediately update the UI with the new message
    setMessages((prev) => [...prev, message]);

    // Emit message through socket
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    
    });

    try {
      setNewMessage("");
      await axios.post("https://deploy-social-media-ap1.onrender.com/api/messages", message);
    } catch (error) {
      console.log("error while sending new messages", error);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleConversationClick = async (c) => {
    setCurrentChat(c);
    const friendId = c.members.find((member) => member !== user?._id);
    try {
      const res = await axios.get(
        "https://deploy-social-media-ap1.onrender.com/api/users?userId=" + friendId
      );
      setSelectedUser(res.data);
    } catch (error) {
      console.log("error during getting friend data for chatbox topbar");
    }
  };

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              className="chatMenuInput"
              placeholder="search for friends"
            />
            {conversations.map((c) => (
              <div key={c._id} onClick={() => handleConversationClick(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div
            className={currentChat ? "chatBoxTopbar" : "chatBoxTobarDisable"}
          >
            <div className="chatBoxTopbarLeft">
              <img
                src={
                  selectedUser
                    ? Pf + selectedUser.profilePicture
                    : "assets/b1.jpg"
                }
                alt=""
                className="chatBoxTopbarLeftImg"
              />
              <span className="chatBoxTopbarName">
                {selectedUser ? selectedUser.username : "Sandeep"}
              </span>
            </div>
            <div className="chatBoxTopbarRight">
              <MdVideoCall className="chatBoxTopbarRightVideo" />
              <BiSolidPhoneCall className="chatBoxTopbarRightCall" />
            </div>
          </div>
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div key={m._id} ref={scrollRef}>
                      <Message own={m.senderId === user._id} message={m} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmitButton(e);
                      }
                    }}
                  ></textarea>
                  <button
                    className="chatSubmitButton"
                    onClick={handleChatSubmitButton}
                    type="submit"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Start a Conversation
                <BsFillSendFill className="noConversationImg" />
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              setCurrentChat={setCurrentChat}
              currentId={user._id}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger;