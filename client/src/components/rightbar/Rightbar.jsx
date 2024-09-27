import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SlUserFollow } from "react-icons/sl";
import { MdPersonRemoveAlt1 } from "react-icons/md";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user:currentUser, dispatch } = useContext(AuthContext);
  // const [followed, setFollowed] = useState(currentUser.followings?.includes(user?._id)); // Initialize as false
  const [followed, setFollowed] = useState(false); // Initialize as false

  // console.log(followed);
  
  // useEffect(() => {
  //   if (user?._id && currentUser.followings) {
  //     setFollowed(currentUser?.followings?.includes(user._id));
  //   }
  // }, [currentUser, user?._id]);

  useEffect(() => {
    if (currentUser) {
      setFollowed(currentUser.followings?.includes(user?._id) || false);
    }
  }, [currentUser, user?._id]);


  // console.log(followed);

  useEffect(() => {
    const getFriends = async () => {
      if (!user?._id) return;

      try {
        const friendList = await axios.get("https://deploy-social-media-ap1.onrender.com/api/users/friends/" + user._id);
        if (Array.isArray(friendList.data)) {
          setFriends(friendList.data);
        } else if (friendList.data && Array.isArray(friendList.data.friends)) {
          setFriends(friendList.data.friends);
        } else {
          setFriends([]);
        }
      } catch (error) {
        console.error("Error fetching friends data:", error.message);
        setFriends([]);
      }
    };

    getFriends();
  }, [user]);

  const handleClick = async () => {
    if (!currentUser) return;

    try {
      if (followed) {
        await axios.put(`https://deploy-social-media-ap1.onrender.com/api/users/${user._id}/unfollow`, { userId: currentUser._id });
        dispatch({type:"UNFOLLOW",payload : user._id})
        console.log("Unfollowed", currentUser._id);
      } else {
        await axios.put(`https://deploy-social-media-ap1.onrender.com/api/users/${user._id}/follow`, { userId: currentUser._id });
        dispatch({type:"FOLLOW",payload : user._id})
        console.log("Followed", currentUser._id);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
    setFollowed(!followed); 
  };

  const HomeRightbar = () => (
    <>
      <div className="birthdayContainer">
        <img className="birthdayImg" src={`${PF}gift.png`} alt="" />
        <span className="birthdayText">
          <b>Adarsh</b> and <b>13 other friends</b> have a birthday today! wish them
        </span>
      </div>
      <img className="rightbarAd" src={`${PF}advertise.jpg`} alt="" />
      <h4 className="rightbarTitle">Online Friends</h4>
      <ul className="rightbarFriendList">
        {Users.map((u) => (
          <Online key={u.id} user={u} />
        ))}
      </ul>
    </>
  );

  const ProfileRightbar = () => (
    <>
      {user?.username !== currentUser?.username && (
        <button className="rightBarFollowButton" onClick={handleClick}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <MdPersonRemoveAlt1 /> : <SlUserFollow />}
        </button>
      )}
      <h4 className="rightbarTitle">User Information</h4>
      <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">City:</span>
          <span className="rightbarInfoValue">{user.city}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">From:</span>
          <span className="rightbarInfoValue">{user.from}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Relationship:</span>
          <span className="rightbarInfoValue">
            {user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "-"}
          </span>
        </div>
      </div>
      <h4 className="rightbarTitle">User Friends</h4>
      <div className="rightbarFollowings">
        {Array.isArray(friends) && friends.length > 0 ? (
          friends.map((friend) => (
            <Link to={`/profile/${friend.username}`} key={friend._id} style={{ textDecoration: 'none' }}>
              <div className="rightbarFollowing">
                <img
                  src={friend.profilePicture ? PF + friend.profilePicture : PF + "user/Blank-Avatar.png"}
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))
        ) : (
          <p>No friends found</p>
        )}
      </div>
    </>
  );

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
