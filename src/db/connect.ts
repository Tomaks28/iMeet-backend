import { connect } from "mongoose";

const dbConnect = () => {
  if (!process.env.MONGODB_URI) {
    // Can be simulated at "//localhost/imeet" fro example
    throw Error("[ENV] Missing process.env.MONGODB_URI");
  }

  return connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) {
        console.error("Could not connect to mongodb.");
      }
    }
  );
};

export { dbConnect };
