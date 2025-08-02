# Apify Scraper Assignment

This repository contains my completed assignment for the Fullstack Development task using the MERN stack and Apify Actors.  
The goal of the assignment was to build a working scraper integration with a clean frontend, functional backend, and proper deployment.

---

## 📝 Assignment Overview

The assignment required me to:

1. **Integrate an Apify Actor** (e.g., Instagram Scraper) into a MERN stack application.
2. **Build a backend service** that securely connects to the Apify API using an API token.
3. **Create a frontend interface** where users can trigger a scraper run and view the results.
4. **Store or display scraped data** in a structured and user-friendly format.
5. **Deploy the project** so it can be tested online without manual setup.

---

## 💡 My Approach

1. **Actor Selection**  
   I chose the **Instagram Scraper Actor** from Apify because it provides structured and meaningful data for demonstration.

2. **Backend Development**  
   - Built with **Node.js + Express.js**.
   - API calls to Apify are authenticated via a **secure API token stored in `.env`**.
   - Results are fetched, validated, and returned to the frontend.

3. **Frontend Development**  
   - Developed using **React.js and Tailwind CSS**.
   - Provides a simple UI for entering actor URLs or using a predefined test actor.
   - Displays results dynamically after the backend fetches data.

4. **Deployment**  
   - **Frontend** deployed on **Vercel**.  
   - **Backend** deployed on **Render**.  
   This allows the project to be accessed online without local setup.

5. **Error Handling & Validation**  
   - Handled invalid inputs and failed API requests gracefully.
   - Used loading states and clear messages for better user experience.

---

## 🚀 Live Demo

- **Frontend (React on Vercel)**: https://your-frontend.vercel.app  
- **Backend (Node.js on Render)**: https://your-backend.onrender.com  

---

## 📦 Local Installation & Setup

### Clone the Repository
```bash
git clone https://github.com/your-username/assignment-repo.git
cd assignment-repo
