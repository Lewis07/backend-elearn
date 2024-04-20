import mongoose from "mongoose";

export function createModel(modelName: string, schema: any) {
    return mongoose.model(modelName, schema);
}