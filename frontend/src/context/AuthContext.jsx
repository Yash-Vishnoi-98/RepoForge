import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null); //start me null as hame nhi pata user authneticate ha ya na
  const [loading, setLoading] = useState(true);
  // we added here this loading because when we refresh or click on explorer page then first ms it see the 12 line and show unauthenticated  ::
  // <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
  // <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
  // <Route path='/explore' element={authUser ? <ExplorePage /> : <Navigate to={"/login"} />} />
  // beacuse of which it move to login page as above code show but then it see in 15 line that user is authenticated and then it show homepage accord to line 15.
  // so we must add loading to prevent to go to homepage before user is authenticated
  // by using if(laoding)return NULL in app.jsx file

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      setLoading(true);
      try {
        const res = await fetch("/check", { credentials: "include" });
        const data = await res.json();
        setAuthUser(data.user); // null or authenticated user object
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
