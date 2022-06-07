


let loader = document.querySelector('.loader');
let applyBtn = document.querySelector('.apply-btn');
let sellerForm = document.querySelector('.seller-form');

applyBtn.addEventListener('click', () => {
    let businessName = document.querySelector('#name').value;
    let address = document.querySelector('#address').value;
    let about = document.querySelector('#about').value;
    let number = document.querySelector('#number').value;

    if(!businessName.length || !address.length || !about.length || number.length < 10 || !Number(number)){
        showFormError('Some information is missing');
    }
    else{
        //submit form
        loader.style.display = 'block';
        // sellerForm.classList.add('blur');

        sendData('/seller', {
            name: businessName,
            address: address,
            about: about,
            number: number,
            email: JSON.parse(sessionStorage.user).email
        })
    }
})