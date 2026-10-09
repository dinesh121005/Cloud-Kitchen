import mongoose from "mongoose"

const connectDb=async () => {
    try {
        const url = process.env.MONGODB_URI || process.env.MONGODB_URL
        await mongoose.connect(url)
        console.log("MongoDB Atlas connected successfully")
    } catch (error) {
        console.error("MongoDB Atlas connection error:", error.message)
    }
}

export default connectDb