$("#FriendExpect").click(()=>{
    var xhr = new XMLHttpRequest;
    xhr.open("POST","/FriendExpect",true);
    xhr.send("ok");
    subscribe()
});

function subscribe(){
    var xhr = new XMLHttpRequest;
    xhr.open("GET","/FriendExpect",true);
    xhr.send(null);
    xhr.onload = ()=>{
        if (xhr.status == 200 ) {
            resJson = JSON.parse(xhr.responseText);
            document.getElementById("listInfo").innerHTML = "";
            addListUsers(resJson);
            return;
        } else {
            subscribe();
        }
    }
}
function addListUsers (resText){
    if (resText == undefined || resText == null) {
        return;
    } else {
    for(var i=0; i<resText.usersLenght; i++){
        var ul = document.getElementById("listInfo");
        var li = document.createElement("li");
            li.className = "li-user";
            li.innerHTML = '<a href="#" class="add-uder-nick">'+resText.users[i].nick+'</a> <p class="add-user-name"> '+resText.users[i].name+' '+resText.users[i].surname+' </p> <div class="btn-add-friends" id="'+resText.users[i].nick+'"> Добавить в друзья </div>'
            ul.appendChild(li);
    }
    }
}
document.querySelector('#listInfo').addEventListener('click', function(e){ // Вешаем обработчик клика на UL, не LI
    var id = e.target.id; // Получили ID, т.к. в e.target содержится элемент по которому кликнули
    if (id != '') {
        e.target.innerHTML = "Запрос принят"
    }
    if(id != "") {
        var xhr= new XMLHttpRequest();
        console.log(id)
        xhr.open("POST","/friendsUser",true);
        xhr.send(JSON.stringify({
            nick:$.trim(id),
        }));
    }
  });