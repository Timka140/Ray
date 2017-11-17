window.onload = function (){
    var hei = document.documentElement.clientHeight;
    var menu = document.getElementById('menu');
    var menubeack = document.getElementById("menuBack");
    var content = document.getElementById('contentId');
    var btn = document.getElementById('btnMenu');
    menu.style.height = hei+'px';
    // menu.style.width = "250px";
    console.log('Работает');

    function downMenu() {
        menu.style.width = "0px";
        menubeack.style.display = 'none';
    }
    function btnLis() {
        menu.style.width = "250px";
        menubeack.style.display = 'block';
    }
    
    btn.addEventListener('click',btnLis);
    menubeack.addEventListener('mousedown', downMenu);

    
    window.onresize = function(){
        var wid = document.documentElement.clientWidth;
        
        if (menu.style.width == "0px" & wid > 990 ) { 
            menu.style.width = "250px";
            menubeack.style.display = 'none';
        }
        if (menu.style.width == "250px" & wid < 990 ) menu.style.width = "0px";

        hei = document.documentElement.clientHeight;
        menu.style.height = hei+'px';
    }
}
// 767