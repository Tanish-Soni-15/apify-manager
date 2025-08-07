import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Play } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
const ActorForm = () => {
  const { actorId } = useParams();
  const [actor, setActor] = useState(null);
  const [inputJson, setInputJson] = useState("{}");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({});
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: {} });
const onSubmit = (data) => {
    const parsedData = {};

  for (const key in data) {
    const config = inputJson[key];

    if (config?.type === "integer") {
      parsedData[key] = parseInt(data[key], 10);
    } else {
      parsedData[key] = data[key];
    }
  }

    const parsedInput= {...parsedData,...fields}
    handleRunActor(parsedInput);
  };
  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        setFetching(true);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/fetchForm`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ actorId }),
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data?.data) {
          setActor(data.data);
        }
        if (data?.inputSchema) {
          setInputJson(data.inputSchema);
        }
      } catch (err) {
        console.error("Failed to load actor details");
      } finally {
        setFetching(false);
      }
    };
    if (actorId) fetchActorDetails();
  }, [actorId]);

  const handleRunActor = async (parsedInput) => {
    setError("");
    setLoading(true);
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
        
        setError(data.details.error?.message|| "Actor run failed");
      }
    } catch {
      setError("Error running actor");
    } finally {
      setLoading(false);
    }
  };

  if (fetching && actorId) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!actor || !actorId) {
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
      <NavLink
        to="/"
        className="flex gap-0.5 text-blue-600 items-center w-[120px] "
      >
        {" "}
        <ArrowLeft className="w-4 h-4" /> <p className="">All Actor</p>{" "}
      </NavLink>
      <div className="flex flex-col gap-4   mb-3">
        <div className="flex items-center gap-3">
          <img
            src={actor.pictureUrl}
            alt={actor.title}
            className="w-16 h-16 rounded-xl border border-gray-300"
          />
          <div className="flex flex-col gap-2">
            <div className="">
              <h2 className="text-2xl font-bold text-gray-900">
                {actor.title}
              </h2>
              <p className="text-sm text-gray-600">
                {actor.username}/{actor.name}
              </p>
            </div>
            <div className="mt-2 items-center flex flex-wrap gap-3 text-xs text-gray-500">
              <button className="w-[70px]  bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-colors">
                <Play className="w-4 h-4" />
                <span>Start</span>
              </button>
              <span>Runs: {actor.stats?.totalRuns || 0}</span>
              <span>Users: {actor.stats?.totalUsers || 0}</span>
              <span>
                Last Run:{" "}
                {actor.stats?.lastRunStartedAt?.split("T")[0] || "N/A"}
              </span>
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
      <h2 className="text-xl font-semibold text-gray-900">Input Form</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full sm:w-[70%] mt-3 flex flex-col gap-5 p-4 border rounded bg-gray-50 shadow-sm"
      >
        {Object.entries(inputJson).map(([key, config]) => {
         
          if (config.editor === "hidden") return null;

          return (
            <>
            { (config.type==="array" || config.editor === "stringList" || config.editor === "select" || config.editor === "datepicker"|| config.editor === "number" || config.editor === "textfield") &&             
            <div key={key} className="flex  flex-col gap-1">
            
              <div className="flex  items-center gap-1 group relative w-fit">
                <label className="font-semibold text-gray-800">
                  {config.title || key}
                </label>

                {config.description && (
                  <>
                    <div className="w-5 h-5 text-gray-500 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                        />
                      </svg>
                    </div>

                    <div className="absolute top-6 left-0 right-0 z-10 hidden group-hover:block text-black bg-white text-xs rounded-md px-3 py-2 w-64 shadow-md">
                      {config.description}
                    </div>
                  </>
                )}
              </div>

              {config.type === "array" && config.editor === "stringList" && (
                <div>
                  {(fields[key] || [""]).map((value, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                          const updated = [...(fields[key] || [])];
                          updated[index] = e.target.value;
                          setFields({ ...fields, [key]: updated });
                        }}
                        className="p-2 border rounded w-full"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(fields[key] || [])];
                          updated.splice(index, 1);
                          setFields({ ...fields, [key]: updated });
                        }}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFields({
                        ...fields,
                        [key]: [...(fields[key] || []), ""],
                      })
                    }
                    className="text-blue-500"
                  >
                    + Add more
                  </button>
                </div>
              )}

              {/* Select Field */}
              {config.editor === "select" && config.enum && (
                <select
                  {...register(key)}
                  className="p-2 border rounded"
                  defaultValue={config.prefill || ""}
                >
                  <option value="">Select an option</option>
                  {config.enum.map((val, i) => (
                    <option key={val} value={val}>
                      {config.enumTitles?.[i] || val}
                    </option>
                  ))}
                </select>
              )}

              {/* Datepicker-like string input */}
              {config.editor === "datepicker" && (
                <input
                  type="text"
                  placeholder="YYYY-MM-DD or e.g. 1 week"
                  {...register(key)}
                  className="p-2 border rounded"
                />
              )}

              {/* Number Input */}
              {config.editor === "number" && (
                <input
                  type="number"
                  defaultValue={config.prefill}
                  min={config.minimum}
                  max={config.maximum}
                  {...register(key)}
                  className="p-2 border w-[300px] rounded"
                />
              )}

              {/* Textfield Input */}
              {config.editor === "textfield" && (
                <input
                  type="text"
                  defaultValue={config.prefill || ""}
                  placeholder={config.placeholderValue || ""}
                  {...register(key)}
                  className="p-2 border rounded"
                />
              )}
            </div>}</>
        );
        })}
        {error && <p className="text-red-600 mt-2">{error}</p>}

        <button
          type="submit"
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
      </form>
    </div>
  );
};

export default ActorForm;
