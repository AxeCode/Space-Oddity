var queue = [];
var box = document.getElementById('box');
var input = document.getElementById('input');
console.log(queue);
function refresh(){
    var helper = function(i){
        return function(e){
            queue.splice(i,1);
            refresh();
        }
    }
    console.log(input.value);
    input.value = '';
    while(box.hasChildNodes()){
        box.removeChild(box.firstChild);
    }
    var item;
    for (i in queue){
        item = document.createElement('div');
        item.innerText = queue[i];
        item.className = 'queue-item';
        item.onclick = helper(i);
        box.appendChild(item);
    }
}
function leftIn(){
    queue.unshift(input.value);
    refresh();
}
function rightIn(){
    queue.push(input.value);
    refresh();
}
function leftOut(){
    queue.shift();
    refresh();
}
function rightOut(){
    queue.pop();
    refresh();
}
