import Usermodel from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from "../config/emailconfig.js";
class UserController{
    static userRegistration=async(req,res)=>{
        const{name,email,password,password_confirmation,tc}=req.body
        const user=await Usermodel.findOne({email:email})//to check if email is already exists
        if(user){
            res.send({"status":"Failed","message":"Email already exists"})
        }

        else{
            if(name&&email&&password&&password_confirmation){//checking all fields are present
if(password==password_confirmation){
try{
    const salt=await bcrypt.genSalt(12)
    const hashpass=await bcrypt.hash(password,salt)//hash password creation

    const doc=new Usermodel({
        name:name,
        email:email,
        password:hashpass,
        tc:tc
    
    })
    await doc.save();
    const save_user=await Usermodel.findOne({email:email})
    //Generate JWT Token
    const token=jwt.sign({userID:save_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
    res.status(201).send({"status":"success","message":"Registration success","token":token})
}catch(error){
res.send({"status":"Failed","message":"Unable to register"})
}
}
else{
    res.send({"status":"Failed","message":"password and confirm pass doesnot matched"})
}
            }
            else
            {
                res.send({"status":"Failed","message":"All fields are required"})
            }
        }
    }

    static userLogin=async(req,res)=>{
        try{
            const {email,password}=req.body

        if(email&&password){
       const user= await Usermodel.findOne({email:email})
       if(user){
           const isMatch=await bcrypt.compare(password,user.password)//use to compare user saved hashed pass and user given pass in string
      if((user.email===email)&&isMatch){
        const token=jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
        res.send({"status":"success","message":"Login successfull","token":token})   
      }
      else{
        res.send({"status":"Failed","message":"Credentials are not valid"})   
      }
      
        }
       else{
        res.send({"status":"Failed","message":"User not registered"})  
       }
        }
        }catch(error){
  res.send({"status":"Failed","message":"All fields are required"})
        }
    }
    static changepassword=async(req,res)=>{
        const {password,password_confirmation}=req.body
        if(password&&password_confirmation){
            if(password==password_confirmation){
                const salt=await bcrypt.genSalt(12)
                const hashpass=await bcrypt.hash(password,salt)//hash password creation
                await Usermodel.findByIdAndUpdate(req.user._id,{$set:{password:hashpass}})
           console.log(req.user)
           res.send({"status":"Success","message":"New password and confirmation password match and updated successfully"})
           
            }
            else{
                res.send({"status":"Failed","message":"New password and confirmation password doesnot match"})
            }
        }
        else{
            res.send({"status":"Failed","message":"All fields are required"})  
        }
    }
    static detaillogineduser=async(req,res)=>{
        res.send({"userinfo":req.user})
    }
    static Resetpasswordemail=async(req,res)=>{
       const {email}=req.body;
       if(email){
           const user=await Usermodel.findOne({email:email})
           if(user){
               const secret=user._id+process.env.JWT_SECRET_KEY //creating scret key and then token using that key for 15 min
               const token=jwt.sign({userID:user._id},secret,{expiresIn:'15m'})
               const link=`https://127.0.0.1:3000/api/user/reset/${user._id}/${token}`//this link we will be send to front end to given new pass
               console.log(link)

            //    let info=await transporter.sendMail({
            //        from:process.env.EMAIL_FROM,
            //        to:user.email,
            //        subject:"Password Reset Link",
            //        html:`<a href=${link}>Click Here</a>To reset your password`
            //    })
               res.send({"status":"Success","message":"Reset Password mail is sent....  Please check your Email","info":info})
         
            }else{
            res.send({"status":"Failed","message":"Email doesnot exists"})
           }
       }else{
        res.send({"status":"Failed","message":"Email field is required"}) 
       }
    }

 static passwordreset=async(req,res)=>{
     const {password,password_confirmation}=req.body
     const {id,token}=req.params
     const user=await Usermodel.findById(id)
     const newtoken=user._id+process.env.JWT_SECRET_KEY
     try{

        jwt.verify(token,newtoken)
        if(password&&password_confirmation){
if(password==password_confirmation){
    const salt=await bcrypt.genSalt(12)
const hashpass=await bcrypt.hash(password,salt)
await Usermodel.findByIdAndUpdate(user._id,{$set:{password:hashpass}})
res.send({"status":"Success","message":"Password updated "})
}else{
    res.send({"status":"Success","message":"New password and confirmation password match"})
}
        }else{
            res.send({"status":"Failed","message":"All fields are required"})
        }
     }catch(error){
         console.log(error)
         res.send({"status":"Failed","message":"Invalid Token"}) 
     }
 } 
}

export default UserController