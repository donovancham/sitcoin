import { Alert, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useState } from 'react'

// Styles provided for `Alert` styles
const VARIANTS = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
]

// Styles provided for close `Button` styles
const BUTTONSTYLES = [
    'outline-primary',
    'outline-secondary',
    'outline-success',
    'outline-warning',
    'outline-danger',
    'outline-info',
    'outline-light',
    'outline-dark',
]

export const CustomAlert = ({
    closeLabel,     // Sets the text for alert close button.
    closeVariant,   // Sets the variant for close button.
    onClose,        // Callback fired when alert is closed.
    transition,     // Animate the alert dismissal. 
    variant,        // The Alert visual variant
    title,
    message,
}) => {
    const [show, setShow] = useState(true);

    const checkVariant = VARIANTS.includes(variant)
        ? variant
        : VARIANTS[0]

    const checkButtonStyle = BUTTONSTYLES.includes(closeVariant)
        ? closeVariant
        : BUTTONSTYLES[0]

    return (
        <Alert show={show} variant={variant} dismissable>
            <Alert.Heading>{title}</Alert.Heading>
            <p>{message}</p>
            <hr />
            <div className="d-flex justify-content-end">
                <Button onClick={() => {
                    // Dismiss if set to true
                    // Refresh page if set to false
                    setShow(false)
                }} variant={closeVariant}>
                    {closeLabel}
                </Button>
            </div>
        </Alert>
    )
}

CustomAlert.propTypes = {
    closeLabel: PropTypes.string,
    closeVariant: PropTypes.string,
    onClose: PropTypes.func,
    transition: PropTypes.bool,
    variant: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
}

CustomAlert.defaultProps = {
    closeLabel: 'Ok',
    closeVariant: BUTTONSTYLES[0],
    onClose: () => { window.location.reload(true) },
    transition: true,
    variant: VARIANTS[0],
    title: 'Title',
    message: 'Message',
}

export default CustomAlert