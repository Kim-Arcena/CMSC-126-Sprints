const createProduct = (data) => {
    let productContainer = document.querySelector('.product-container');
    productContainer.innerHTML += `
    <div class="product-card">
        <button class="btn edit-btn" onclick="location.href = '/add-product/${data.id}'"><i class="fas fa-edit"></i></button>
        <button class="btn open-btn" onclick="location.href = '/products/${data.id}'"><i class="fas fa-folder-open"></i></button>
        <button class="btn delete-btn" onclick="deleteItem('${data.id}')"><i class="fas fa-trash"></i></button>
        <div class="product-name">${data.tags[0]}</div>
        <img src="${data.image}" class="product-image" alt="">              
    </div>
    `;
}

const deleteItem = (id) => {
    fetch('/delete-product', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({id: id})
    }).then(res => res.json())
    .then(data => {
        // process data
        if(data == 'success'){
            location.reload();
        } else{
            showAlert('some error occured');
        }
    })
}

