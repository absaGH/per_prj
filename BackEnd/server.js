const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());//allow frontend requests
app.use(express.json());//pase JSON data

// MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: 'root', // Your MySQL password
  database: 'todo_db' // Your database name
};

// Create a connection pool (recommended for web apps)
const pool = mysql.createPool(dbConfig);

pool.getConnection()
  .then(conn => {
    console.log('Connected to MySQL');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection failed:', err.message);
  });


// Test endpoint
app.get('/', (req, res) => {
  res.send('MySQL with Express is working!');
});

// Get all tasks
app.get('/tasks', async(req, res) => {
  try{
    const [rows] = await pool.query('SELECT * FROM tasks WHERE status = ?', ['In progress']);
    return res.json(rows);
  }catch(err){
    console.log(err);
    return res.status(500).send('Server error');
  }
  //return res.send('MySQL with Express is working!');
});


//API Endpoint to Add Data
// Create task
app.post('/tasks', async(req, res) => {
  const { task_detail, start_date, finish_date, start_time, finish_time, status } = req.body;
  
  try{
    const [result] = await pool.query(
      'INSERT INTO tasks (id, task_detail, start_date, finish_date, start_time, end_time, status) VALUES (UUID(),?, ?, ?, ?, ?, ?)',
    [task_detail, start_date, finish_date, start_time, finish_time, status],
    );
    return res.status(201).json({ id: result.insertId});
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  } 
});


app.patch('/tasks/:id', async(req, res) =>{
    try{
        const taskId = req.params.id;
        const updates = req.body;
        console.log(!taskId);
        if(!taskId) {
            return res.status(400).json({error: 'Invalid task Id'});
        }

        if(!updates || Object.keys(updates).length === 0){
            return res.status(400).json({error: 'No update data provided'});
        }

        const setClause = Object.keys(updates)
            .map(key => `${key} = ?`)
            .join(', ');

        const values = Object.values(updates);
        values.push(taskId);

        console.log(setClause);
        console.log(values);

        const [result] = await pool.query(
            `UPDATE tasks SET ${setClause} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'task not found'});
        }else {
            return res.status(200).json({success: 'task Modified'});
        }
    } catch(error){
        console.error('Error updating user:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
});

//Remove task from database
app.delete('/tasks/:item', async(req, res) => {
    try{
        const itemID = req.params.item;
        //console.log(itemName);
        //console.log(typeof itemName);

        if(!itemID) {
            return res.status(400).json({error: 'No ID provided', itemName: itemName});
        } 

        const [result] = await pool.query(
          'DELETE FROM tasks WHERE id = ?', [itemID]  
        );

        //console.log(result);

        if (result.affectedRows == 0) {
            return res.status(404).json({error: 'Task not found'});
        }else {
            return res.status(200).json({success: 'Task Removed'});
        }

    }catch(error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({error: 'Internal server eror'});
    }
});

// Start Server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
