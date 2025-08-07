import { response } from "express";
import jwt from "jsonwebtoken";
const validatekey = async (req, res) => {
  const { apiKey } = req.body;

  try {
    const response = await fetch("https://api.apify.com/v2/users/me", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    const user = data.data;
    if (!response.ok) {
      return res.json({
        valid: false,
        error: data.error?.message || "Invalid key",
      });
    }
    const token = jwt.sign({ apiKey: apiKey }, "shhhhh");
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.json({
      valid: true,
      user: { ...user.profile, email: user.email },
    });
  } catch (err) {
    console.error("Error in validateKey:", err);
    return res.status(500).json({ valid: false, error: err.message });
  }
};
const verifyUser = async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    const data = jwt.verify(token, "shhhhh");
    const response = await fetch("https://api.apify.com/v2/users/me", {
      headers: {
        Authorization: `Bearer ${data.apiKey}`,
      },
    });
    const UserData = await response.json();

    const user = UserData.data;
    if (!response.ok) {
      return res.json({
        valid: false,
        error: data.error?.message || "Invalid key",
      });
    }
    return res
      .status(202)
      .json({ valid: true, user: { ...user.profile, email: user.email } });
  }
};
const fetchActor = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, "shhhhh");

    // Step 1: Get all actors
    const response = await fetch("https://api.apify.com/v2/acts", {
      headers: {
        Authorization: `Bearer ${decoded.apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error?.message || "Failed to fetch actors",
      });
    }

    const actors = data.data.items;

    // Step 2: Fetch details for each actor
    const detailedActors = await Promise.all(
      actors.map(async (actor) => {
        const detailResponse = await fetch(
          `https://api.apify.com/v2/acts/${actor.id}`,
          {
            headers: {
              Authorization: `Bearer ${decoded.apiKey}`,
            },
          }
        );
        const detailData = await detailResponse.json();
        return detailData.data; // This includes description, image, etc.
      })
    );

    return res.json({
      success: true,
      actors: detailedActors,
    });
  } catch (error) {
    console.error("Error fetching actors:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const fetchForm = async (req, res) => {
  const { actorId } = req.body;

  try {
    const result = await fetch(`https://api.apify.com/v2/acts/${actorId}/`);
    const detailResult= await result.json();
    const data=detailResult?.data;
    

    const response = await fetch(`https://api.apify.com/v2/acts/${actorId}/builds/default`);
const detailData = await response.json();
const inputSchema = detailData?.data?.actorDefinition?.input;


    
    if (inputSchema) {
      res.json({inputSchema:inputSchema.properties,data:data}); // Return only the input schema
    } else {
      res.status(404).json({ error: "Input schema not found in build metadata." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch actor build details." });
  }
};
const runActor = async (req, res) => {
  try {
    const { actorId, input } = req.body;
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify JWT and extract API key
    let decoded;
    try {
      decoded = jwt.verify(token, "shhhhh");
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Start the actor run
    const startRes = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${decoded.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );

    const startData = await startRes.json();
   console.log(startData);
   
    if (!startData.data || !startData.data.id) {
      return res
        .status(500)
        .json({ error: "Failed to start actor run", details: startData });
    }

    const runId = startData.data.id;

    // Polling for run status
    let status = "READY";
    let datasetId = null;

    while (status !== "SUCCEEDED") {
      await new Promise((r) => setTimeout(r, 5000)); // wait 5 seconds before each poll

      const statusRes = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${decoded.apiKey}`
      );

      const statusData = await statusRes.json();

      if (!statusData.data || !statusData.data.status) {
        return res
          .status(500)
          .json({ error: "Failed to get run status", details: statusData });
      }

      status = statusData.data.status;

      if (status === "FAILED") {
        return res
          .status(500)
          .json({ error: "Actor run failed", details: statusData });
      }

      datasetId = statusData.data.defaultDatasetId;

      // If still running or queued, continue loop
    }
    console.log("hello");
    
    if (!datasetId) {
      return res
        .status(500)
        .json({ error: "No dataset ID found after run completion" });
    }

    // Fetch results from dataset
    const resultsRes = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${decoded.apiKey}`
    );

    if (!resultsRes.ok) {
      const errorText = await resultsRes.text();
      console.log(errorText);
      
      return res
        .status(500)
        .json({ error: "Failed to fetch results", details: errorText });
    }

    const results = await resultsRes.json();
    return res.json(results);
  } catch (error) {
    console.error("runActor error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout Successfully !" });
};

export default fetchActor;

export { validatekey, fetchActor, verifyUser, fetchForm, runActor,logout };
