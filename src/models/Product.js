const mongosee = require("mongoose");
const comicSchema = mongosee.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Comic = mongosee.model("Comic", comicSchema);
module.exports = Comic;
