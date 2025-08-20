// Fetch Users from Backend
/*async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:5001/tasks');
    const tasks = await response.json();

    const container = document.querySelector('.taskContainer'); // Replace with your actual container

    container.innerHTML = tasks.map(task => 
      `<div class="tasks js-tasks" data-task-id="${task.id}">
            <!-- First Row: Task Input -->
            <div class="row">
              <input type="text" class="inSchedule" placeholder="Enter task..." value="${task.task_detail || ''}>
            </div>
            <!-- Date and Time Pickers -->
            <div class="row">  
              <div class="date-time-group">
                <!-- Date Column -->
                <div class="Date-Container">
                  <div class="level-1">
                    <label for="start_date">Start_Date:</label>
                    <input type="date" id="start_date" name="start_date" value="${formatDateForInput(task.start_date)}">
                  </div>
                  <div class="level-1">
                    <label for="finish_date">Finish_Date:</label>
                    <input type="date" id="finish_date" name="Finish_date" value="${formatDateForInput(task.finish_date)}">
                  </div>
                </div>

                <div class="Time-container">
                  <div class="level-1">
                    <label for="start_time">Start_Time:</label>
                    <input type="time" id="start_time" name="start_time" value="${task.start_time || ''}">
                  </div>
                  <div class="level-1">
                    <label for="finish_time">Finish_Time:</label>
                    <input type="time" id="finish_time" name="Finish_time" value="${task.finish_time || ''}">
                  </div>
                </div>
              </div>
            </div>
            <!-- Buttons -->
            <div class="row">
              <div class="applybtn">
                <button class="schedule-btn">Save/Update</button>
                <button class="remove-btn">Remove</button>
              </div>
            </div>
        </div>`
    ).join('');
  } catch (error) {
    console.error('Error fetching users:', error);
  }

  addTaskEventListeners();
}

// Helper function to format MySQL date for HTML input
function formatDateForInput(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

function addTaskEventListeners() {
  document.querySelectorAll('.schedule-btn').forEach(btn => {
    btn.addEventListener('click', handleSaveTask);
  });
  
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', handleRemoveTask);
  });
}

// Add your save/remove handlers here
async function handleSaveTask(e) {
  console.log('save clicked');
  const taskElement = e.target.closest('.js-tasks');
  const taskId = taskElement.dataset.taskId;
  
  const taskData = {
    task_detail: taskElement.querySelector('.inSchedule').value,
    start_date: taskElement.querySelector('[name="start_date"]').value,
    finish_date: taskElement.querySelector('[name="Finish_date"]').value,
    start_time: taskElement.querySelector('[name="start_time"]').value,
    finish_time: taskElement.querySelector('[name="Finish_time"]').value
  };

  console.log(taskData);

  try {
    const response = await fetch('http://localhost:5001/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    
    const result = await response.json();
    fetchTasks(); // Refresh the task list
  } catch (error) {
    console.error('Error saving task:', error);
  }
}

async function handleRemoveTask(e) {
  const taskId = e.target.closest('.js-tasks').dataset.taskId;
  
  try {
    await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    fetchTasks(); // Refresh the task list
  } catch (error) {
    console.error('Error removing task:', error);
  }
}
// Initial load
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
});*/