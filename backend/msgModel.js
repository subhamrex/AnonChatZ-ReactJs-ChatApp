import mongoose from 'mongoose'

const msgSchema = mongoose.Schema({ 
    username:String, 
    message:String,
    timestamp:String
})

export default mongoose.model("messages",msgSchema);