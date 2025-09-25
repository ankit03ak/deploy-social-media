import "./post.css";
import { MdMoreVert } from "react-icons/md";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {format} from "timeago.js"
import {Link} from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {

  // console.log(post);

  
   
  const [like,setLike] = useState(post.likes.length)
  const [isLiked,setIsLiked] = useState(false)
  const [user,setUser] = useState({})
  // const [namee, setNamme] = useState();

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  console.log(post.img);

  const { user:currentUser } = useContext(AuthContext)

  useEffect( () => {
    setIsLiked(post?.likes.includes(currentUser?._id))
  }, [currentUser?._id, post.likes])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://deploy-social-media-ap1.onrender.com/api/users?userId=${post.userId}`);
        setUser(res.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = async ()=>{
    try {
      await axios.put("https://deploy-social-media-ap1.onrender.com/api/posts/" + post._id + "/like", {userId : currentUser._id} ) 
    } catch (error) {
      console.log(error.message)
    }
    setLike(isLiked ? like-1 : like+1)
    setIsLiked(!isLiked)
  }



  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
            <img
              className="postProfileImg"
              src={ user.profilePicture ? PF + user.profilePicture : PF+"user/Blank-Avatar.png"}
              alt=""
              />
              </Link>
            <span className="postUsername">
              {user.username}
            </span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MdMoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span> 
          <img className="postImg" src={(post && post.img) ? post.img : ""} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src={`${PF}like.png`} onClick={likeHandler} alt="" />
            <img className="likeIcon" src={`${PF}heart.png`} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
          </div>
        </div>
      </div>
    </div>
  );
}

