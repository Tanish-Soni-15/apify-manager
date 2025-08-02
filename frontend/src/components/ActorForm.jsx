import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Play } from "lucide-react";

const ActorForm = () => {
  const { actorId } = useParams();
  const [actor, setActor] = useState(null);
  const [inputJson, setInputJson] = useState("{}");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const knownActorInputs = {
  "apify/instagram-scraper": {
    addParentData: false,
    directUrls: ["https://www.instagram.com/ankit_baiyanpuria/"],
    enhanceUserSearchWithFacebookPage: false,
    isUserReelFeedURL: false,
    isUserTaggedFeedURL: false,
    resultsLimit: 10,
    resultsType: "details",
    searchLimit: 1,
    searchType: "user"
  },
  "compass/crawler-google-places": {
    searchStringsArray: ["restaurants in New York"],
    maxCrawledPlacesPerSearch: 20,
    includeReviews: true,
    includeImages: false
  },
  "apify/amazon-scraper": {
    queries: ["laptops"],
    maxResults: 20,
    country: "US",
    includeReviews: false
  },
  "apify/linkedin-scraper": {
    searchKeywords: ["Software Engineer"],
    maxProfiles: 10,
    searchLocation: "India",
    scrapeCompanyDetails: true
  },
  "apify/twitter-scraper": {
    searchTerms: ["OpenAI"],
    maxTweets: 20,
    scrapeRetweets: false,
    scrapeReplies: false
  },
  "apify/facebook-pages-scraper": {
    startUrls: ["https://www.facebook.com/nasa/"],
    maxPosts: 10,
    scrapeComments: false
  },
  "apify/youtube-scraper": {
    searchKeywords: ["AI tutorials"],
    maxVideos: 10,
    scrapeVideoCaptions: false
  },
  "apify/reddit-scraper": {
    searchTerms: ["web development"],
    subreddit: "javascript",
    maxPosts: 10,
    scrapeComments: true
  },
  "apify/tiktok-scraper": {
    searchTerms: ["coding"],
    maxVideos: 10,
    downloadVideos: false
  },
  "apify/indeed-scraper": {
    searchKeywords: ["MERN developer"],
    searchLocation: "Jaipur",
    maxResults: 20
  }
};


  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        setFetching(true);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/fetchForm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ actorId }),
          credentials: "include",
        });

        const data = await res.json();

        if (data?.data) {
          setActor(data.data);
          const a=data.data
          if (data.data.exampleRunInput?.body && a) {
            const input=knownActorInputs[`${a.username}/${a.name}`]
         
            
            if(input){
               setInputJson(JSON.stringify(input, null, 2));

            }
            else{
            setInputJson(
              JSON.stringify(JSON.parse(data.data.exampleRunInput.body), null, 2)
            );
          }
          }
        }
      } catch (err) {
        console.error("Failed to load actor details");
      } finally {
        setFetching(false);
      }
    };
    if (actorId) fetchActorDetails();
  }, [actorId]);

  const handleRunActor = async () => {
    setError("");
    setLoading(true);

    let parsedInput;
    try {
      parsedInput = JSON.parse(inputJson);
    } catch {
      setError("Invalid JSON format");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/runActor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ actorId, input: parsedInput }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/result", { state: { result: data, actorId } });
      } else {
        setError(data.error?.message || "Actor run failed");
      }
    } catch {
      setError("Error running actor");
    } finally {
      setLoading(false);
    }
  };

  if (fetching&&actorId) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!actor ||!actorId) {
    return (
      <div className="sm:p-4 p-2 flex flex-col justify-center items-center w-full h-[80vh]">
        <p>No Actor form found. Click an actor first.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (


      
      <div className="w-full p-3 sm:p-7 h-full flex flex-col gap-3">
        <NavLink to='/' className="flex gap-0.5 text-blue-600 items-center w-[120px] "> <ArrowLeft className="w-4 h-4"/> <p className="" >All Actor</p> </NavLink>
        <div className="flex flex-col gap-4   mb-3">
          <div className="flex items-center gap-3">
<img
          src={actor.pictureUrl}
          alt={actor.title}
          className="w-16 h-16 rounded-xl border border-gray-300"
        />
        <div className="flex flex-col gap-2">
          <div className="">
 <h2 className="text-2xl font-bold text-gray-900">{actor.title}</h2>
          <p className="text-sm text-gray-600">
            {actor.username}/{actor.name}
          </p>
          </div>
          <div className="mt-2 items-center flex flex-wrap gap-3 text-xs text-gray-500">
            <button className="w-[70px]  bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-colors"><Play className="w-4 h-4" />
                <span>Start</span></button>
            <span>Runs: {actor.stats?.totalRuns || 0}</span>
            <span>Users: {actor.stats?.totalUsers || 0}</span>
            <span>Last Run: {actor.stats?.lastRunStartedAt?.split("T")[0] || "N/A"}</span>
            <span>Version: {actor.defaultRunOptions?.build || "latest"}</span>
          </div>
        </div>
          </div>
        
        <div>
         
          <p className="mt-2 text-gray-700">
            {actor.description || "No description available."}
          </p>
          
        </div>
      </div>
       <h2 className="text-xl font-semibold text-gray-900">JSON Input</h2>
      <div className="w-full mt-3 h-[70vh] p-4 border rounded bg-gray-50 shadow-sm">
        <textarea
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
          className="w-full h-[50vh] p-3 border rounded font-mono text-sm bg-white"
        />
        {error && <p className="text-red-600 mt-2">{error}</p>}
       
        <button
            onClick={handleRunActor}
            disabled={loading}
            className="w-[130px] mt-4  bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Execute Actor</span>
              </>
            )}
          </button>
      </div>
      
    </div>
  );
};

export default ActorForm;
