const sendData = (path, data) => {
    fetch(path, {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => processData(data));
}

const processData = (data) => {
    loader.style.display = null;
    if(data.alert){
        showFormError(data.alert);
    }
    else if(data.name){
        //store locally
        sessionStorage.user = JSON.stringify(data);             
        location.replace('/');
    }
    else if(data.seller){
        let user = JSON.parse(sessionStorage.user);
        user.seller = true;
        sessionStorage.user = JSON.stringify(user);
        location.replace('/dashboard.html');
    }else if(data.product){
        location.replace('/dashboard');
    }
}

//show error
const showFormError = (err) => {
    let errorEle = document.querySelector('.error');
    errorEle.innerHTML = err;
    errorEle.classList.add('show');


    setTimeout(() => {
        errorEle.classList.remove('show');
    }, 2000);
}