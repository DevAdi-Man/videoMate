import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import 'sweetalert2/src/sweetalert2.scss'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import Videos from "./pages/Videos.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Subscribers from "./pages/Subscribers.jsx";
import MyContent from "./pages/MyContent.jsx";
import Customise from "./pages/Customise.jsx";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {queryClient} from "./utils/query-client.js"
import Channel from "./pages/Channel.jsx";
import EditUser from "./pages/EditUser.jsx";
import AuthLayOut from "./components/AuthLayOut.jsx";
import LikedVideo from "./pages/LikedVideo.jsx";
import VideoHistory from "./pages/VideoHistory.jsx";
import {  AddVideoOnPlaylsits } from "./components/index.js";
import NotFound from "./pages/NotFound.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthLayOut authentication>
            <Home />
          </AuthLayOut>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayOut authentication={false}>
            <Login />
          </AuthLayOut>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayOut authentication={false}>
            <Signup />
          </AuthLayOut>
        ),
      },
      {
        path: "/video/:slug",
        element: (
          <AuthLayOut authentication>
            <Videos />
          </AuthLayOut>
        ),
      },
      {
        path: "/liked-videos",
        element: (
          <AuthLayOut authentication>
            <LikedVideo/>
          </AuthLayOut>
        ),
      },
      {
        path: "/history",
        element: (
          <AuthLayOut authentication>
          <VideoHistory/>
          </AuthLayOut>
        ),
      },
      {
        path: "/channel/:userName",
        element: (
          <AuthLayOut authentication>
            <Channel/>
          </AuthLayOut>
        ),
      },
      {
        path: "/subscribers",
        element: (
          <AuthLayOut authentication>
            <Subscribers />
          </AuthLayOut>
        ),
      },
      {
        path: "/content",
        element: (
          <AuthLayOut authentication>
            <MyContent />
          </AuthLayOut>
        ),
      },
      {
        path: "/customise",
        element: (
          <AuthLayOut authentication>
            <Customise />
          </AuthLayOut>
        ),
      },
      {
        path: "/Account",
        element: (
          <AuthLayOut authentication>
            <EditUser/>
          </AuthLayOut>
        ),
      },
      {
        path: "/Edit-Playlist",
        element: (
          <AuthLayOut authentication>
          <AddVideoOnPlaylsits/>
          </AuthLayOut>
        ),
      },
      // Catch-all route for 404 - must be last
      {
        path: "*",
        element: <NotFound />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      // transition="Bounce"
    />

    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false}/>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
