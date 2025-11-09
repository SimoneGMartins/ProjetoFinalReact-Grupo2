import { Route, Routes } from "react-router-dom";
import Home from "../screens/Home/home";
import Login from "../screens/Login/login";
import CreatePost from "../screens/CreatePost/createPost";
import EditPost from "../screens/EditPost/editPost";
import PostDetails from "../screens/PostDetails/postDetails";
import Profile from "../screens/Profile/profile";
import MainLayout from "../layout/MainLayout";
import LoginLayout from "../layout/LoginLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import NewAccount from "../screens/NewAccount/NewAccount";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<LoginLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/new-account" element={<NewAccount />}/>
      </Route>

      <Route element={ <ProtectedRoute > <MainLayout /> </ProtectedRoute> }>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/edit-post" element={<EditPost />} />
        <Route path="/post-details" element={<PostDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
