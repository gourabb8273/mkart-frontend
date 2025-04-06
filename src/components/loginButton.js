import { useAuth0 } from '@auth0/auth0-react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginButton = () => {
  const { loginWithRedirect, user} = useAuth0();
    
  return (
    <Button style={{backgroundColor:'transparent', borderColor:'rgb(25, 135, 84)'}}onClick={() => loginWithRedirect()}>
      Login
    </Button>
  );
};

export default LoginButton;
