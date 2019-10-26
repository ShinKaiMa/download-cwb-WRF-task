import {Document, Schema, Model, model} from "mongoose";

export interface IDataStatus extends Document {
  source: string;
  fileType: string;
  area:string;
  dataType:string;
  path: string;
  status:string;
  byte:number;
  startDate:Date;
  endDate:Date;
  forcastHour:Number;
  incrementHours:number;
  timeStamp: Date;
}

let DataStatusSchema: Schema = new Schema({
  source:{ type: String, required: true , index: true },
  fileType: { type: String, required: true , index: true},
  area:{ type: String, required: true , index: true},
  dataType:{ type: String, required: true , index: true},
  path: { type: String, required: true , index: true},
  status: {type: String, required: true , index: true},
  byte: {type: Number, required: true , index: true},
  startDate: {type: Date, required: true , index: true},
  endDate: {type: Date, required: true , index: true},
  forcastHour: {type: Number, required: true , index: true},
  incrementHours: {type: Number, required: true , index: true},
  timeStamp: { type: Date , index: true}
},{collection: 'DataStatus'});

DataStatusSchema.pre<IDataStatus>("save", function (next) {
  if (!this.timeStamp) {
    let now = new Date();
    this.timeStamp = now;
  }
  next();
});

export const DataStatus: Model<IDataStatus> = model<IDataStatus>("DataStatus", DataStatusSchema);