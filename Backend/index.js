import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
// import { connection } from "mongoose";
import { Connection } from "./src/db/db.js"
import app from "./app.js"

Connection()
.then(()=>{
  app.listen(process.env.PORT,()=>{

    console.log(`this server is run at the port of ${process.env.PORT}`)
  })
    
})
.catch((error)=>{
console.groupCollapsed("There is an error of connect with datatbase",error)
})
