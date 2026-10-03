# Expense Tracker

Track expenses is a web app to track the personal expenses: add, edit and delete expenses, filter them by category or search by title, and see the total, the number of expenses and the highest one at a glance.

the front-end (HTML, CSS, JS, Bootstrap) talks to a Node.js and Express API that stores everything in POstgreSQL.

## How to run

You need [Node.js](https://nodejs.org), PostgreSQL with pgAdmin, and VS Code (you can use **Live Server** extension).

**Backend**

 
1. In pgAdmin, create a database named for example `expense_tracker`. Open its Query Tool (the tab must say `expense_tracker`), load `backend/schema.sql` and run it. It creates the `expenses` table with 8 sample rows (running it again resets the data).

2. In the `backend` folder, copy `.env.example` to `.env` and write your own values:
```
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=expense_tracker
   DB_PASSWORD=your_password_here
   DB_PORT=5432
```

3. In the `backend` folder, install the packages:
```
   npm install express cors pg dotenv
```

   (`npm install` alone is enough if `package.json` already lists them.) `express` runs the server and routes, `cors` lets the front-end call the API, `pg` connects to PostgreSQL and `dotenv` reads `.env`. `package.json` must contain `"type": "module"`.

4. Start the server and keep the terminal open:
 
```
   node server.js
```
 
   You should see `Server is running on port 3000`. To test it, open <http://localhost:3000/api/expenses>: you should see the expenses as JSON.

**Frontend**


1. Make sure the backend is running (the page loads its data from the API).
2. Open the `frontend` folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**.
4. The app opens in the browser. If you ever change the backend port, update `API_URL` at the top of `frontend/js/app.js`.


**Common problems**
 
| Error | Cause and fix |
|---|---|
| `password authentication failed` | Wrong `DB_PASSWORD` in `.env` |
| `relation "expenses" does not exist` | `schema.sql` was run on the wrong database. Run it again on `expense_tracker` |
| `ECONNREFUSED` | PostgreSQL is not running |
| `Cannot use import statement outside a module` | Missing `"type": "module"` in `package.json` |
| `Cannot find package 'express'` | Run `npm install` inside the `backend` folder |
| The page shows "Cannot reach the server" | The backend is not running. Start it with `node server.js` |


## Features
 
- [x] Add an expense (with validation)
- [x] Delete an expense
- [x] Edit an expense
- [x] Filter by category
- [x] Summary cards (total, count, highest)
- [x] Data is saved in a PostgreSQL database


Extras:
 
- [x] Search by title (works together with the category filter)
- [x] Dark mode (the choice is saved in the browser)
- [x] Loading spinner while a request is running
- [x] Clear alerts for success and errors, including when the server is off
- [x] Responsive layout

## Screenshots

**Desktop**
 
![Desktop view](image/Light Mode.png)
 
**Mobile**
 
![Mobile view](\image\mobile.png)
![Mobile view](\image\mobile 2.png)


**Dark mode**
 
 
![Dark Mode](\image\Dark Mode.png)
 
## What was the hardest part?

The hardest part was the edit modal: it had to open with the data of the expense I clicked, and saving had to update that exact expense. I stored the expense id in a `data-id` attribute on each Edit button, read it with `event.relatedTarget` and filled the form from the `expenses` array, and kept the id on the form (`editForm.dataset.id`) so the Save button knows which expense to send in the PUT request.
