import Navbar from 'react-bootstrap/Navbar';
import logo from '../SimpleSW3_smaller.PNG';

const Navigation = ({ tokenName }) => {
  return(
      <Navbar>
        <img
          alt="logo"
          src={logo}
          width="95"
          height="127"
          className="d-inline-block align-top mx-3"
        />
        <Navbar.Brand href="#">{tokenName} ICO Crowdsale</Navbar.Brand>
      </Navbar>
  )
}

export default Navigation;
