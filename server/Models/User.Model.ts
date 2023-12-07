import mongoose, { Model, Schema, Document } from "mongoose";
import bcrypt from 'bcryptjs'
require('dotenv').config();
import  Jwt  from "jsonwebtoken";

const validator = require('validator');

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{courseId: string}>;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
};

const userSchema: Schema<IUser> = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        validate: {
          validator: function (value: string) {
            return validator.isEmail(value);
          },
          message: 'Please enter a valid email address!',
        },
        unique: true,
      },
    password:{
        type:String,
        required: [true, "please enter your password"],
        minlength:[6, 'Password must be at least 6 characters'],
        select:false,
    },
    avatar:{
        public_id: String,
        url: String
    },
    role:{
        type:String,
        default:'user',
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    courses:[
        {
            courseId:String,
        }
    ],

}, {timestamps:true});

// Hash password.
userSchema.pre<IUser>('save', async function(next){
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// sign access token
userSchema.methods.SignAccessToken = function(){
    return Jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || '');
};

// sign refresh token
userSchema.methods.SignRefreshToken = function(){
    return Jwt.sign({id:this._id}, process.env.REFRESH_TOKEN || '');
}

// compare password
userSchema.methods.comparePassword = async function (enteredPassword:string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
}

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;