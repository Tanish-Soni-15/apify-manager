import React from "react";
import { Loader2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const ActorList = ({ actors, isLoading }) => {
  console.log(isLoading);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Your Actors</h2>
      {isLoading && !actors?.length ? (
        <div className="flex w-full h-[80vh] items-center justify-center py-8">
          <Loader2 className="w-9 h-9 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="flex gap-2 sm:flex-row  flex-col sm:flex-wrap">
          {actors?.map((actor) => (
            <NavLink
              to={`/form/${actor.id}`}
              key={actor.id}
              className={`w-full sm:w-[30%] sm:min-w-[360px] text-left p-6 flex flex-col gap-3   rounded-lg border transition-all 
               border-gray-200 hover:border-gray-300 hover:bg-gray-50
              `}
            >
              <div className="flex gap-2">
                <img
                  className="w-11  h-11 border-[1px] rounded-md border-gray-500"
                  src={actor.pictureUrl}
                  alt={actor.title}
                />
                <div className="">
                  <div className=" font-semibold  text-gray-900">
                    {actor.title}
                  </div>
                  <div className="font-medium text-[13px] mt-[-4px] text-gray-600">
                    {actor.username}/{actor.name}
                  </div>
                </div>
              </div>

              <div className=" text-gray-700">
                {(actor.description || "No description")
                  .split(" ")
                  .slice(0, 12)
                  .join(" ") + "..." || "No description"}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Version: {actor.defaultRunOptions?.build?.tag || "latest"}
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActorList;
