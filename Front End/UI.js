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
            <input type="text" class="inSchedule" placeholder="Enter task...">
            <button class="schedule-btn">Save/Update</button>
            <button class="remove-btn">Remove</button>
        </div>`;

    // Add it to the container
    container.innerHTML += taskHTML; // Or use insertAdjacentHTML
}

// When your "Create Task" button is clicked
document.querySelector('.btnCreate').addEventListener('click', () => {
    createTaskElement();
});

// Add this to your createTaskElement function
document.querySelector('.taskContainer').addEventListener('click', (e) => {
    //e.target.closest('.js-tasks').remove();
    if (e.target.classList.contains('remove-btn')) {
    const taskId = e.target.closest('.js-tasks').dataset.taskId;
    //console.log(`Removing task ${taskId}`);
    //alert("Task is removed");
    const userConfirmed = confirm(`Are you sure you want to delete task #${taskId}?`);
    
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

// Add this to your to update task function
document.querySelector('.taskContainer').addEventListener('click', (e) =>  {
    if (e.target.classList.contains('schedule-btn')) {
        const taskElement = e.target.closest('.js-tasks');
        const taskId = taskElement.dataset.taskId;
        const inputElement = taskElement.querySelector('.inSchedule');
        const inputText = inputElement.value;
        console.log(`Updating task ${taskId} with text: "${inputText}"`);
    }
})