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

const Footer = () => {
  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '20px',
        backgroundColor: Colors.LIGHT_GRAY4
      }}
    ></footer>
  )
}

export default Footer
