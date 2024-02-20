import GameRecordModel from "../schemas/GameRecords.js";

class GameRecord {
  //create
  static async create({ newRecord }) {
    const createdNewRecord = await GameRecordModel.create(newRecord);
    return createdNewRecord;
  }

  //get all records
  static async findAll() {
    const records = await GameRecordModel.find({});
    return records;
  }
}

export default GameRecord;
