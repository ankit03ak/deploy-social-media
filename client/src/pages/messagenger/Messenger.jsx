import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { MdEmojiEmotions } from "react-icons/md";

import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef();

  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.senderId)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current = io("wss://deploy-social-media-socket1.onrender.com");

    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        senderId: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

const handleEmojiSelect = (emoji) => {
  setNewMessage((prev) => prev + emoji.native);
};

useEffect(() => {
  const handleClickOutside = (event) => {
    if (emojiRef.current && !emojiRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  useEffect(() => {
    if (user._id) {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(
          user.followings.filter((f) => users.some((u) => u.userId === f))
        );
      });
    }
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `https://deploy-social-media-ap1.onrender.com/api/conversations/${user._id}`
        );
        if (Array.isArray(res.data)) {
          setConversations(res.data);
        } else {
          console.error(
            "Expected an array for conversations but got:",
            res.data
          );
        }
      } catch (error) {
        console.log("Error fetching conversations:", error.message);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    if (currentChat?._id) {
      const getMessages = async () => {
        try {
          const res = await axios.get(
            `https://deploy-social-media-ap1.onrender.com/api/messages/${currentChat._id}`
          );
          // console.log("Messages Response:", res.data);
          if (Array.isArray(res.data)) {
            setMessages(res.data);
          } else {
            console.error("Expected an array for messages but got:", res.data);
            setMessages([]); 
          }
        } catch (error) {
          console.log("Error fetching messages:", error.message);
        }
      };
      getMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error("Please type a message before sending.");
      return;
    }
    const message = {
      senderId: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(
        "https://deploy-social-media-ap1.onrender.com/api/messages",
        message
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log("Error sending message:", error.message);
    }
  };

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations.length > 0 ? (
              conversations.map((c, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentChat(c)}
                  className={
                    currentChat?._id === c._id
                      ? "conversationWrapper active"
                      : "conversationWrapper"
                  }
                >
                  <Conversation conversation={c} currentUser={user} />
                </div>
              ))
            ) : (
              <span>No conversations available.</span>
            )}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                
                <div className="chatBoxTop">
                  {Array.isArray(messages) &&
                    messages.map((m, index) => (
                      <div key={index} ref={scrollRef}>
                        <Message
                          message={m}
                          own={m.senderId === user._id}
                          inComingUser={currentChat}
                        />
                      </div>
                    ))}
                </div>
                <div className="chatBoxBottom">
                  
<div className="emojisss" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
  <MdEmojiEmotions color="goldenrod" className="shareEmoji" />
</div>

{showEmojiPicker && (
  <div className="emojiPicker" ref={emojiRef}>
    <Picker data={emojiData} onEmojiSelect={handleEmojiSelect} />
  </div>
)}

<textarea
  className="chatMessageInput"
  placeholder="Write something..."
  onChange={(e) => setNewMessage(e.target.value)}
  value={newMessage}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
      setShowEmojiPicker(false);
    }
  }}
></textarea>



                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}
