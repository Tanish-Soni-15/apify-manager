import express from "express";
import { fetchActor, fetchForm, logout, runActor, validatekey, verifyUser } from "../controller/apify.js";

const apifyRouter=express.Router();


apifyRouter.post('/validate-key',validatekey)
.post('/fetchForm',fetchForm)
.get('/logout',logout)
.post('/runActor',runActor)
.get('/fetchActors',fetchActor)
.get('/checkUser',verifyUser)

export {apifyRouter};