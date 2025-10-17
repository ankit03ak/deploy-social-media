import { useEffect, useState } from "react";
import "./chatonline.css";
import axios from "axios";
import { PF } from "../../config";

export default function ChatOnline( {onlineUsers, currentId,setCurrentChat} ) {

  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;



  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get("https://deploy-social-media-ap1.onrender.com/api/users/friends/" + currentId );
        setFriends(res.data);
      } catch (error) {
        console.log(error.message)
      }
    }
    getFriends();
  },[currentId])



  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);
  



  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `https://deploy-social-media-ap1.onrender.com/api/conversations/find/${currentId}/${user._id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      { onlineFriends.map((o, index) => (

        <div key={index} className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
  className="chatOnlineImg"
  src={PF(o?.profilePicture) || PF("user/Blank-Avatar.png")}
  alt=""
/>
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName"> {o?.username} </span>
        </div>
        )) }
    </div>
  );
}
