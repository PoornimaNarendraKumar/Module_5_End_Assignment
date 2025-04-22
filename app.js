const express = require('express')
const mongoose = require('mongoose')
const TravelPlan = require('./modules/travelPlan')
const app = express()
const port = 3000;

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hello World")
})

// async function main() {
//     await mongoose.connect(
//         'mongodb+srv://poornimanarendransn:lM5V5CwvOHmVknzW@cluster0.gelcp.mongodb.net/TravelDb?retryWrites=true&w=majority&appName=Cluster0'
//     );
//     console.log('Connected to MongoDB!');
// }
async function main() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("📡 Connecting to MongoDB...");

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

main()
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err))

    app.post('/plans', async (req, res) => {
        try {
            if (!req.body) {
                return res.status(400).json({ error: "Travel details cannot be empty" })
            }
            const plans = new TravelPlan(req.body)
            await plans.save();
            res.status(201).json(plans)
        }
        catch (error) {
            console.log(error)
            res.send(500).json(error)
        }
    })
    
    app.get('/plans', async (req, res) => {
        try {
            const plans = await TravelPlan.find()
            res.status(200).json(plans)
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    })

    app.get('/plans/:id', async (req, res) => {
        try {
            const planId = req.params.id;
            const plan = await TravelPlan.findById(planId)
            if (!plan) {
                return res.status(404).json({ 'message': 'Travel Plan not found' })
            }
            return res.status(200).json(plan); 
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    })

    app.patch('/plans/:id', async (req, res) => {
        try {
            const planId = req.params.id;
            console.log("Received PATCH for ID:", planId)
            if (!planId) {
                return res.status(400).json({ error: "Travel Plan Id is required" })
            }
            if (!req.body||Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: "Travel details cannot be empty" })
            }
            if (!mongoose.Types.ObjectId.isValid(planId)) {
                return res.status(400).json({ error: "Invalid Travel plan Id format" })
            }
            const plan = await TravelPlan.findByIdAndUpdate(planId,req.body,{new:true})
            res.status(200).json(plan);
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    })
    
    
    app.delete('/plans/:id', async (req, res) => {
        try {
            const planId = req.params.id;
            if (!planId) {
                return res.status(400).json({ error: "Travel plan Id is required" })
            }
           
            if (!mongoose.Types.ObjectId.isValid(planId)) {
                return res.status(400).json({ error: "Invalid travel plan Id format" })
            }
            const plan = await TravelPlan.findByIdAndDelete(planId)
            if(!plan){
              return  res.status(400).json({message:"Travel plan not found"})
            }else{
                return res.status(200).json({message:"Travel plan deleted sucessfully"})
            }
           
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    })

    app.listen(3000, () => {
        console.log("Server Started");
    })

