
import { useEffect, useState } from "react";
import "./conversation.css";
import axios from "axios";
import { PF } from "../../config";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios(`https://deploy-social-media-ap1.onrender.com/api/users?userId=${friendId}`);
        setUser(res.data);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    if (friendId) {
      getUser();
    }
  }, [currentUser, conversation]);

  // Ensure user is not null before accessing properties
  // const profilePictureUrl =
  //  user?.profilePicture
  //   ? `${PF}${user.profilePicture}`
  //   : 
  //   `${PF}user/Blank-Avatar.png`;

  const profilePictureUrl = PF(user?.profilePicture) || PF("user/Blank-Avatar.png");

  return (
    <div className="conversation">
      <img
  className="conversationImg"
  src={profilePictureUrl}
  alt=""
/>
      <span className="conversationName">{user?.username || 'user Unknown'}</span>
    </div>
  );
}
