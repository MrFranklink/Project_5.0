document.addEventListener("DOMContentLoaded", function() {
    // Get references to various HTML elements
    const addTaskButton = document.getElementById("addTaskButton");
    const taskInput = document.getElementById("taskInput"); 
    const categorySelect = document.getElementById("categorySelect"); 
    const dueDateInput = document.getElementById("dueDateInput"); 
    const todoContainer = document.querySelector(".to-do");
    const searchInput = document.getElementById("searchInput"); 
    const voiceButton = document.getElementById("voiceButton"); 
    const sortByDueDateButton = document.getElementById("sortByDueDateButton"); 
    const sortByCategoryButton = document.getElementById("sortByCategoryButton"); 
    const sortButton = document.getElementById("sortButton"); 
    const sortOptions = document.querySelector(".sort-options"); 
    const filterOption = document.getElementById("filterOption"); 
    // Load tasks from local storage and update task colors based on due dates
    loadTasksFromLocalStorage(); 
    updateTaskColorBasedOnDueDate(); 

    // Function to animate the update of task colors based on due dates
    function animateUpdateTaskColorBasedOnDueDate() {
        requestAnimationFrame(animateUpdateTaskColorBasedOnDueDate);
        updateTaskColorBasedOnDueDate();
    }

    // Start the animation for updating task colors
    animateUpdateTaskColorBasedOnDueDate();

    // Function to update task colors based on due dates
    function updateTaskColorBasedOnDueDate() {
        const currentDate = new Date();
        const taskItems = document.querySelectorAll(".task-item");

        taskItems.forEach(taskItem => {
            const dueDateText = taskItem.querySelector(".due-date").innerText.split(": ")[1];
            const dueDate = new Date(dueDateText);

            // Add "overdue" class to tasks with due dates in the past
            if (dueDate < currentDate && !isSameDate(dueDate, currentDate)) {
                taskItem.classList.add("overdue");
            } else {
                taskItem.classList.remove("overdue");
            }
        });
    }

    // Function to check if two dates are the same
    function isSameDate(date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    // Get a reference to the "Back to Original" button
    const backToOriginalButton = document.getElementById("backToOriginalButton");

    // Event listener for the "Back to Original" button
    backToOriginalButton.addEventListener("click", function () {
        // Clear the todoContainer and reload tasks from local storage
        todoContainer.innerHTML = '';
        loadTasksFromLocalStorage();
    });

    // Event listeners for sorting tasks by due date and category
    sortByDueDateButton.addEventListener("click", function () {
        sortTasksByDueDate();
    });

    sortByCategoryButton.addEventListener("click", function () {
        sortTasksByCategory();
    });

    // Function to sort tasks by due date
    function sortTasksByDueDate() {
        const taskItems = document.querySelectorAll(".task-item");
        const sortedItems = Array.from(taskItems).sort((a, b) => {
            const dueDateA = new Date(a.querySelector(".due-date").innerText.split(": ")[1]);
            const dueDateB = new Date(b.querySelector(".due-date").innerText.split(": ")[1]);
            return dueDateA - dueDateB;
        });

        // Append sorted task items back to the todoContainer
        sortedItems.forEach(item => {
            todoContainer.appendChild(item);
        });
    }

    // Function to sort tasks by category
    function sortTasksByCategory() {
        const taskItems = document.querySelectorAll(".task-item");
        const sortedItems = Array.from(taskItems).sort((a, b) => {
            const categoryA = a.querySelector(".category").innerText.split(": ")[1];
            const categoryB = b.querySelector(".category").innerText.split(": ")[1];
            return categoryA.localeCompare(categoryB);
        });

        // Append sorted task items back to the todoContainer
        sortedItems.forEach(item => {
            todoContainer.appendChild(item);
        });
    }

    // Check if speech recognition is supported in the browser
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        // Create a speech recognition instance
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        // Configure recognition settings
        recognition.continuous = false;
        recognition.lang = 'en-US';

        // Event listener for speech recognition results
        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            searchInput.value = result;

            // Trigger an input event on the search input to initiate a search
            const inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            searchInput.dispatchEvent(inputEvent);
        };

        // Event listener for the voice input button
        voiceButton.addEventListener('click', () => {
            recognition.start();
        });
    } else {
        // Disable voice input if not supported in the browser
        voiceButton.disabled = true;
        voiceButton.textContent = 'Voice Input Not Supported';
    }

    // Event listener for adding a new task
    addTaskButton.addEventListener("click", function() {
        const taskText = taskInput.value.trim();
        const category = categorySelect.value;
        const dueDate = dueDateInput.value;

        // Check if all required fields are filled
        if (taskText !== "" && category !== "" && dueDate !== "") {
            // Create a new task item and save it to local storage
            const taskItem = createTaskItem(taskText, category, dueDate);
            saveTaskToLocalStorage(taskItem);
            taskInput.value = "";
            categorySelect.value = "";
            dueDateInput.value = "";
        } else {
            alert("Please fill in all required fields (Task, Category, Due Date).");
        }
    });

    // Event listener for interactions with task items (edit, delete, mark as done)
    todoContainer.addEventListener("click", function(event) {
        const target = event.target;
        const taskItem = target.closest(".task-item");

        if (!taskItem) return;

        if (target.classList.contains("edit")) {
            // Allow editing of a task
            const taskText = taskItem.querySelector(".task-text").innerText;
            const updatedTaskText = prompt("Edit task:", taskText);
            if (updatedTaskText !== null && updatedTaskText.trim() !== "") {
                taskItem.querySelector(".task-text").innerText = updatedTaskText;
                updateTaskInLocalStorage(taskItem);
            }
        } else if (target.classList.contains("delete")) {
            // Delete a task
            taskItem.remove();
            deleteTaskFromLocalStorage(taskItem);
        } else if (target.classList.contains("done")) {
            // Toggle the completion status of a task
            taskItem.classList.toggle("completed");
            updateTaskInLocalStorage(taskItem);
        }
    });

    // Function to create a new task item
    function createTaskItem(taskText, category, dueDate) {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        // Generate a unique task ID
        const taskId = generateTaskId();
        taskItem.id = taskId;

        // Create task text element
        const taskTextDiv = document.createElement("div");
        taskTextDiv.classList.add("task-text");
        taskTextDiv.innerText = taskText;

        // Create category element
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category");
        categoryDiv.innerText = `Category: ${category}`;

        // Create due date element
        const dueDateDiv = document.createElement("div");
        dueDateDiv.classList.add("due-date");
        dueDateDiv.innerText = `Due Date: ${dueDate}`;

        // Create actions element with edit, delete, and done buttons
        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("actions");

        const editButton = document.createElement("button");
        editButton.classList.add("edit");
        editButton.innerText = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerText = "Delete";

        const doneButton = document.createElement("button");
        doneButton.classList.add("done");
        doneButton.innerText = "Done";

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        actionsDiv.appendChild(doneButton);

        // Append elements to the task item
        taskItem.appendChild(taskTextDiv);
        taskItem.appendChild(categoryDiv);
        taskItem.appendChild(dueDateDiv);
        taskItem.appendChild(actionsDiv);

        // Append the task item to the todoContainer
        todoContainer.appendChild(taskItem);

        return taskItem;
    }

    // Function to generate a unique task ID
    function generateTaskId() {
        return `task-${Date.now()}`;
    }

    // Function to save a task to local storage
    function saveTaskToLocalStorage(taskItem) {
        const task = {
            id: taskItem.id,
            text: taskItem.querySelector(".task-text").innerText,
            category: taskItem.querySelector(".category").innerText.split(": ")[1],
            dueDate: taskItem.querySelector(".due-date").innerText.split(": ")[1],
            completed: taskItem.classList.contains("completed")
        };

        // Retrieve existing tasks from local storage or create an empty array
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);

        // Store the updated tasks array in local storage
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Function to update a task in local storage
    function updateTaskInLocalStorage(taskItem) {
        const taskId = taskItem.id;

        // Retrieve existing tasks from local storage or create an empty array
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        // Update the task with the matching ID
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                task.text = taskItem.querySelector(".task-text").innerText;
                task.completed = taskItem.classList.contains("completed");
            }
            return task;
        });

        // Store the updated tasks array in local storage
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }

    // Function to delete a task from local storage
    function deleteTaskFromLocalStorage(taskItem) {
        const taskId = taskItem.id;

        // Retrieve existing tasks from local storage or create an empty array
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        // Remove the task with the matching ID
        const updatedTasks = tasks.filter(task => task.id !== taskId);

        // Store the updated tasks array in local storage
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }

    // Function to load tasks from local storage and populate the UI
    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks.forEach(task => {
            const taskItem = createTaskItem(task.text, task.category, task.dueDate);
            taskItem.id = task.id;
            if (task.completed) {
                taskItem.classList.add("completed");
            }
        });
    }

    // Function to search tasks based on a search term
    function searchTasks(searchTerm) {
        const taskItems = document.querySelectorAll(".task-item");

        taskItems.forEach(taskItem => {
            const taskText = taskItem.querySelector(".task-text").innerText.toLowerCase();
            if (taskText.includes(searchTerm) || searchTerm === "") {
                taskItem.classList.remove("filtered");
            } else {
                taskItem.classList.add("filtered");
            }
        });
    }

    // Event listener for the search input
    searchInput.addEventListener("input", function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchTasks(searchTerm);
    });

    // Get references to toggle mic and search button and mic-and-search div
    const toggleMicAndSearchButton = document.getElementById("toggleMicAndSearch");
    const micAndSearchDiv = document.querySelector(".mic-and-search");

    // Event listener to toggle mic and search visibility
    toggleMicAndSearchButton.addEventListener("click", function () {
        toggleMicAndSearchButton.style.display = "none";

        if (micAndSearchDiv.style.display === "none") {
            micAndSearchDiv.style.display = "block";
        } else {
            micAndSearchDiv.style.display = "none";
        }
    });

    // Get references to start button and box div
    const startButton = document.getElementById("startButton");
    const boxDiv = document.getElementById("boxDiv");

    // Event listener to toggle start button visibility
    startButton.addEventListener("click", function () {
        startButton.style.display = "none";
        boxDiv.style.display = "block";
    });

    // Set the minimum due date in the input field to the current date
    const currentDate = new Date().toISOString().split('T')[0];
    dueDateInput.min = currentDate;

    // Event listener for task filtering based on completion status
    filterOption.addEventListener("change", function () {
        const selectedOption = filterOption.value;
        filterTasks(selectedOption);
    });

    // Function to filter tasks based on completion status
    function filterTasks(option) {
        const taskItems = document.querySelectorAll(".task-item");

        taskItems.forEach(taskItem => {
            const isCompleted = taskItem.classList.contains("completed");

            if (option === "all" || (option === "completed" && isCompleted) || (option === "pending" && !isCompleted)) {
                taskItem.classList.remove("hidden");
            } else {
                taskItem.classList.add("hidden");
            }
        });
    }
});
