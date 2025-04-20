// src/components/auth/AuthModal.tsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { Box, Modal, Fade } from '@mui/material';
import SignUpForm from '../signUp';
import SignInForm from '../signIn';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
};

interface AuthModalProps {
    open: boolean;
    handleClose: () => void;
    initialMode?: 'signIn' | 'signUp'; // <-- Add prop for initial mode
}

const AuthModal: React.FC<AuthModalProps> = ({
    open,
    handleClose,
    initialMode = 'signIn' // Default to sign in if not provided
}) => {
  // State to manage which form is currently visible INSIDE the modal
  const [isSignInMode, setIsSignInMode] = useState(initialMode === 'signIn');

  // Effect to reset the mode when the modal opens based on the initialMode prop
  useEffect(() => {
    if (open) {
        setIsSignInMode(initialMode === 'signIn');
    }
    // Reset when modal closes is optional, but often good UX
    // else {
    //     setIsSignInMode(true); // Default back to sign in when closed
    // }
  }, [open, initialMode]); // Re-run effect if open state or initialMode changes


  const switchToSignUp = () => setIsSignInMode(false);
  const switchToSignIn = () => setIsSignInMode(true);

  return (
    <Modal
        open={open}
        onClose={handleClose} // Use the passed-in handler to close
        aria-labelledby="auth-modal-title"
        closeAfterTransition
    >
        <Fade in={open}>
            <Box sx={style}>
            {isSignInMode ? (
                <SignInForm onSwitchMode={switchToSignUp} />
            ) : (
                <SignUpForm onSwitchMode={switchToSignIn} />
            )}
            </Box>
        </Fade>
    </Modal>
  );
};

export default AuthModal;