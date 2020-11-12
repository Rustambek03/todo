$(document).ready(function(){

    let btn = $('.btn')
    let inp = $('.task-input')
    let list = $('.task-list')


    btn.on('click', function(){ // События клик на кнопку добавить

        if(!inp.val()){ // проверка на заполненность инпута
            alert('Заполните поле') 
            return  
        }

        let taskObj = {
            task: inp.val() // помещяем значение инпута в свойство task нового объекта
        }

        setItemToJson(taskObj) // вызов функции добавления в localStorage
        inp.val('')// очищение инпута
    })

    function setItemToJson(task){ // добавление новых тасков в localStorage
        fetch("http://localhost:8000/tasks",{
            method: "POST",
            body: JSON.stringify(task),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
        })
            .then(() => render())
            .catch(err => console.log(err))
    }

    function render(){ // отображение данных
        fetch("http://localhost:8000/tasks")
            .then(res => res.json())
            .then(data => {
                list.html('')
                data.forEach(item => { // перебираем массив и для каждого элемента создаем новый li тег с кнопкой
                    list.append(`
                        <li id=${item.id}>
                            ${item.task}
                            <button class="btn-delete">Delete</button>
                            <button class="btn-edit">Edit</button>
                        </li>`)
                });
            })

 
    }
            
    $('body').on('click', '.btn-delete', function(event){ // события клик на кнопку удалить
        let id = event.target.parentNode.id
        fetch(`http://localhost:8000/tasks/${id}`,{
            method: "DELETE"
        })
            .then(() => render())
    })

    $('body').on('click', ".btn-edit", function(event){
        let id = event.target.parentNode.id
        fetch(`http://localhost:8000/tasks/${id}`)
            .then(res => res.json())
            .then(data => showModal(data))
    })

    function showModal(obj){
        $('.main-modal').css("display", "block")
        $(".inp-edit").val(obj.task)
        $('.btn-save').attr('id', obj.id)
    }

    $(".btn-save").on('click', function(event){
        let newObj = {
            task: $('.inp-edit').val()
        }
        let id = event.target.id
        fetch(`http://localhost:8000/tasks/${id}`,{
            method: "PATCH",
            body: JSON.stringify(newObj),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
        })
        .then(() => {
            closeModal()
            render()
        })
    })

    $(".btn-close").on('click', function(){
        closeModal()
    })

    function closeModal(){
        $('.main-modal').css("display", "none")
    }

    render() // вызов функции отображение



})