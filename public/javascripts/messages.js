var ul = document.getElementById("ulMessages");
    ul.addEventListener('click',(id)=>{
        id = id.target.id;
        if(id !=""){
            window.location = "/room?"+id;
        }
    })