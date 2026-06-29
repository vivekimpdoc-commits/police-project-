import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export type UserRole = 'Super Admin' | 'State Admin' | 'Zone Admin' | 'Range Admin' | 'District Admin' | 'PNO Officer' | 'Data Entry Operator' | 'Viewer';

interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;
  beltNumber?: string;
  district?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const demoAuth = localStorage.getItem('demoAuth');
    if (demoAuth) {
      
      let role = 'Officer';
      let fullName = 'Demo Officer';
      
      switch(demoAuth) {
        case 'constable': role = 'Constable'; fullName = 'Constable Ramesh'; break;
        case 'sho': role = 'SHO'; fullName = 'SHO Rajesh Kumar'; break;
        case 'district': role = 'District Admin'; fullName = 'SP Lucknow'; break;
        case 'hq': role = 'State HQ'; fullName = 'DGP Headquarters'; break;
        case 'admin': role = 'Super Admin'; fullName = 'Control Room Admin'; break;
      }

      setCurrentUser({ uid: `demo-${demoAuth}`, email: `${demoAuth}@uppolice.gov.in` } as User);
      setUserData({
        uid: `demo-${demoAuth}`,
        email: `${demoAuth}@uppolice.gov.in`,
        role: role,
        fullName: fullName
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Fetch additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            // For development, mock data if not in DB
            setUserData({
              uid: user.uid,
              email: user.email || '',
              role: 'PNO Officer',
              fullName: user.displayName || 'Mock Officer'
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Mock data fallback for dev
          setUserData({
            uid: user.uid,
            email: user.email || '',
            role: 'PNO Officer',
            fullName: user.displayName || 'Mock Officer'
          });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    localStorage.removeItem('demoAuth');
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
