// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || []; // || [] without it it will return null bc. this ensures if no valaue's are stored it sees the emmpty array.
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;//if no value is found 0 is default

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return  Math.random().toString(36).slice(2, 9);
};

// Todo: create a function to create a task card
function createTaskCard(task) {
    //enabling the color coding for how close or past due date the task is.
    let daysUntilDue = dayjs(task.dueDate).diff(dayjs(),"day");
    let cardColor; //undefined
        if (daysUntilDue < 0){
            cardColor = "red";//overdue
        }   else if (daysUntilDue <=7){
            cardColor = "yellow";
        }   else {
            cardColor = "green";
        };

    let $taskCard = $("<div>").addClass("task-card-body").attr("id",task.id).css("background-color", cardColor);//added .css background color to this to express days until due..added .attr to test fixing the loss of id
    let $cardTitle = $("<h2>").addClass("card-title").text(task.title);
    let $cardDueDate = $("<p>").addClass("card-text").text("Due Date: " + dayjs(task.dueDate).format("MMM D"));//added dayjs format
    let $cardDescription = $("<p>").addClass("card-text").text(task.description);
    let $deleteButton = $("<button>").addClass("btn btn-danger delete-task").attr("data-task-id", task.id).text("Delete");

    $taskCard.append($cardTitle, $cardDueDate, $cardDescription, $deleteButton);
    console.log(`append1`)
//event listner to delete
    $deleteButton.click(handleDeleteTask);

   return $taskCard;
   
};
let renderCounter = 0; // Counter to track the number of renderings-"debugging efforts"
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    renderCounter++; // Increment the rendering counter
    console.log(`Render ${renderCounter} started`);

    const laneMap = {
        "Not Yet Started": "#to-do",
        "In Progress": "#in-progress",
        "Completed": "#done"
    };
console.log(laneMap);

// Clear existing task cards from all lanes(debugging attempt (this actually worked and the duplicates stopped!))
$(".droppable-area").empty();

    taskList.forEach(task => {
        console.log("processing task:", task);
        let $taskCard = createTaskCard(task);
        console.log("created task card:", $taskCard);
        let $targetLane = $(laneMap[task.progressState]);
        console.log("target lane:", $targetLane);
    
        $targetLane.find(".droppable-area").append($taskCard);
        console.log("Task card appended to lane:", $targetLane);
    
        $(".task-card-body").draggable({
            revert: "invalid", 
            cursor: "crosshair"
        });
    })
    console.log(`Render ${renderCounter} completed`);
};

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    console.log("handleAddTask INVOKED")
    console.log("Event target:", event.target);
    console.log("Event current target:", event.currentTarget);
    event.preventDefault();

    // Prevent multiple calls if the task list has already been rendered

    //retrieving values from form
    let title = $("#taskTitle").val();
    let dueDate = $("#taskDueDate").val();
    let description = $("#taskDescription").val();

    let newTaskId = generateTaskId();
// Check if a task with the same ID already exists using findIndex method"
let existingTaskIndex = taskList.findIndex(task => task.id === newTaskId);

if (existingTaskIndex !== -1) {
    // Update the existing task instead of adding a new one
    taskList[existingTaskIndex].title = title;
    taskList[existingTaskIndex].dueDate = dueDate;
    taskList[existingTaskIndex].description = description;
// Update the task in localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

 //Clear form
    $("#taskTitle").val("");
    $("#taskDueDate").val("");
    $("#taskDescription").val("");
    console.log(`clear form`)

    renderTaskList();
        console.log(` handle render`);

    $("#formModal").modal("hide");

   return;
}

    // Add a new task
    let newTask = {
        id: newTaskId,
        title: title,
        dueDate: dueDate,
        description: description,
        progressState: "Not Yet Started"
    };
        console.log(`handle new task`)
        taskList.push(newTask);
        console.log(`handle push`);
        localStorage.setItem("tasks", JSON.stringify(taskList));//updates task key with newTask object
        console.log(`handle storage`);
    
        //Clear form
        $("#taskTitle").val("");
        $("#taskDueDate").val("");
        $("#taskDescription").val("");
        console.log(`clear form`);

         // Render the updated task list
        renderTaskList();
        console.log(` handle render`);

        // Hide the modal
        $("#formModal").modal("hide");
 
        // Reset the taskListRendered flag
        taskListRendered = false;
};
   
// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let taskId = $(this).attr("data-task-id");
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    $(this).closest(".task-card-body").remove();
};

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    event.preventDefault();
    console.log(taskList);
    let taskId = ui.draggable.attr("id"); // Changed this to relect the new attr created for taskcardbody, now works.
    let targetLaneID = $(this).attr("id");
    console.log("targetLaneID:", targetLaneID); // Debugging
//check these match to html id's
    const laneToProgressState = {
        "todo-cards": "Not Yet Started", //testing with prefesor
        "in-progress-cards": "In Progress",
        "done-cards": "Completed"
    };

    let newProgressState = laneToProgressState[targetLaneID];
    console.log("newProgressState:", newProgressState); // Debug 
    console.log("targetLaneID", targetLaneID);
//checks target lane id matches known lanes
    if (newProgressState === undefined){
        console.error("invalid target lane ID:", targetLaneID);
        return;
    }
    //finding dropped task in tasklist array using findIndex method
    let droppedTaskIndex = taskList.findIndex(task => task.id ===taskId);
    if (droppedTaskIndex !== -1){
        taskList[droppedTaskIndex].progressState = newProgressState;
        
        localStorage.setItem("tasks", JSON.stringify(taskList));

        renderTaskList();
    } else {
        console.error("Dropped task not found in taskList", taskId)
    }
};


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    console.log(`Document ready`);

    $(".modal-footer button").click(function(event) {
        console.log("Button clicked");
        handleAddTask(event);

    });

    $(".task-card-body").draggable({
        revert: "invalid",  
        cursor: "crosshair",
        //stack: ".task-card-body",//fix?no
       // appendTo: ".droppable-area"//fix?no
      });
      console.log("Task card made draggable.");

    $(".droppable-area").droppable({
        accept:".task-card-body",
        drop: handleDrop

       
        
        
      

    });
    
});