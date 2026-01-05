import './index.scss'
import { Link, NavLink } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faSearch, faTshirt, faBars, faClose, faUsers, faChartBar, faTrophy, faBroadcastTower } from '@fortawesome/free-solid-svg-icons'
import LogoPL from '../../assets/images/LaLiga_EA_Sports_2023_Vertical_Logo.svg'
import LogoSubtitle from '../../assets/images/liga-espanola--sub logo.png'
import { useState } from 'react'

const Sidebar = () => {
    const [showNav, setShowNav] = useState(false)
    return(
        <div className = 'nav-bar'> 
            <Link className = "logo" to="/"> 
                <img src = {LogoPL} alt="logo" />
                <img className="sub-logo" src = {LogoSubtitle} alt="Liga Española" />
            </Link>
            <nav className={showNav ? 'mobile-show' : ""}>
                <NavLink exact="true" activeclassname = "active" to="/">
                    <FontAwesomeIcon icon = {faHome}  onClick={() => setShowNav(false)} />
                </NavLink>
                <NavLink exact="true" activeclassname = "active" className = "teams-link" to="/teams">
                    <FontAwesomeIcon icon = {faUsers} onClick={() => setShowNav(false)}/>
                </NavLink>
                <NavLink exact="true" activeclassname = "active" className = "matchstats-link" to="/matchstats">
                    <FontAwesomeIcon icon = {faChartBar} onClick={() => setShowNav(false)} />
                </NavLink>
                <NavLink exact="true" activeclassname = "active" className = "position-link" to="/position">
                    <FontAwesomeIcon icon = {faTshirt}  onClick={() => setShowNav(false)}/>
                </NavLink>
                 <NavLink exact="true" activeclassname = "active" className = "trophy-link" to="/champions">
                    <FontAwesomeIcon icon = {faTrophy} onClick={() => setShowNav(false)} />
                </NavLink>
                <NavLink exact="true" activeclassname = "active" className = "livestats-link" to="/livestats">
                    <FontAwesomeIcon icon = {faBroadcastTower} onClick={() => setShowNav(false)} />
                </NavLink>
                <NavLink exact="true" activeclassname = "active" className = "search-link" to="/search">
                    <FontAwesomeIcon icon = {faSearch} onClick={() => setShowNav(false)} />
                </NavLink>
               
                <FontAwesomeIcon icon = {faClose} size = "3x" className="close-icon" onClick={() => setShowNav(false)} />
            </nav>
            <FontAwesomeIcon onClick={() => setShowNav(true)} icon={faBars} color="#ffd700" size="3x" className="hamburger-icon" />
        </div>
    )
}

export default Sidebar 