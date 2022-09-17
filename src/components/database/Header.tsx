import {
  Colors,
  FormGroup,
  InputGroup,
  NumericInput,
  Button,
  Toaster,
  Position,
  Intent
} from '@blueprintjs/core'

const Header = () => {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '60px',
        backgroundColor: Colors.LIGHT_GRAY4
      }}
    ></header>
  )
}

export default Header
