import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL!);
    isConnected = true;

    const connection = mongoose.connection;

    if (connection.listenerCount("connected") === 0) {
      connection.on("connected", () => {
        console.log("MongoDb connected succesfully");
      });
    }

    if (connection.listenerCount("error") === 0) {
      connection.on("error", (err) => {
        console.log(
          "MongoDB connection error.Please make sure MongoDb is running " + err,
        );
        process.exit();
      });
    }
  } catch (error) {
    console.log("Something went wrong");
    console.log(error);
  }
}
