// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || []; // || [] without it it will return null blaue. this ensures if no vlaue's are stored it sees the emmpty array.
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    //making the card
    let $taskCard = $("<div>").addClass("card-body");
    let $cardTitle = $("<h2>").addClass("card-title").text(task.title);
    let $cardDueDate = $("<p>").addClass("card-text").text("Due Date: " + task.dueDate);
    let $cardDescription = $("<p>").addClass("card-text").text(task.description);
    let $deleteButton = $("<button>").addClass("btn btn-danger delete-task").attr("data-task-id", task.id).text("Delete");

    $taskCard.append($cardTitle, $cardDueDate, $cardDescription, $deleteButton);

   return $taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    console.log(taskList);
    taskList.forEach(task => {
        let $taskCard = createTaskCard(task);

        const laneMap = {
            "Not Yet Started": "#to-do",
            "In Progress": "#in-progress",
            "Completed": "#done"
        };

        let $targetLane = $(laneMap[task.progressState]);

        $targetLane.find(".card-body").append($taskCard);
// making the card draggable.  Added extra features to experiment
        $taskCard.draggable({
            revert: "invalid",  //true,invalid,valid
            helper: "clone",
            delay: "delay",
            cursor: "crosshair",

          });

    })
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    //retrieving values from form
    let title = $("#taskTitle").val();
    let dueDate = $("#taskDueDate").val();
    let description = $("#taskDescription").val();

    let newTask = {
        id: generateTaskId(),
        title: title,
        dueDate: dueDate,
        description: description,
        progressState: "Not Yet Started"
    };

    taskList.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(taskList));

    //Clear form
    $("taskTitle").val("");
    $("taskDueDate").val("");
    $("taskDescription").val("");

    renderTaskList();

    $("#formModal").modal("hide");

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    
    renderTaskList();


$(document).on("click", "#formModal .modal-footer button", function(event) {
    handleAddTask(event);
});
});
