import GameRecord from "../model/GameRecord.js";

class gameRecordService {
  static convertTime(endtime) {
    const parts = endtime.split(":");
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    const milliseconds = parseInt(parts[2], 10);
    return minutes * 60000 + seconds * 1000 + milliseconds;
  }
  //create record
  static async addRecord({ winner, endtime, participants }) {
    //TODO:check winner, endtime, participants?
    const newRecord = { winner, endtime, participants };
    const createdRecord = await GameRecord.create({ newRecord });

    return createdRecord;
  }

  // get records
  static async getRecord() {
    const records = await GameRecord.findAll();

    records.sort((a, b) => {
      return (
        gameRecordService.convertTime(a.endtime) -
        gameRecordService.convertTime(b.endtime)
      );
    });

    return records;
  }
}

export default gameRecordService;
