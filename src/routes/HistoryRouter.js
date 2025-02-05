const express = require("express");
const historyRouter = express.Router();

const {
  createHistory,
  getHistoriesByUserId,
  deleteHistory,
  getHistories,
  getHistoriesById,
} = require("../app/controllers/HistoryController");
const {
  validateToken,
  validateTokenAdmin,
} = require("../app/middleware/validateTokenHandler");

historyRouter.post("/", validateToken, createHistory);
historyRouter.get("/", validateTokenAdmin, getHistories);
historyRouter.get("/users/:user_id", validateToken, getHistoriesByUserId);
historyRouter.get("/:history_id", validateToken, getHistoriesById);
historyRouter.delete("/:history_id", validateToken, deleteHistory);

module.exports = historyRouter;
