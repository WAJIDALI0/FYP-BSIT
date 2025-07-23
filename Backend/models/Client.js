// models/Client.js
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  companyName: String,
  role: {
    type: String,
    enum: ["admin", "client"],
    default: "client",
  },
}, { timestamps: true });

const Client = mongoose.model("Client", clientSchema);
export default Client;
