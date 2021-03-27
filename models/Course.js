const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a course description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipsAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});


CourseSchema.statics.getAverageCost = async function(bootcampId){
  console.log(bootcampId);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId}
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition'}
      }
    }
  ]);

  try{
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
      averageCost: Math.ceil(obj[0].averageCost /10) * 10
    });
  }catch(err){ 
    console.log('Error');
  }
}



// Call getAverageCost after save
CourseSchema.post("save", function(){
  // since we are in the model we can do
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before removal
CourseSchema.pre("remove", function(){
  this.constructor.getAverageCost(this.bootcamp);
})


module.exports = mongoose.model("Course", CourseSchema);
