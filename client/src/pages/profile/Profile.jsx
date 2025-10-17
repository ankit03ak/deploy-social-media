import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

export default function Profile() {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;
  
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://deploy-social-media-ap1.onrender.com/api/users?username=${username}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchUser();
  }, [username]);

  console.log(user.profilePicture)
  



  return (
    <>
      <Topbar  />
      <div className="profile">
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
      user?.coverPicture
        ? user.coverPicture.startsWith("http")
          ? user.coverPicture
          : PF + user.coverPicture
        : PF + "user/blank_cover.png"
    }
    alt=""
                />
              <img
                className="profileUserImg"
                    src={
      user?.profilePicture
        ? user.profilePicture.startsWith("http")
          ? user.profilePicture
          : PF + user.profilePicture
        : PF + "user/Blank-Avatar.png"
    }
    alt=""
              />
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <div className="temp2"></div>
            <Rightbar user={user}/>
            <Feed username={username}/>
            <div className="temp"></div>
          </div>
        </div>
      </div>
    </>
  );
}