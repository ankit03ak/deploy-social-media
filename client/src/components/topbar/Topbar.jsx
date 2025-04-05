import './topbar.css'
import { FaSearch } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { IoChatboxOutline } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import {Link} from "react-router-dom"
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';


export default function Topbar() {

    const {user} = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [isOpen, setIsOpen] = useState(false);
    
    
    const handleLogout = () => {
                localStorage.removeItem("user");
                window.location.href = "/login";
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
      }; 


  return (
    <div className='topbarContainer'>
        <div className='topbarLeft'>
            <Link to="/" style={{textDecoration:"none"}}>
            <span className='logo'> 𝓢𝓸𝓬𝓲𝓸-𝓩𝓸𝓷𝓮</span>
            </Link>
        </div>
        <div className='topbarCenter'>
            <div className="searchbar">
                <FaSearch className='searchIcon' />
                <input placeholder='Search for friend, post or video' className='searchInput' />
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
                <img src={user?.profilePicture ? PF + user?.profilePicture : PF + "user/Blank-Avatar.png"} alt="Profile" className="profile-icon" />
            </button>
      
            {isOpen && (
                <div className="dropdown-menu">
                <button className="dropdown-item green"><Link to={`/profile/${user?.username}`} className='link-no-underline'> Profile</Link></button>
                <button onClick={handleLogout} className="dropdown-item red">Logout</button>
                </div>
            )}
            </div>

        </div>

    </div>
  )
}
