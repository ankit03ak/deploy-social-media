import './topbar.css'
import { FaSearch } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import {Link, useNavigate} from "react-router-dom"
import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PF } from '../../config';


export default function Topbar() {

    const {user} = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ users: [], posts: [] });
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();


const handleSearch = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://deploy-social-media-ap1.onrender.com/api/search?q=${query}`
      );
      setResults(res.data);
      setShowDropdown(true);
    } catch (err) {
      console.error(err);
    }
  }, [query]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setResults({ users: [], posts: [] });
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, handleSearch]);

    
const handleLogout = () => {
  localStorage.removeItem("user");
  toast.success("Logged out successfully!");
  setTimeout(() => {
    window.location.href = "/login";
  }, 1000);
};


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
      }; 


  return (
    <div className='topbarContainer'>
        <div className='topbarLeft'>
            <Link to="/" style={{textDecoration:"none"}}>
            <span className='logo'> <img src={PF("favLogo.png")} alt="" /> </span>
            </Link>
        </div>
        <div className='topbarCenter'>
            <div className="searchbar">
                <FaSearch className='searchIcon' />
                <input
  placeholder="Search for friend or post"
  className="searchInput"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onFocus={() => query && setShowDropdown(true)}
  onBlur={() => setShowDropdown(false)}
/>

{showDropdown && (results.users.length > 0 || results.posts.length > 0) && (
  <div className="searchDropdown">
    <h4>Users</h4>
    {results.users.length > 0 ? (
      results.users.map((u) => (
        <Link
          key={u._id}
          to={`/profile/${u.username}`}
          className="searchItem"
          onMouseDown={(e) => e.preventDefault()} 
        >
          <img
  src={PF(u.profilePicture) || PF("user/Blank-Avatar.png")}
  alt=""
  className="searchAvatar"
/>
          <span>{u.username}</span>
        </Link>
      ))
    ) : (
      <p className="searchEmpty">No users found</p>
    )}

    {/* <h4>Posts</h4>
    {results.posts.length > 0 ? (
      results.posts.map((p) => (
        <div key={p._id} className="searchItem">
          <span>{p.description}</span>
        </div>
      ))
    ) : (
      <p className="searchEmpty">No posts found</p>
    )} */}
  </div>
)}

            </div>
        </div>
        <div className='topbarRight'>
            <div className="topbarLinks">
            <Link to={"/"} className="no-link-style">
            {/* <Link to={`/profile/${user?.username}`} className="no-link-style"> */}
                <span className='topbarLink'>Homepage</span>
                </Link>
            <Link to={`/profile/${user?.username}`} className="no-link-style">

                <span className='topbarLink'>Timeline</span>
                </Link>

            </div>
            <div className="topbarIcons">
                
                <div className="topbarIconItem">
                <Link to="/messenger" className="no-link-style">
                    <IoChatboxOutline className='badge' />
                    <span className="topbarIconBadge">1</span>
                </Link>
                </div>
                
            </div>
            
            <div className="dropdown">
            <button onClick={toggleDropdown} className="profile-button">
                {/* <img src={user?.profilePicture ? PF + user?.profilePicture : PF + "user/Blank-Avatar.png"} alt="Profile" className="profile-icon" /> */}
                <img
  src={PF(user?.profilePicture) || PF("user/Blank-Avatar.png")}
  alt="Profile"
  className="profile-icon"
/>
            </button>
      
            {isOpen && (
                <div className="dropdown-menu">
                <button 
  onClick={() => navigate(`/profile/${user?.username}`)} 
  className="dropdown-item green"
>
  Profile
</button>
                <button onClick={handleLogout} className="dropdown-item red">Logout</button>
                </div>
            )}
            </div>

        </div>

    </div>
  )
}
