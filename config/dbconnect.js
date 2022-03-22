import mongoose from 'mongoose'
const connectdb=async(DBURL)=>{
    try{
        const DB_OPTIONS={
dbName:"Authdatabase"
        }
        await mongoose.connect(DBURL,DB_OPTIONS);
        console.log("Hogya connect successfull")
    }
    catch(error){
        console.log("errrrrrr")
console.log(error)
    }
}
export default connectdb;