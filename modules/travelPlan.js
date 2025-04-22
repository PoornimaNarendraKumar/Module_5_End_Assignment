const mongoose = require('mongoose')
const planSchema = new mongoose.Schema({
    destination:String,
    startDate:Date,
    endDate:Date,
    activities:[String]
})

const TravelPlan =mongoose.model('plans',planSchema)


module.exports=TravelPlan