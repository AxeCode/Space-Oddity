function checkInput() {
    var len = getLength(input.value);
    if(len && len > 4 && len < 16){
        info.className = 'text-success';
        info.innerText = '格式正确';
        input.className = 'success';
    } else{
        info.className = 'text-warning';
        info.innerText = '名称长度为4-16';
        input.className = 'warning';
    }
}

function getLength(s) {
    var len = 0;
    for (i in s) {
        if(s.charCodeAt(i) > 127){
            len += 1;
        } else {
            len += 2;
        }
    }
    return len;
}
