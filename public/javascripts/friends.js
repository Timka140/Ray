var key;
function addListUsers (resText,delet){
    if (resText == undefined || resText == null) {
        return;
    } else {
    for(var i=0; i<resText.usersLenght; i++){
        if ( resText.users[i] != null) {
            var ul = document.getElementById("listFriends");
            var li = document.createElement("li");
            if (delet == true) {
                li.parentNode.removeChild(li)
            }
                li.className = "li-user";
                li.innerHTML = '<a href="#" class="a-nick">'+resText.users[i].nick+'</a> <p class="user-name"> '+resText.users[i].name+' '+resText.users[i].surname+' </p> <div class="btn-add-friends" id="'+resText.users[i].nick+'">Добавить в друзья</div>'
                ul.appendChild(li);
        }
    }
    }
}
var nick = document.getElementsByClassName("seachFriend");
    if (nick == null || undefined) {
    } else {
        document.querySelector('#listFriends').addEventListener('click', function(e){ // Вешаем обработчик клика на UL, не LI
            var id = e.target.id; // Получили ID, т.к. в e.target содержится элемент по которому кликнули
            document.querySelector('#test strong').innerHTML = id;
            if(id != "" && e.target.innerHTML == "Добавить в друзья") {
                e.target.innerHTML = "Запрос отправлен"
                var xhr= new XMLHttpRequest();
                console.log(id)
                xhr.open("POST","/addFriend",true);
                xhr.send(JSON.stringify({
                    nick:$.trim(id),
                    token: $.trim()
                }));
            } else if (e.target.className == "btn-messag"){
                var xhr = new XMLHttpRequest();
                xhr.open("POST","/messages",true);
                xhr.send(JSON.stringify({nickFriend: id}));
                xhr.onload = ()=>{
                    id = JSON.parse(xhr.responseText);
                    window.location = "/room?"+id.id;
                }
            }
          });
    }
$("#seachBtn").click(()=>{
    var seach = document.getElementById("seach").value;
    var xhr = new XMLHttpRequest;
    rand =(min, max) => {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        key = rand;
        return rand;
      }
    xhr.open("POST","/seachUsers",true);
    console.log(seach)
    xhr.send(JSON.stringify({
        seach:$.trim(seach),
        key:$.trim(rand(1,1000000000))
    }));
    subscribe();
});
function subscribe(){
    var xhr = new XMLHttpRequest;
    xhr.open("GET","/seachUsers",true);
    xhr.send(null);
    xhr.onload = ()=>{
        if (xhr.status == 200) {
            if (xhr.responseText != 'undefined') {
                var res = JSON.parse(xhr.responseText);
                if (res.key == key) {
                    if (document.getElementsByClassName("li-user").length != 0 ) {
                        var ul = document.getElementById("listFriends").innerHTML = ''; 
                        addListUsers(res,false);
                    } else {
                        addListUsers(res,false);
                    }
                    return;
                }
            } else {
                subscribe();
            }
        }   
    }
}

