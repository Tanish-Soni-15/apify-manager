import React, { useEffect } from 'react'
import ActorList from '../components/ActorList';
import ErrorMessage from '../components/ErrorMessage';
import { useState } from 'react';
import Navbar from '../components/Navbar';
const Actor = ({actors,isLoading,setIsAuthenticated}) => {
  const [error, setError] = useState('');
  
     const handleDisconnect = () => {
    setIsAuthenticated(false);
    setActors([]);
    setError('');
  };
  console.log(actors);
  
  return (
   
     <div className="">
           
          <ErrorMessage error={error} />

          <div className="w-full p-7">
            <ActorList 
              actors={actors}
              isLoading={isLoading}
            />

            {/* <ActorConfiguration 
              selectedActor={selectedActor}
              actorSchema={actorSchema}
              inputValues={inputValues}
              onInputChange={handleInputChange}
              onExecute={executeActor}
              isLoading={isLoading}
              isExecuting={isExecuting}
            /> */}
          </div>
       </div>
  )
}

export default Actor
