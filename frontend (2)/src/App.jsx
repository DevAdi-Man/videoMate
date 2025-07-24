import { useEffect, useState } from "react";
import "./App.css";
import { Header, Loader} from "./components";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authService from "./services/auth";
import { login as authLogin, logout } from "./store/authSlice";
import MiniDrawer from "./components/Drawer";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(authLogin(userData.data));
        } else {
          dispatch(logout());
          navigate("/login");
        }
      })
      .catch((error) => error)
      .finally(() => setLoading(false));
  }, [dispatch, navigate]);

  return !loading ? (
    <div className="min-h-screen bg-background text-text">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-gray-900 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(224,146,188,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,12,137,0.1),transparent_50%)]"></div>
      </div>
      
      {/* Main Layout */}
      <div className="relative flex flex-col min-h-screen">
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-1 flex">
          <MiniDrawer>
            <div className="flex-1 min-h-0">
              {/* Content Area */}
              <div className="h-full overflow-y-auto">
                <div className="container mx-auto px-4 py-6 max-w-7xl">
                  <Outlet />
                </div>
              </div>
            </div>
          </MiniDrawer>
        </main>
      </div>
    </div>
  ) : (
    <Loader text="Initializing YouTube Clone..." />
  );
}

export default App;
