var mongoose  =  require('mongoose');  
   
var excelSchema = new mongoose.Schema({  
    name:{  
      type:String  
   },  
   email:{  
      type:String  
   },    
   mobile:{  
      type:Number  
   },
   dob:{  
      type:String 
   }, 
   work:{  
      type:String  
   }, 
   resume:{
      type:String
   },
   location:{
      type:String
   },
   address:{
      type:String
   },
   employer:{
      type:String
   },
   designation:{
      type:String
   }
});  
   
module.exports = mongoose.model('userModel',excelSchema);  