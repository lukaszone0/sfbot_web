'use strict';

export function calchight(q1, q2, q3){
    var quest = 0;
    if(q1 > q2){
        if(q1 > q3){
            quest = 0;
        }
        else {
            quest = 2;
        }
    }
    else{
        if(q3 > q2){
            quest = 2;
        }
        else {
            quest = 1;
        }
    }
    return quest + 1;
}

export function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; SameSite=None; Secure";
}
export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
export function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}