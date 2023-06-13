import mongoose from "mongoose";

const connect = () => {
  mongoose
    .connect(process.env.DB_URI as string)
    .then(() => {
      console.log("Connect successfully");
    })
    .catch((e) => {
      console.log(e);
    });
};

export default connect;
