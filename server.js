const express = require("express");

const server = express();

server.use(express.json());

const db = require("./data/dbConfig");

server.get("/", (req, res) => {
  res.send('welcome to the "/"');
});

server.get("/projects", async (req, res) => {
  try {
    const projects = await db("projects");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.get("/projects/:id", async (req, res) => {
  try {
    const projectData = await db("projects")
      .join("actions", "actions.project_id", "projects.id")
      .where({ "projects.id": req.params.id });

    if (projectData) {
      console.log("makes it here");
      const {
        id,
        project_name,
        project_description,
        project_completed
      } = projectData[0];
      console.log({
        id,
        project_name,
        project_description,
        project_completed
      });
      const actions = projectData.map(action => ({
        action_id: action.action_id,
        action_name: action.action_name,
        action_description: action.action_description,
        notes: action.notes,
        action_completed: action.action_completed
      }));
      console.log(actions);
      return res.status(200).json({
        id,
        project_name,
        project_description,
        project_completed,
        actions
      });
    }
    res.status(404).json({
      message: "project with that id does not exist in our database"
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

server.post("/projects", async (req, res) => {
  console.log(req.body);
  if (req.body.project_name && req.body.project_description) {
    try {
      const post = await db("projects").insert({
        project_name: req.body.project_name,
        project_description: req.body.project_description,
        project_completed: false
      });
      res.status(203).json(post);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json({ message: "please fill out required fields" });
  }
});

server.get("/actions", async (req, res) => {
  try {
    const actions = await db("actions");
    res.status(200).json(actions);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.post("/actions", async (req, res) => {
  console.log(req.body);
  if (
    !isNaN(req.body.project_id) &&
    req.body.action_name &&
    req.body.action_description
  ) {
    try {
      const post = await db("actions").insert({
        project_id: req.body.project_id,
        action_name: req.body.action_name,
        action_description: req.body.action_description,
        notes: req.body.notes,
        action_completed: false
      });
      res.status(203).json(post);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json({ message: "please fill out required fields" });
  }
});

module.exports = server;
