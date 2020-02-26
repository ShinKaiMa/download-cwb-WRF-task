import { Document, Schema, Model, model } from "mongoose";

export interface IOneWeeakForcast extends Document {
    sent: Date;
    dataid: string;
    timeStamp: Date;
    locations: ILocation[];
}

export interface ILocation extends Document {
    locationName: string;
    geocode: string;
    lat: string;
    lon: string;
    weatherElement: IWeatherElement[];
}

export interface IWeatherElement {
    elementName: string;
    description: string;
    time: ITime[];
}

export interface ITime {
    startTime: string;
    endTime: string;
    elementValue: IElementValue;
}

export interface IElementValue {
    value: string;
    measures: string;
}

let LocationSchema: Schema = new Schema({
    locationName: { type: String, required: true, index: true },
    geocode: { type: String, required: true, index: true },
    lat: { type: String, required: true, index: true },
    lon: { type: String, required: true, index: true },
    weatherElement: [Object]
});

let OneWeeakForcastSchema: Schema = new Schema({
    locations: [LocationSchema],
    // locations: { type: [Object] } ,
    dataid: { type: String, index: true },
    sent: { type: Date, index: true },
    timeStamp: { type: Date, index: true }
}, {
    collection: 'OneWeeakForcast', toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    }
});

// OneWeeakForcastSchema.add({locations: [LocationSchema]})


OneWeeakForcastSchema.pre<IOneWeeakForcast>("save", function (next) {
    if (!this.timeStamp) {
        let now = new Date();
        this.timeStamp = now;
    }
    next();
});

export const OneWeeakForcast: Model<IOneWeeakForcast> = model<IOneWeeakForcast>("OneWeeakForcast", OneWeeakForcastSchema);