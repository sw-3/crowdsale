import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../SW3_logo_small.png';

const logoColor = '#0f2a87'

// logo dimensions:  SW3_logo_small = 114w X 164h
//                   SW3_logo_smaller = 95w X 127h

const Navigation = () => {
  return(
      <Navbar>
        <Container>
          <img
            alt="logo"
            src={logo}
            width="81"
            height="116"
            className="d-inline-block align-top mx-3"
          />
          <Navbar.Brand href="#" style={{ color: logoColor }}>Token ICO Crowdsale</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text style={{ color: logoColor, fontSize: '20px', marginRight: '5%' }}>
              <i>Building Web3...</i>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}

export default Navigation;
