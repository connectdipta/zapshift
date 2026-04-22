import React, { useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase.init';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const logoutTimerRef = useRef(null);

    const clearLogoutTimer = () => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    };

    const clearTokenStorage = () => {
        localStorage.removeItem('zapshift_access_token');
        localStorage.removeItem('zapshift_access_expires_at');
    };

    const scheduleAutoLogout = (expiresAt) => {
        clearLogoutTimer();
        const msUntilExpire = new Date(expiresAt).getTime() - Date.now();

        if (msUntilExpire <= 0) {
            clearTokenStorage();
            signOut(auth).catch(() => null);
            return;
        }

        logoutTimerRef.current = setTimeout(() => {
            clearTokenStorage();
            signOut(auth).catch(() => null);
        }, msUntilExpire);
    };

    const registerUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password).catch((error) => {
            setLoading(false)
            throw error
        })
    }

    const signInUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password).catch((error) => {
            setLoading(false)
            throw error
        })
    }

    const logout = () => {
        setLoading(true)
        clearLogoutTimer();
        clearTokenStorage();
       return signOut(auth);
    }

    const signInGoogle = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider).catch((error) => {
            setLoading(false)
            throw error
        })
    }

    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile)
    }

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email)
    }

    // Observe User State
    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            // Add a small delay to ensure loading animation is visible
            setTimeout(async () => {
                try {
                    if (currentUser?.email) {
                        const syncController = new AbortController()
                        const syncTimeout = setTimeout(() => syncController.abort(), 8000)

                        await fetch(`${import.meta.env.VITE_API_URL}/users/sync`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email: currentUser.email,
                                name: currentUser.displayName || 'User',
                                photoURL: currentUser.photoURL || ''
                            }),
                            signal: syncController.signal,
                        }).catch(() => null)

                        clearTimeout(syncTimeout)

                        const tokenController = new AbortController()
                        const tokenTimeout = setTimeout(() => tokenController.abort(), 8000)

                        const tokenRes = await fetch(`${import.meta.env.VITE_API_URL}/jwt`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ email: currentUser.email }),
                            signal: tokenController.signal,
                        }).catch(() => null)

                        clearTimeout(tokenTimeout)

                        if (tokenRes?.ok) {
                            const tokenData = await tokenRes.json();
                            localStorage.setItem('zapshift_access_token', tokenData.token);
                            localStorage.setItem('zapshift_access_expires_at', tokenData.expiresAt);
                            scheduleAutoLogout(tokenData.expiresAt);
                        }
                    } else {
                        clearLogoutTimer();
                        clearTokenStorage();
                    }

                    setUser(currentUser)
                } finally {
                    setLoading(false)
                }
            }, 500) // 500ms minimum loading time
        })
        return () => {
            clearLogoutTimer();
            unSubscribe();
        }

    }, [])

    const authInfo = {
        user,
        loading,
        registerUser,
        signInUser,
        signInGoogle,
        logout,
        updateUserProfile,
        resetPassword
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;