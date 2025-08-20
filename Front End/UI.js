function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createTaskElement() {
    // Get the container where you want to add the task
    const container = document.querySelector('.taskContainer'); // Replace with your actual container

    const randomNum = getRandomInt(1, 1000);
    // Create the HTML string
    const taskHTML = `
        <div class="tasks js-tasks" data-task-id="${randomNum}">
            <!-- First Row: Task Input -->
            <div class="row">
              <input type="text" class="inSchedule" placeholder="Enter task...">
            </div>
            <!-- Date and Time Pickers -->
            <div class="row">  
              <div class="date-time-group">
                <!-- Date Column -->
                <div class="Date-Container">
                  <div class="level-1">
                    <label for="start_date">Start_Date:</label>
                    <input type="date" id="Sdate" name="start_date">
                  </div>
                  <div class="level-1">
                    <label for="finish_date">Finish_Date:</label>
                    <input type="date" id="Fdate" name="Finish_date">
                  </div>
                </div>

                <div class="Time-container">
                  <div class="level-1">
                    <label for="start_time">Start_Time:</label>
                    <input type="time" id="Stime" name="start_time">
                  </div>
                  <div class="level-1">
                    <label for="start_time">Finish_Time:</label>
                    <input type="time" id="Ftime" name="Finish_time">
                  </div>
                </div>
              </div>
            </div>
            <!-- Buttons -->
            <div class="row">
              <div class="applybtn">
                <button class="schedule-btn">Save</button>
              <button class="remove-btn">Remove</button>
              </div>
            </div>
        </div>`;

    // Add it to the container
    container.innerHTML = ``;
    container.innerHTML += taskHTML; // Or use insertAdjacentHTML
}

// When your "Create Task" button is clicked
document.querySelector('.btnCreate').addEventListener('click', () => {
    createTaskElement();
});

