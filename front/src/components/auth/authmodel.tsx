// src/components/auth/AuthModal.tsx
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { Box, Modal, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SignUpForm from '../signUp'; // Adjust path if needed
import SignInForm from '../signIn'; // Adjust path if needed
// import { useUser } from '../../context/userContext'; // No longer needed here

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 450 },
    bgcolor: 'background.paper',
    borderRadius: '16px',
    boxShadow: 24,
    p: 0,
    maxHeight: '90vh',
    overflowY: 'auto', // Changed to Y only
    outline: 'none',
};

interface AuthModalProps {
    open: boolean;
    handleClose: () => void;
    initialMode?: 'signIn' | 'signUp';
}

const AuthModal: React.FC<AuthModalProps> = ({
    open,
    handleClose,
    initialMode = 'signIn'
}) => {
    const [isSignInMode, setIsSignInMode] = useState(initialMode === 'signIn');
    // const { isAuthenticated } = useUser(); // REMOVED

    // Memoize handleClose for stability if passed inline to children
    const memoizedHandleClose = useCallback(handleClose, [handleClose]);

    // Reset mode when modal opens based on initialMode prop
    useEffect(() => {
        if (open) {
            console.log("AuthModal opening, initialMode:", initialMode); // Debug
            setIsSignInMode(initialMode === 'signIn');
        }
    }, [open, initialMode]);

    // REMOVED: useEffect checking isAuthenticated - forms will now trigger close

    const switchToSignUp = () => setIsSignInMode(false);
    const switchToSignIn = () => setIsSignInMode(true);

    console.log("AuthModal rendering, open prop:", open); // Debug

    return (
        <Modal
            open={open}
            onClose={memoizedHandleClose} // Use memoized version
            aria-labelledby="auth-modal-title"
            closeAfterTransition
        >
            <Fade in={open}>
                <Box sx={style}>
                    <IconButton
                        aria-label="close"
                        onClick={memoizedHandleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                            zIndex: 1,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {isSignInMode ? (
                        // **** PASS onSuccess prop ****
                        <SignInForm onSwitchMode={switchToSignUp} onSuccess={memoizedHandleClose} />
                    ) : (
                         // **** PASS onSuccess prop ****
                        <SignUpForm onSwitchMode={switchToSignIn} onSuccess={memoizedHandleClose} />
                    )}
                </Box>
            </Fade>
        </Modal>
    );
};

export default AuthModal;