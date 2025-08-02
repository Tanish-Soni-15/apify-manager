import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthForm from './components/AuthForm';
import ActorList from './components/ActorList';
import ActorConfiguration from './components/ActorConfiguration';
import ExecutionResults from './components/ExecutionResults';
import ErrorMessage from './components/ErrorMessage';
import {Routes,BrowserRouter,Route} from 'react-router-dom'
import Actor from './pages/Actor';
import Navbar from './components/Navbar';
import ActorForm from './components/ActorForm';
import Result from './components/Result';

function App() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  


      const [actors, setActors] = useState([]);
      const [isLoading, setisLoading] = useState(false)
     const fetchActors=async()=>{
       setisLoading(true);
         const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/fetchActors`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    
    setActors(data.actors);
   setisLoading(false)
    }
  useEffect(()=>{
    fetchActors()
  },[isAuthenticated])
   const verifyUser=async()=>{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/checkUser`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    
    if(response.ok){
      setIsAuthenticated(true);
      setUser(data.user);
    }
   }

   useEffect(()=>{
    verifyUser();
   },[])

  if (!isAuthenticated) {
    return (
      <AuthForm 
       setIsAuthenticated={setIsAuthenticated}
       setUser={setUser}
      />
    );
  }
 
  return (
   <>
     <BrowserRouter>
     <div className="">
       <Navbar user={user} setActors={setActors} setIsAuthenticated={setIsAuthenticated}/>
     <Routes>
      <Route path='/' element={<Actor actors={actors&&actors} isLoading={isLoading}  setIsAuthenticated={setIsAuthenticated}/>} />
      <Route path="/form/:actorId" element={<ActorForm  />} />
            <Route path="/form" element={<ActorForm  />} />
       <Route path="/result" element={<Result />} />
     </Routes>
     </div>
     </BrowserRouter>
   </>
  );
}

export default App;