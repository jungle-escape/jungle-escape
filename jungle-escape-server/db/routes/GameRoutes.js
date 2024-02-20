import { Router } from "express";
import gameRecordService from "../services/recordService.js";
import { login_required } from "../middlewares/login_requires.js";

const gameRecordRouter = Router();

//create: post
gameRecordRouter.post("/rank/register", async function (req, res, next) {
  try {
    console.log(
      "[gameRecordRouter] gameRecordRouter 진입 성공, req.body",
      req.body
    );
    //check req type
    if (Object.keys(req.body).length === 0) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요."
      );
    }

    // get data from req
    const winner = req.body.winner;
    const endtime = req.body.endtime;
    const participants = req.body.participants;

    // create record
    const newRecordInput = {
      winner,
      endtime,
      participants,
    };

    const newRecord = await gameRecordService.addRecord(newRecordInput);

    res.status(201).json(newRecord);
  } catch (error) {
    next(error);
  }
});

gameRecordRouter.get("/rank/records", async function (req, res, next) {
  try {
    console.log(
      "[gameRecordRouter] gameRecordRouter.get 진입 성공, req.body",
      req.body
    );
    const allRecords = await gameRecordService.getRecord();

    res.status(250).json(allRecords);
  } catch (error) {
    next(error);
  }
});

export { gameRecordRouter };
