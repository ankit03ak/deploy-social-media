import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import { AuthContext } from "../../context/AuthContext";
import { getProfilePosts, getTimelinePosts } from "../../api/postApi";


export default function Feed({username}) {

  const [posts, setPosts] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const { user } = useContext(AuthContext);

  // console.log(username);

  useEffect(() => {
    const fetchData = async () => {
    //   const url = username
    //   ? `https://deploy-social-media-ap1.onrender.com/api/posts/profile/${username}`
    //   : `https://deploy-social-media-ap1.onrender.com/api/posts/timeline/${user._id}`;
    
    // const response = await axios.get(url);
    if (!username && !user?._id) return;

  const response = username
    ? await getProfilePosts(username)
    : await getTimelinePosts(user._id);

      setPosts(
        response.data.sort((post1, post2) => {
          return new Date(post2.createdAt) - new Date(post1.createdAt);
        })
      )
    }
    fetchData();
  }, [username, user._id]);
  

    useEffect(() => {
      // Check if the current username is the same as the context username
      setIsOwnProfile(username === user?.username);
    }, [username, user?.username]);


    
  
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || isOwnProfile) && <Share /> }
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))} 

        
      </div>
    </div>
  );
}