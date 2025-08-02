import { Play } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.result) {
    return (
      <div className="p-4 flex flex-col justify-center items-center w-full h-[80vh]">
        <p>No result found. Run an actor first.</p>
        <button
          onClick={() => navigate("/form")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-7 flex flex-col gap-4 h-full">
       <h2 className="text-xl font-semibold text-gray-900">Actors Result</h2>
      <div className="w-full mt-3 h-[80vh] overflow-scroll p-5 border rounded bg-gray-50 shadow-sm">
  
      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify(state.result, null, 2)}
      </pre>
     
      </div>
       
      <button
            onClick={() => navigate("/")}
            className=" bg-green-600 w-[130px] text-white py-1 px-1 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-colors"
          >
           
              
                <Play className="w-4 h-4" />
                <span>Execute Again</span>
              
            
          </button>
    </div>
  );
};

export default Result;
