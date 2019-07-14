import {Document, Schema, Model, model} from "mongoose";

export interface IDataStatus extends Document {
  dataType: string;
  path: string;
  timeStamp: Date;
}

const DataStatusSchema: Schema = new Schema({
  dataType: { type: String, required: true , index: true},
  path: { type: String, required: true , index: true},
  timeStamp: { type: Date, required: true , index: true}
});

export const DataStatus: Model<IDataStatus> = model<IDataStatus>("DataStatus", DataStatusSchema);