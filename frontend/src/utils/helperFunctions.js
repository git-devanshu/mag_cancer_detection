export function getBaseURL(){
    return "http://localhost:5000";
}

export function checkEmailValidity(email){
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
    const isValid = emailPattern.test(email); 
    return isValid;
}

//function to get the current date in different formats
/*
type values : 
1 - DD-MM-YYYY
2 - DD M_name, YYYY
3 - D_name DD M_name, YYYY
4 - YYYY
5 - hh:mm dd-mm-yy
else - YYYY-MM-DD
*/
export function getCurrentDate(type){
    const date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth();
    var m_name = date.toLocaleString('default', {month : 'long'});
    var yy = date.getFullYear();
    var d_name = date.toLocaleString('default', {weekday : 'long'});
    var h = date.getHours();
    var min = date.getMinutes();

    if(type === 1){
        return dd + '-' + (mm+1) + '-' + yy;
    }
    else if(type === 2){
        return dd + ' ' + m_name + ', ' + yy;
    }
    else if(type === 3){
        return d_name + ' ' + dd + ' ' + m_name + ', ' + yy;
    }
    else if(type === 4){
        return yy;
    }
    else if(type === 5){
        return h.toString(10).padStart(2, '0') + ':' + min.toString(10).padStart(2, '0');
    }
    else{
        return yy + '-' + (mm+1) + '-' + dd;
    }
}