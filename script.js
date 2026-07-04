const taskForm = document.getElementById("taskForm");
taskForm.addEventListener("submit", function(e){

    e.preventDefault();

    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    if(text === ""){
        return;
    }
    const duplicate = tasks.some(task =>
        task.text.toLowerCase() === text.toLowerCase()
    );
    if(duplicate){
        alert("Tugas sudah ada!");
        return;
    }
    tasks.push({
        text: text,
        done: false
    });
    saveTask();
    renderTask();
    taskForm.reset();
});