const express =require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const foodRoutes = require("./routes/foodroutes");
const orderRoutes = require("./routes/orderroutes");
const cartRoutes = require("./routes/cartroutes");
const adminRoutes = require("./routes/adminroutes");
const {protect} = require("./middleware/authmiddleware");
const {notFound, errorHandler} = require("./middleware/errormiddleware");
                                                    
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/food-items", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);


app.get('/', (req, res) => {
    res.status(200).json({message:"Food Ordering API is Running Successfully"})
});
app.get('/api/protected', protect, (req, res) => {
    res.status(200).json({message:"You have accessed a protected route",user:req.user})
});

app.use(notFound);    
app.use(errorHandler);

const PORT = process.env.PORT||8000

const startServer = async () => {await connectDB();
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);
})
}
startServer();

module.exports = app;
