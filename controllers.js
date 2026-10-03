
import "dotenv/config";
import pg from "pg";
const { Pool } = pg;

const pool=new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT
});

const COLUMNS=`
            id,
            title,
            amount::float8 AS amount,
            category,
            to_char(date, 'YYYY-MM-DD') AS date
            `;

export const CATEGORIES = ["Food", "Transport","Bills", "Entertainment", "Other"];


export const getAllExpenses=async (req,res)=>{

    try {
        const result=await pool.query(`SELECT 
            ${COLUMNS}
            FROM expenses ORDER BY id`);

            res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({message:"Failed to fetch expenses"});
    }    
}

export const getExpenseById=async (req,res)=>{

    const id=req.params.id;


    
    try{
        const result=await pool.query(
            `SELECT ${COLUMNS} From expenses WHERE id=$1`,[id]
        );

        if(result.rows.length===0){
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json(result.rows[0]);

    }catch(error){
        res.status(500).json({ message: "Failed to fetch expense" });
    }

};

export const createExpense=async (req,res) =>{

    const {title, amount, category,date}=req.body;


    try{
        const result=await pool.query(
            `
            INSERT INTO expenses (title,amount,category,date)
            VALUES ($1,$2,$3,$4)
            RETURNING ${COLUMNS}
            `,[title,amount,category,date]
        );
        
        res.status(201).json(result.rows[0]);

    }catch(error){
        res.status(500).json({ message: "Failed to create expense" });
    }


}

export const ValidateId=(req,res,next)=>{
    const id=req.params.id;

    if(!/^\d+$/.test(id)){
        return res.status(404).json({ message: "Invalid id" });
    }

    next();

}

export const ValidateExpense=(req,res,next)=>{

    const {title,amount, category,date}=req.body ?? {};
    if(!title || typeof title !=="string" || title.trim() === ""){
        return res.status(400).json({
            message: "Title is required and must be a non-empty string"
        });
    }

    if(typeof amount !== "number" || Number.isNaN(amount) || amount <=0){
        return res.status(400).json({
            message: "amount is required and must be a number greater than 0"
        });
    }

    if(!category || !CATEGORIES.includes(category)){
        return res.status(400).json({
            message:`category is required and must be one of:${CATEGORIES}`
        });
    }

    if(!date || Number.isNaN(Date.parse(date))){
                return res.status(400).json({
            message:"date is required and must be a valid date (YYYY-MM-DD)"
        });
    }

    next();

}


export const updateExpense=async (req,res) =>{
    const id=req.params.id;
    const { title, amount, category, date } = req.body;

    try{
        const result=await pool.query(`
            UPDATE expenses   
            SET title = $1, amount = $2, category = $3, date = $4
            WHERE id= $5
            RETURNING ${COLUMNS}
            `,[title,amount,category,date,id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json(result.rows[0]);

    }catch(error){
        res.status(500).json({message:"Failed to update expense"});
    }
    

}


export const deleteExpense= async (req,res) =>{

    const id=req.params.id;

    try{

        const result=await pool.query(
            `
            DELETE FROM expenses WHERE id=$1 RETURNING ${COLUMNS}
            `,[id]
        );

         if (result.rows.length === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }
                
        res.status(200).json(result.rows[0]);


    }catch(error){
        res.status(500).json({ message: "Failed to delete expense" });
    }

}
