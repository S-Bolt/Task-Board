// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || []; // || [] without it it will return null bc. this ensures if no valaue's are stored it sees the emmpty array.
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return '_' + Math.random().toString(36).slice(2, 9);
    //return nextId++;
};

// Todo: create a function to create a task card
function createTaskCard(task) {
    //making the card
    let $taskCard = $("<div>").addClass("card-body");
    let $cardTitle = $("<h2>").addClass("card-title").text(task.title);
    let $cardDueDate = $("<p>").addClass("card-text").text("Due Date: " + task.dueDate);
    let $cardDescription = $("<p>").addClass("card-text").text(task.description);
    let $deleteButton = $("<button>").addClass("btn btn-danger delete-task").attr("data-task-id", task.id).text("Delete");

    $taskCard.append($cardTitle, $cardDueDate, $cardDescription, $deleteButton);
    console.log(`append1`)
//event leister to delete
    $deleteButton.click(handleDeleteTask);

   return $taskCard;
   console.log(`return`)
};
let renderCounter = 0; // Counter to track the number of renderings
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

    taskList.forEach(task => {
        console.log("processing task:", task);
        let $taskCard = createTaskCard(task);
        console.log("created task card:", $taskCard);
        let $targetLane = $(laneMap[task.progressState]);
        console.log("Target lane:", $targetLane);
    
        $targetLane.find(".card-body").append($taskCard);
        console.log("Task card appended to lane:", $targetLane);
    
// making the card draggable.  Added extra features to experiment
        $taskCard.draggable({
            revert: "invalid",  //true,invalid,valid
           helper: "clone",
            //delay: "delay",
            cursor: "crosshair"
          });
          console.log("Task card made draggable.");
    })
    console.log(`Render ${renderCounter} completed`);
};

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    console.log("handleAddTask INVOKED")
    event.preventDefault();
console.log(`handle`);

    //retrieving values from form
    let title = $("#taskTitle").val();
    let dueDate = $("#taskDueDate").val();
    let description = $("#taskDescription").val();

    let newTaskId = generateTaskId();

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
    localStorage.setItem("tasks", JSON.stringify(taskList));
 console.log(`handle storage`)
    //Clear form
    $("#taskTitle").val("");
    $("#taskDueDate").val("");
    $("#taskDescription").val("");
console.log(`clear form`);
    renderTaskList();
   console.log(` handle render`);
    $("#formModal").modal("hide");
    console.log(`hide`)
    
};

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let taskId = $(this).attr("data-task-id");
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    $(this).closest(".card-body").remove();
};

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

};



// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $(document).ready(function () {
        $("#formModal .modal-footer button").click(handleAddTask);
        renderTaskList(); // Render task list when the page 
    });
});