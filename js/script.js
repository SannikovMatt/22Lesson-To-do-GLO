'use strict';


let  clearalarm;


class ToDo {

    constructor(form, input, todoList, completed, TodoContainer) {

        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.completed = document.querySelector(completed);
        this.toDoContainer = document.querySelector(TodoContainer);
        this.data = new Map(JSON.parse(localStorage.getItem('TodoData')));
    }

    debounce3  (func, wait, immediate) {
        let timeout;
    
        return function executedFunction() {
            const context = this;
            const args = arguments;
    
            console.log(this);
    
            const later = function () {
                timeout = null;
                if (!immediate) {func.apply(context, args);}
            };
    
            const callNow = immediate && !timeout;
    
            clearTimeout(timeout);
    
            timeout = setTimeout(later, wait);
    
            if (callNow) {func.apply(context, args);}
        };
    }


    

    
      debounce(f, t) {
        return function (args) {
          let previousCall = this.lastCall;
          this.lastCall = Date.now();
          if (previousCall && ((this.lastCall - previousCall) <= t)) {
            clearTimeout(this.lastCallTimer);
          }
          this.lastCallTimer = setTimeout(() => f(args), t);
        };
      }

    addToStorage() {

        localStorage.setItem('TodoData', JSON.stringify([...this.data]));
    }

    generateKey() {

        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    render() {

        console.log('RENDER');

        this.todoList.innerHTML = '';
        this.completed.innerHTML = '';

        this.data.forEach(this.createLi, this);
        this.addToStorage();
    }

    createLi(task) {

        let li = `<li style = "transition: all 1s; opacity:1 ; left = 0 " 
        
        class="todo-item"
        
        data-id ="${task.key}">
        <span style = 'transition:all 1s' class="text-todo">${task.value}</span>
        <div class="todo-buttons">
            <button class="todo-edit"></button>
            <button class="todo-remove"></button>
            <button class="todo-complete"></button>
        </div>
    </li>`;

        if (task.completed) {

            this.completed.insertAdjacentHTML('beforeend', li);
        } else {


            this.todoList.insertAdjacentHTML('beforeend', li);
        }

    }
    

    warningMsg(msg) {
        let warningMsg = document.querySelector('#warning_msg'),
            color,
            message;

      

        if (msg === 'emptyField') {
            color = 'rgba(245, 32, 32, 0.589)';
            message = 'Can`t be empty';
        } else if (msg === 'removed') {

            color = 'rgba(245, 32, 32, 0.589)';
            message = 'Deleted';

        } else if (msg === 'edited') {
            color = 'rgba(153, 255, 153, 0.589)';
            message = 'Edited';
        }
        else if (msg === 'toggled') {
            color = 'rgba(153, 255, 153, 0.589)';
            message = 'Moved';

        } else if (msg === 'added') {
            color = 'rgba(153, 255, 153, 0.589)';
            message = 'Added';

        }
        warningMsg.style.transform = 'translateX(0)';
        warningMsg.style.backgroundColor = color;
        warningMsg.innerHTML = message;

        

  /*  if(clearalarm){clearTimeout(clearalarm)};
      clearalarm = */ setTimeout(() => {
            warningMsg.style.transform = 'translateX(-100%)';

        }, 1000);


       

    }

    addTask(evnt) {

        evnt.preventDefault();
        if (this.input.value.trim() === '') {


            this.warningMsg('emptyField');

        }

        if (this.input.value.trim() !== '') {
            const newTask = {
                value: this.input.value,
                completed: false,
                key: this.generateKey()

            };
            this.data.set(newTask.key, newTask);
            this.render();
            this.input.value = '';

          this.warningMsg('added');
        
         

       }


    }







    removeTask(li) {
        this.data.delete(li.dataset.id);

        li.style.minHeight = 0;
        li.style.height = 0;
        li.style.margin = 0;
        li.style.padding = 0;
        li.style.left = 0;

        li.style.left = (parseInt(li.offsetLeft) - 2000) + 'px';

        li.innerHTML = '';
 
        
        setTimeout(this.debounce(this.render.bind(this), 1000).bind(this), 1000);
     this.debounce3(this.warningMsg.bind(this).bind(this,'removed'), 2000)();

     

        //this.warningMsg('removed');

    }

    toggleTask(li) {

        let condition = this.data.get(li.dataset.id).completed;

        if (condition) {
            this.todoList.append(li);
            li.style.opacity = 0.5;
            this.data.get(li.dataset.id).completed = false;


        } else {
            this.completed.append(li);
            li.style.opacity = 0.5;
            this.data.get(li.dataset.id).completed = true;
        }

        setTimeout(this.debounce(this.render.bind(this), 1000), 1000);
        this.warningMsg('toggled');

    }

    editTask(li) {

        let span = li.querySelector('span'),
            textbeforeedit = span.textContent;


        //Сдвигаем поле которое редактируем
        li.style.left = '50px';
        span.style.background = 'lightgreen';
        li.style.transform = 'scale(1)';
        li.style.border = 'green 1px solid';
        span.setAttribute('contentEditable', true);
        span.style.fontSize = '30px';



        const mouseLeave = (e) => {

            span.contentEditable = false;
            let edited = false;


            if (span.innerHTML === '') {
                this.removeTask(li);
                return;
            }

            if (span.innerHTML !== textbeforeedit) {

                let elem = this.data.get(li.dataset.id);
                elem.value = span.textContent;
                edited = true;
            } else { edited = false; }

            span.style.background = 'white';
            li.style.border = '';
            li.style.left = 0;

            setTimeout(this.debounce(this.render.bind(this), 1000), 100);
            li.removeEventListener('mouseleave', mouseLeave);

            if (edited) { this.warningMsg('edited') ;}
        };
        li.addEventListener('mouseleave', mouseLeave);







    }

    handler(event) {

        let target = event.target;

        if (target.closest(".todo-edit")) {

            this.editTask(target.closest('[data-id]'));
        }
        if (target.closest(".todo-remove")) {

            this.removeTask(target.closest('[data-id]'));
        }
        if (target.closest(".todo-complete")) {

            this.toggleTask(target.closest('[data-id]'));
        }



    }


    init() {


        this.render();
        this.form.addEventListener('submit', this.addTask.bind(this));
        this.toDoContainer.addEventListener('click', this.handler.bind(this));
    }
}


const toDo = new ToDo(".todo-control", ".header-input", "#todo", "#completed", ".todo-container");

toDo.init();