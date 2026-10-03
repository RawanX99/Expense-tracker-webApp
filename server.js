import express from 'express'
import cors from 'cors'
import{
    getAllExpenses,
    getExpenseById,
    createExpense,
    ValidateExpense,
    ValidateId,
    updateExpense,
    deleteExpense
}from "./controllers.js";

const PORT=3000;
const app=express();
const apiRoute=express.Router();

app.use(cors());
app.use(express.json());

apiRoute.get("/expenses",getAllExpenses);
apiRoute.get("/expenses/:id",ValidateId,getExpenseById);
apiRoute.post("/expenses",ValidateExpense,createExpense);
apiRoute.put("/expenses/:id",ValidateId,ValidateExpense,updateExpense);
apiRoute.delete("/expenses/:id",ValidateId,deleteExpense);


app.use("/api",apiRoute);

app.use((req, res) => {
    res.status(404).json({ message: `No route matches  ${req.originalUrl}` });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));



