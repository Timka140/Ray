var sendMessage = document.getElementById("sendMessag");
var message = document.getElementById("message");
var nick = document.getElementById("nickUser");
var nickFriend = document.getElementById("nickFriend");
var urlHead = new String,urlId = new String;
urlHead = window.location.pathname;
urlId = window.location.search.slice(1);

var socket = io('http://localhost/rooms');
sendMessage.onclick = ()=>{
    if (message.value) {
        var data ={
            nick: nick.innerHTML,
            message: message.value,
            idRoom: urlId,
        }
        socket.emit("new message", data);

        addMessageToContainer(data);
    }
};
socket.on(urlId,(data)=>{
    console.log(data);
    addMessageToContainer(data.message)
})
function addMessageToContainer(message){
    var ul = document.getElementById("containerMessages");
    var li = document.createElement("li");
        li.innerHTML = message.nick +" " + message.message;
        ul.appendChild(li);
        ul.scrollIntoView(false);
        document.getElementById("message").value ='';
}