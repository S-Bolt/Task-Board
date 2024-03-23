// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    //making the card
    let $cardBody = $("<div>").addClass("card-body");
    let $cardTitle = $("<h2>").addClass("card-title").text(task.title);
    let $cardDueDate = $("<p>").addClass("card-text").text("Due Date: " + task.dueDate);
    let $cardDescription = $("<p>").addClass("card-text").text(task.description);
    let $deleteButton = $("<button>").addClass("btn btn-danger delete-task").attr("data-task-id", task.id).text("Delete");

    $cardBody.append($cardTitle, $cardDueDate, $cardDescription, $deleteButton);

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
    event.preventDefault()

    

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

});
