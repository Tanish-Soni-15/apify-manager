import { Menu, User, X } from "lucide-react";
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useLocation,useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useState } from "react";
const Navbar = ({ user,setActors ,setIsAuthenticated}) => {
  const [showAccount, setshowAccount] = useState(false);
  console.log(user.pictureUrl);
  
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuopen, setIsMenuopen] = useState(false);
  const isActive = (path) => location.pathname === path;
  const handleLogout= async()=>{
     const respone = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
      method: "GET",
      credentials: "include",
    });
    const data = await respone.json();
    setIsAuthenticated(false)
    setActors([]);
  navigate('/');
  }
  const navLinks = [
    { path: "/", label: "Actors" },
    { path: "/form", label: "Form" },
    { path: "/result", label: "Result" },
  ];
  return (
    <header className="bg-white shadow-sm border-b  border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl relative mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex justify-center items-center">
            <button
              onClick={() => setIsMenuopen(!isMenuopen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              {isMenuopen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          <Link
            to="/"
            className="sm:text-2xl text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Apify Actor Manager
          </Link>
          </div>
          <div className="flex gap-6">
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div>
              <button onClick={()=>setshowAccount(!showAccount)}>
                <img
                  src={user?.pictureUrl}
                  className=" w-9 h-9 rounded-full"
                  alt="User"
                />
              </button>
            </div>
          </div>
        </div>
        {showAccount && (
          <div className="absolute flex flex-col gap-2 right-[34px] top-[55px] bg-white w-[170px] border-[1px] p-3 border-gray-400 rounded-md">
            <p>Account</p>
            <div className="flex  items-center gap-3">
              <img
                src={user?.pictureUrl}
                className=" w-7 h-7 rounded-full"
                alt="User"
              />
              <div className="">
                <p className="text-[13px] font-semibold">{user?.name}</p>
                <p className="text-[13px] mt-[-5px] text-gray-600">
                  {user?.email.split("@")[0]}
                </p>
              </div>
            </div>
            <hr className="h-[1.5px] w-[170px] ml-[-12px] bg-gray-400" />
            <div className="">
              <div onClick={handleLogout} className="flex  items-center cursor-pointer py-[5px] rounded-md hover:bg-gray-100 px-1  gap-2">
                <LogOut className=" font-semibold text-gray-700 w-4 h-4" />
                <p className="text-[13px] font-semibold text-gray-600">
                  Sign out
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
       {isMenuopen && (
          <div className="md:hidden py-4 absolute bg-white w-full px-4 border-t border-gray-200 animate-slide-up">
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuopen(false)}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(link.path)
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
    </header>
  );
};

export default Navbar;
