//import dependencies
import express from 'express'
import mongoose from 'mongoose'
import Pusher from 'pusher'
import cors from 'cors'
import mongoMsg from './msgModel.js'

//app config
const app = express();
const port = process.env.PORT || 3030

const pusher = new Pusher({
    appId: "1131056",
    key: "a6c7cc7a189a946d1d3f",
    secret: "944c0c4eb2a8012c0b3b",
    cluster: "ap2",
    useTLS: true
  });
  
  

//middlewares
app.use(express.json());
app.use(cors());
//db config
const url= "mongodb+srv://rex:kundu123@cluster0.m33ds.mongodb.net/msgDb?retryWrites=true&w=majority";
 mongoose.connect(url,{ 
     useCreateIndex: true,
     useNewUrlParser: true,
     useUnifiedTopology: true
 })

 mongoose.connection.once('open',()=>{
     console.log("DB connected");

     const changeStream = mongoose.connection.collection('messages').watch();
     changeStream.on('change',(change)=>{
               
        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;//
            pusher.trigger('messages','inserted',{
                username:messageDetails.username,////--> 'change': change 
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,

            })
        } else{
            console.log('Error triggering Pusher')
        }
     })
 })
//api routes
app.get('/', (req,res) => {
    res.status(200).send("I am done")
})

app.post('/save/messages', (req,res) => {
    const dbmsg = req.body

    mongoMsg.create(dbmsg,(err,data) => {
        if(err) {
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data);
        }
    })
})

app.get('/retrieve/messages',(req, res) => {
    mongoMsg.find((err,data) => {
        if(err) {
            res.status(500).send(err);
        }
        else{
            data.sort((b,a)=>{
                return a.timestamp - b.timestamp;
            })
            res.status(200).send(data);
        }
    })
})
//listen
app.listen(port, () => console.log(`Server is running at port ${port}`))