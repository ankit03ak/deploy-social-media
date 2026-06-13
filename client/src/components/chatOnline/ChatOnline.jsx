import { useEffect, useState } from "react";
import "./chatonline.css";
import { PF } from "../../config";
import { findConversation, getFriendsByUserId } from "../../api/postApi";
import { includesId, sameId } from "../../utils/id";

export default function ChatOnline( {onlineUsers, currentId,setCurrentChat} ) {

  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;



  useEffect(() => {
    const getFriends = async () => {
      try {
        // const res = await axios.get("https://deploy-social-media-ap1.onrender.com/api/users/friends/" + currentId );
        const res = await getFriendsByUserId(currentId);
        setFriends(res.data);
      } catch (error) {
        console.log(error.message)
      }
    }
    getFriends();
  },[currentId])



  useEffect(() => {
    setOnlineFriends(
      friends.filter(
        (friend) =>
          friend &&
          !sameId(friend._id, currentId) &&
          includesId(onlineUsers, friend._id)
      )
    );
  }, [friends, onlineUsers, currentId]);
  



  const handleClick = async (user) => {
    try {
      // const res = await axios.get(
      //   `https://deploy-social-media-ap1.onrender.com/api/conversations/find/${currentId}/${user._id}`
      // );
      const res = await findConversation(currentId, user._id);
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      <span className="chatOnlineTitle">Online Users</span>

  {onlineFriends.length === 0 && (
    <span className="chatOnlineEmpty">No users online</span>
  )}
      { onlineFriends.map((o) => (

        <div key={o._id} className="chatOnlineFriend" onClick={() => handleClick(o)}>
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
