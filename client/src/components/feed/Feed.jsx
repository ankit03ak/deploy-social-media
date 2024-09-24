import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = username 
          ? await axios.get("/posts/profile/" + username) 
          : await axios.get("/posts/timeline/66d00dbc861986c9048306d3");

        console.log("Response data:", res.data); // Log the response

        // Check if response data is an array
        if (Array.isArray(res.data)) {
          setPosts(
            res.data.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt))
          );
        } else {
          console.error("Unexpected data format:", res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    // Check if the current username is the same as the context username
    setIsOwnProfile(username === user?.username);
  }, [username, user?.username]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || isOwnProfile) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
