import {useContext, useEffect, useState } from "react";
import "./message.css"
import {format} from "timeago.js"
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
export default function Message({message, own,inComingUser}) {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const {user} = useContext(AuthContext);

  const [inComingPP, setIncomingPP] = useState(null);

  
  useEffect(() => {
    const friendId = inComingUser.members.find((m) => m !== user._id);

    const getUser = async () => {
      try {
        const res = await axios(`https://deploy-social-media-ap1.onrender.com/api/users?userId=${friendId}`);
        setIncomingPP(res.data);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    if (friendId) {
      getUser();
    }
  }, [user, inComingUser]);


  

  const profilePictureUrl = own 
  ? (user?.profilePicture ? `${PF}${user?.profilePicture}` : `${PF}user/Blank-Avatar.png`)  // Current user's profile picture
  : (inComingPP?.profilePicture ? `${PF}${inComingPP?.profilePicture}` : `${PF}user/Blank-Avatar.png`);  // Sender's profile picture



// console.log("user:", user);
// console.log("Profile picture URL:", profilePictureUrl);




  return (
    <div className={own ? "message own" : "message"}>
        <div className="messageTop">
            <img
            className="messageImg" 
            // src={ message?.profilePicture ? PF + message?.profilePicture : PF+"user/Blank-Avatar.png"}
            src={profilePictureUrl}
            alt="Wait"
            />
            <p className="messageText"> {message.text}  </p>
        </div>
        <div className="messageBottom"> {format(message.createdAt)} </div>
        </div>
  )
}
