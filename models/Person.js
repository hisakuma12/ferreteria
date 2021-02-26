const { model, Schema } = require("mongoose");
const validator = require("validator");
const PersonSchema = Schema({
  name: {
    type: String,
    required: [true, "Person name is required"],
    maxLength: [30, "Person name cannot exceed 30 character"],
  },
  lastName: {
    type: String,
    required: [true, "Person last name is required"],
    maxLength: [30, "Person name cannot exceed 30 character"],
  },
  email: {
    type: String,
    maxLength: [50, "Person email cannot exceed 50 character"],
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  address: {
    type: String,
    maxLength: [200, "Person name cannot exceed 30 character"],
  },
  typeOfPerson: {
    type: String,
    required: [true, "Plese select type of this Person"],
    enum: {
      values: ["Cliente", "Proveedor"],
      message: "Please select correct type for Person",
    },
  },
  phone: {
    type: String,
    maxLength: [15, "Person phone cannot exceed 15 character"],
  },
  ruc: {
    type: Number,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Person", PersonSchema);
