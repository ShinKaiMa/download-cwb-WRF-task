import {Document, Schema, Model, model} from "mongoose";

export interface IDataStatus extends Document {
  dataType: string;
  path: string;
  status:string;
  byte:number;
  timeStamp: Date;
}

let DataStatusSchema: Schema = new Schema({
  dataType: { type: String, required: true , index: true},
  path: { type: String, required: true , index: true},
  status: {type: String, required: true , index: true},
  byte: {type: Number, required: true , index: true},
  timeStamp: { type: Date , index: true}
});

DataStatusSchema.pre<IDataStatus>("save", function (next) {
  let now = new Date();
  if (!this.timeStamp) {
    this.timeStamp = now;
  }
  next();
});

export const DataStatus: Model<IDataStatus> = model<IDataStatus>("DataStatus", DataStatusSchema);