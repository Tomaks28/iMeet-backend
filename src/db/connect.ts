import { connect } from "mongoose";

const dbConnect = () => {
  if (!process.env.MONGODB_URI) {
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
