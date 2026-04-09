import React, { useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
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
        return createUserWithEmailAndPassword(auth, email, password)

    }

    const signInUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        setLoading(true)
        clearLogoutTimer();
        clearTokenStorage();
       return signOut(auth);
    }

    const signInGoogle = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }

    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile)
    }

    // Observe User State
    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            // Add a small delay to ensure loading animation is visible
            setTimeout(async () => {
                if (currentUser?.email) {
                    await fetch(`${import.meta.env.VITE_API_URL}/users/sync`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: currentUser.email,
                            name: currentUser.displayName || 'User',
                            photoURL: currentUser.photoURL || ''
                        })
                    }).catch(() => null)

                    const tokenRes = await fetch(`${import.meta.env.VITE_API_URL}/jwt`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email: currentUser.email })
                    }).catch(() => null)

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
                setLoading(false)
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
        updateUserProfile
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;