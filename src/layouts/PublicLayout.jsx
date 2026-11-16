import { Navbar, Footer } from "../components/";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
const PublicLayout = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("user-info"));

  // useEffect(() => {
  //   if (userInfo.role === "admin") navigate("/admin");
  // }, [navigate, userInfo]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;
