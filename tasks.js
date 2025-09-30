let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const tasksList = document.getElementById("tasksList");

function getCategoryColor(category){
  switch(category){
    case "Work": return "#3b82f6";    // Blue
    case "Study": return "#10b981";   // Green
    case "Personal": return "#facc15";// Yellow
    default: return "#a855f7";        // Purple
  }
}

function renderTasks(){
  if(tasks.length===0){
    tasksList.innerHTML = `<p>No tasks found.</p>`;
    return;
  }

  tasksList.innerHTML = tasks.map(t=>{
    let color = getCategoryColor(t.category);
    return `
      <div class="task" style="border-left:6px solid ${color}; padding-left:10px;">
        <div class="task-info">
          <span>${t.name}</span><br/>
          <small style="color:#6b7280">${t.date} ${t.from||''} ${t.to?'-'+t.to:''}</small><br/>
          <small style="color:${color}; font-weight:500">${t.category||"General"}</small>
        </div>
        <div style="display:flex;gap:8px">
          <button onclick="editTask('${t._id}')" title="Edit"><i class="fas fa-pen"></i></button>
          <button onclick="deleteTask('${t._id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  }).join('');
}

function deleteTask(id){
  if(!confirm("Delete this task?")) return;
  tasks = tasks.filter(t=> t._id!==id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function editTask(id){
  let idx = tasks.findIndex(t=>t._id===id);
  if(idx===-1) return;
  let nt = prompt("Edit task:", tasks[idx].name);
  if(nt && nt.trim()!==""){
    tasks[idx].name = nt.trim();
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
}

renderTasks();