async function loadTasks() {
  try {
    const response = await fetch('http://localhost:5001/tasks');
    const tasks = await response.json();
    const container = document.querySelector('.taskContainer');
    
    // Clear container first
    container.innerHTML = '';
    
    // Create all HTML at once
    const tasksHTML = `
      <p class="listTitle">List of Tasks</p>
      ${tasks.map(task => `
        <div class="tasksList">
          <div class="scheduledTask" data-scheduled-task-id="${task.id}">
            <p><b>Task Detail:- ${task.task_detail}</b></p>
            <p><b>Start Date:- ${task.start_date}</b></p>
            <p><b>Finish Date:- ${task.finish_date}</b></p>
            <p><b>Start Time:- ${formatTo12Hour(task.start_time)}</b></p>
            <p><b>End Time:- ${formatTo12Hour(task.end_time)}</b></p>
            <p id="tskStatus"><b>Status:- ${task.status}</b></p>
            <div class="taskMgmtBtns">
              <button class="taskStatusBtn">Done</button>
              <button class="updateTaskBtn">Make Changes</button>
              <button class="RemoveTaskBtn">Delete Task</button>
            </div>
          </div>
        </div>
      `).join('')}
    `;
    
    container.innerHTML = tasksHTML;
    
    // Add event listeners AFTER elements are created
    setupTaskEventListeners();
    
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

async function updateStatus(taskId) {
   
   //document.querySelector('.taskStatusBtn').addEventListener('click', async () => {
        const currentStatus = document.getElementById('tskStatus').value;
         
        const changes = {
          status: "completed"
        };

        if (currentStatus === 'completed') {
            alert('You have already taken care of this task.');
        //return;
        } else {
                  try {
                    const response = await fetch(`http://localhost:5001/tasks/${encodeURIComponent(taskId)}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(changes)
                    });

                    if(!response.ok) {
                        throw new Error (`HTTP error! status: ${response.status}`);
                    }

                    const patchedItem = await response.json();
                    console.log('Patched item:', patchedItem);
                    return patchedItem;
                }catch(error){
                    console.error('Partial update failed:', error);
                    throw error;
                }
            loadTasks();
        }
       //});  
}

async function deleteTask(taskId) {
        try {
          const response = await fetch(`http://localhost:5001/tasks/${encodeURIComponent(taskId)}`, {
          method: 'DELETE'
           });

          if(!response.ok) {
              throw new Error (`HTTP error! status: ${response.status}`);
          }

          const deletedItem = await response.json();
          console.log('Deleted item:', deletedItem);
          //return patchedItem;
      }catch(error){
          console.error('Delete operation failed:', error);
          throw error;
      }
  loadTasks();
}


// Add this to your createTaskElement function
document.querySelector('.taskContainer').addEventListener('click', (e) => {
    //e.target.closest('.js-tasks').remove();
    if (e.target.classList.contains('remove-btn')) {
    const taskId = e.target.closest('.js-tasks').dataset.taskId;
    console.log(taskId);
    //console.log(`Removing task ${taskId}`);
    //alert("Task is removed");
    const userConfirmed = confirm(`Are you sure you want to Mark task #${taskId}? completed`);
    
    if (userConfirmed) {
      // User clicked "OK" - proceed with removal
      e.target.closest('.js-tasks').remove();
      //console.log(`Task ${taskId} removed`);
      
      // Here you would also:
      // 1. Remove from your data array
      // 2. Update server/localStorage if needed
    } else {
      // User clicked "Cancel" - do nothing
      console.log('Deletion cancelled');
    }
  }
});

function setupTaskEventListeners() {
  document.querySelector('.taskContainer').addEventListener('click', (e) => {
    if (e.target.classList.contains('taskStatusBtn')) {
      const taskElement = e.target.closest('.scheduledTask');
      const taskId = taskElement.dataset.scheduledTaskId;
      
      const userConfirmed = confirm(`Are you sure you want to update status of task ${taskId}?`);
      
      if (userConfirmed) {
        updateStatus(taskId);
        loadTasks();
        //e.target.closest('.tasksList').remove();
      } else {
        console.log('Status update cancelled');
      }
    }
    
    // Add similar handler for updateTaskBtn if needed
    if (e.target.classList.contains('updateTaskBtn')) {
      const taskElement = e.target.closest('.scheduledTask');
      const taskId = taskElement.dataset.scheduledTaskId;
      console.log('Update task:', taskId);
      // Add your update logic here
    }

    // Handle Removing task from todo list
    if (e.target.classList.contains('RemoveTaskBtn')) {
      const taskElement = e.target.closest('.scheduledTask');
      const taskId = taskElement.dataset.scheduledTaskId;
      console.log('Removed task: ', taskId);

      const userConfirmed = confirm(`Are you sure you want to Delete task ${taskId}?`);
      
      if (userConfirmed) {
        deleteTask(taskId);
        loadTasks();
        //e.target.closest('.tasksList').remove();
      } else {
        console.log('Task removal cancelled');
      }
    }
  });
}

function formatTo12Hour(time24) {
    if (!time24) return '';
    
    const [hours, minutes] = time24.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${hours12}:${minutes} ${period}`;
}

// Add this to your to update task function
async function  saveTask(inputTask, sdatevalue, fdatevalue, stimevalue, ftimevalue) {

  try{
      const response = await fetch('http://localhost:5001/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              task_detail: inputTask, 
              start_date: sdatevalue, 
              finish_date: fdatevalue,
              start_time: stimevalue,
              finish_time: ftimevalue,
              status: 'In progress'
          })
      });

      if (!response.ok) {
          throw new Error('Failed to add task');
      }

      const userConfirmed = confirm(`Do you want to add another task?`);
      
      if (userConfirmed) {
        createTaskElement();        
        //e.target.closest('.tasksList').remove();
      } else {
        loadTasks();
      }

      //loadUsers(); // Refresh the list
  } catch (error) {
      console.log('Error adding task:', error);
      alert('Error adding task. Please try again.');
  }   

}

document.querySelector('.taskContainer').addEventListener('click', (e) =>  {
    if (e.target.classList.contains('schedule-btn')) {
        const taskElement = e.target.closest('.js-tasks');

        const initalValues ={
          Task: '',
          start_date: '',
          finish_date: '',
          start_time: '',
          finish_time: ''
        };

        const inputTask = taskElement.querySelector('.inSchedule').value;
        const sdatevalue = taskElement.querySelector('#Sdate').value;
        const fdatevalue = taskElement.querySelector('#Fdate').value;
        const stimevalue = taskElement.querySelector('#Stime').value;
        const ftimevalue = taskElement.querySelector('#Ftime').value;

        const hasChanges = inputTask !== initalValues.Task &&
                  sdatevalue !== initalValues.start_date &&
                  fdatevalue !== initalValues.finish_date &&
                  stimevalue !== initalValues.start_time &&
                  ftimevalue !== initalValues.finish_time;

        if (!hasChanges) {
          alert('Please enter data before submitting');
        } else {
                  saveTask(inputTask, sdatevalue, fdatevalue,
                            stimevalue, ftimevalue);
        }
        /*const taskId = taskElement.dataset.taskId;
        const inputElement = taskElement.querySelector('.inSchedule');
        const inputText = inputElement.value;
        console.log(`Updating task ${taskId} with text: "${inputText}"`);*/
    }
});

loadTasks();