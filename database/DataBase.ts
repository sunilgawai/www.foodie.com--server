import { DB_URL } from "../config";
import mongoose from "mongoose";


class DataBase {
    static connectToDB() {
        return mongoose.connect(DB_URL!)
            .then(()=> console.log(`connected to database!`))
            .catch((e)=> console.log(`database connection failed! ${e}`))
    }

    static seed() {
        // Seeding DataBase with the categories and products from data folder.
        
    }
}

export default DataBase;