
const tasks = {
    pendente: [],
    'em-progresso': [],
    concluido: []
  };

  let columns = ['pendente', 'em-progresso', 'concluido'];

  function handleNewTask(event) {
    if (event.key === 'Enter') {
      const input = event.target;
      const taskText = input.value.trim();

      if (taskText) {
        const newTask = {
          id: Date.now(),
          text: taskText
        };

        // Add to first column by default
        tasks[columns[0]].push(newTask);
        input.value = '';
        renderTasks();
        showNotification('Tarefa adicionada com sucesso!');
      }
    }
  }

  function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Add to body
    document.body.appendChild(notification);

    // Remove after animation
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  function deleteTask(category, taskId) {
    tasks[category] = tasks[category].filter(task => task.id !== taskId);
    renderTasks();
    showNotification('Tarefa removida!');
  }

  function drag(event) {
    event.dataTransfer.setData('text', event.target.id);
  }

  function allowDrop(event) {
    event.preventDefault();
  }

  function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text');
    const taskEl = document.getElementById(taskId);
    const targetCategory = event.target.closest('.category').dataset.category;
    const sourceCategory = taskEl.parentElement.closest('.category').dataset.category;

    // Find task in source category
    const taskData = tasks[sourceCategory].find(task => `task-${task.id}` === taskId);
    if (taskData) {
      // Remove from source
      tasks[sourceCategory] = tasks[sourceCategory].filter(task => task.id !== taskData.id);
      // Add to target
      tasks[targetCategory].push(taskData);
      renderTasks();
      showNotification('Tarefa movida com sucesso!');
    }
  }

  function renderTasks() {
    const taskGrid = document.getElementById('task-grid');
    taskGrid.innerHTML = '';

    columns.forEach(category => {
      const categoryTasks = tasks[category] || [];
      const categoryEl = document.createElement('div');
      categoryEl.className = 'category';
      categoryEl.setAttribute('data-category', category);
      categoryEl.setAttribute('ondrop', 'drop(event)');
      categoryEl.setAttribute('ondragover', 'allowDrop(event)');

      const tasksHtml = categoryTasks.map(task => `
    <div class="task-item" draggable="true" ondragstart="drag(event)" id="task-${task.id}">
      <span>${task.text}</span>
      <i class="fas fa-trash delete-icon" onclick="deleteTask('${category}', ${task.id})"></i>
    </div>
  `).join('');

      categoryEl.innerHTML = `
    <div class="category-header">
      <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
      <span class="task-count">${categoryTasks.length}</span>
    </div>
    ${tasksHtml}
  `;

      taskGrid.appendChild(categoryEl);
    });

    // Add "Add Column" button
    const addColumnBtn = document.createElement('button');
    addColumnBtn.className = 'add-column-btn';
    addColumnBtn.innerHTML = '<i class="fas fa-plus"></i> Nova Coluna';
    addColumnBtn.onclick = addNewColumn;
    taskGrid.appendChild(addColumnBtn);
  }

  function addNewColumn() {
    const columnName = prompt('Digite o nome da nova coluna:');
    if (columnName && columnName.trim()) {
      const normalizedName = columnName.toLowerCase().replace(/\s+/g, '-');
      if (!columns.includes(normalizedName)) {
        columns.push(normalizedName);
        tasks[normalizedName] = [];
        renderTasks();
        showNotification('Nova coluna adicionada!');
      }
    }
  }

  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
  }

  function createNewBoard() {
    const boardName = prompt('Digite o nome do novo painel:');
    if (boardName && boardName.trim()) {
      const boardList = document.querySelector('.board-list');
      const newBoard = document.createElement('li');
      newBoard.className = 'board-item';
      newBoard.textContent = `📋 ${boardName}`;
      boardList.appendChild(newBoard);
      showNotification('Novo painel criado!');
    }
  }

  // Initialize
  renderTasks();
