document.addEventListener('DOMContentLoaded', function() {
    var checklists = {};

    flatpickr("#calendar", {
        inline: true,
        onChange: function(selectedDates, dateStr, instance) {
            hideAllChecklists();

            var clickedDate = new Date(dateStr + 'T00:00:00'); // Ajuste para considerar o fuso horário

            if (checklists[clickedDate.getTime()]) {
                showChecklist(clickedDate.getTime());
            } else {
                createChecklist(clickedDate.getTime());
            }
        }
    });

    createFormatButton();

    function createFormatButton() {
        var formatButton = document.createElement('button');
        formatButton.textContent = 'Formatar Agenda';
        formatButton.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja formatar a agenda? Isso apagará todas as tarefas.')) {
                clearAllChecklists();
            }
        });

        document.body.appendChild(formatButton);
    }

    function createChecklist(date) {
        var checklist = document.createElement('div');
        checklist.className = 'checklist';
        checklist.innerHTML = '<h2>Tarefas de hoje ' + formatDateString(date) + '</h2>';

        var inputItem = document.createElement('input');
        inputItem.type = 'text';
        inputItem.placeholder = 'Nova tarefa';

        var addItemButton = document.createElement('button');
        addItemButton.textContent = 'Adicionar';
        addItemButton.addEventListener('click', function() {
            addItem(date, inputItem.value);
            inputItem.value = '';
        });

        checklist.appendChild(inputItem);
        checklist.appendChild(addItemButton);
        checklist.appendChild(document.createElement('br'));

        document.body.appendChild(checklist);

        loadChecklistFromLocalStorage(date, checklist);

        checklists[date] = checklist;
    }

    function showChecklist(date) {
        var checklist = checklists[date];
        if (checklist) {
            checklist.style.display = 'block';
        }
    }

    function hideAllChecklists() {
        Object.values(checklists).forEach(function(checklist) {
            if (checklist) {
                checklist.style.display = 'none';
            }
        });
    }

    function clearAllChecklists() {
        Object.values(checklists).forEach(function(checklist) {
            if (checklist) {
                checklist.remove();
            }
        });
        checklists = {};
    }

    function addItem(date, item) {
        if (checklists[date]) {
            addItemToList(date, item);
            saveChecklistToLocalStorage(date, checklists[date]);
        }
    }

    function addItemToList(date, item) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = date + '_' + item;
        checkbox.addEventListener('change', function() {
            toggleItemCompletion(date, item, checkbox.checked);
            toggleItemHighlight(checkbox);
            saveChecklistToLocalStorage(date, checklists[date]);
        });

        var label = document.createElement('label');
        label.htmlFor = date + '_' + item;
        label.appendChild(document.createTextNode(item));

        var removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.addEventListener('click', function() {
            removeItem(date, item);
            saveChecklistToLocalStorage(date, checklists[date]);
        });

        var listItem = document.createElement('div');
        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        listItem.appendChild(removeButton);
        listItem.appendChild(document.createElement('br'));

        listItem.addEventListener('click', function() {
            toggleItemHighlight(checkbox);
        });

        var checklist = checklists[date];
        if (checklist) {
            checklist.appendChild(listItem);
        }
    }

    function removeItem(date, item) {
        var listItem = document.getElementById(date + '_' + item);
        if (listItem) {
            listItem.parentElement.remove();
        }
    }

    function toggleItemCompletion(date, item, isCompleted) {
        console.log('Item marcado como concluído:', date, item, isCompleted);
    }

    function toggleItemHighlight(checkbox) {
        checkbox.parentElement.classList.toggle('strikethrough', checkbox.checked);
    }

    function saveChecklistToLocalStorage(date, checklist) {
        if (localStorage) {
            localStorage.setItem('checklist_' + date, checklist.innerHTML);
        }
    }

    function loadChecklistFromLocalStorage(date, checklist) {
        if (localStorage) {
            var savedChecklist = localStorage.getItem('checklist_' + date);
            if (savedChecklist) {
                checklist.innerHTML = savedChecklist;
            }
        }
    }

    function formatDateString(date) {
        var options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(date).toLocaleDateString('pt-BR', options);
    }
});
