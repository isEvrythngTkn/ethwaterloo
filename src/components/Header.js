import React from 'react'
import { Link } from 'react-router-dom'

const Header = function(props) {
  //Ξ
  return (
    <nav className="navbar pure-menu pure-menu-horizontal">
      <Link to="/" className="pure-menu-heading pure-menu-link">Expensereum</Link>
    </nav>
  )
}

export default Header
