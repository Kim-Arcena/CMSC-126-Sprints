import express from "express";
import bcrypt from "bcrypt";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, updateDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2q9NEJn2RrUpR8H89wHpeKnbYW4HPwvA",
  authDomain: "hypestreet-3b659.firebaseapp.com",
  projectId: "hypestreet-3b659",
  storageBucket: "hypestreet-3b659.appspot.com",
  messagingSenderId: "1019629277935",
  appId: "1:1019629277935:web:924ba762cf1cb18daf411a",
  measurementId: "G-QKJD4CGHCJ"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();


//init server
const app = express();

// aws
// aws
import aws from "aws-sdk";
import "dotenv/config";

// aws setup
const region = "ap-southeast-1";
const bucketName = "hypestreet";
const accessKeyId = process.env.AWSAccessKeyId;
const secretAccessKey = process.env.AWSSecretKey;

aws.config.update({
    region,
    accessKeyId,
    secretAccessKey
})

// init s3
const s3 = new aws.S3();

// generate image url
async function generateURL(){

    try {
        let date = new Date();

        const imageName = `${date.getTime()}.png`;
    
        const params = {
            Bucket: bucketName,
            Key: imageName,
            Expires: 300, // 300 ms
            ContentType: "image/png"
        }
    
        const uploadURL = await s3.getSignedUrlPromise("putObject", params);
        return uploadURL;
    } catch (err) {
        console.error("Something went wrong")
        console.error(err)
    }


}

app.get('/s3url', (req, res) => {
    generateURL().then(url => res.json(url));
})

app/

//middlewares
app.use(express.static("public"));

//enable form sharing
app.use(express.json());

//route
//home route
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "public" })
})


//signup route
app.get('/signup', (req, res) => {
    res.sendFile("signup.html", { root: "public" })
})

app.post('/signup', (req, res) => {
    const { name, email, password, number, tac } = req.body;

    //validation
    if(name.length < 3){
        res.json({'alert': 'Fullname must be at least 3 characters'});
    }
    else if(!email.length){
        res.json({ 'alert' : 'Email is required'});
    }
    else if(password.length < 8){
        res.json({ 'alert' : 'Password must be at least 8 characters'});
    }
    else if(!Number(number) || number.length < 10){
        res.json({ 'alert' : 'Invalid Number'});
    }
    else if(!tac){
        res.json({ 'alert' : 'You must agree to the terms and conditions'});
    }
    else{
        //store data in firebase
        const users = collection(db, "users");

        getDoc(doc(users, email)).then(user => {
            //check if it exists in the db
            if(user.exists()){
                return res.json({'alert': 'Email already exists'});
            }
            else{
                //else encrypt password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        //store data
                        req.body.password = hash;
                        req.body.seller = false;
                        
                        
                        setDoc(doc(users, email), req.body).then(data => {
                            res.json({
                                name: req.body.name,
                                email: req.body.email,
                                seller: req.body.seller,
                            })   
                        })
                    })
                })
            }
        })
    }   
})

app.get('/login', (req, res) => {
    res.sendFile("login.html", { root: "public" })
})

app.post('/login', (req, res) => {
    let { email, password } = req.body;
    if(!email.length || !password.length){
        res.json( { 'alert': 'Email and Password are required' });
    }
    const users = collection(db, "users");

    getDoc(doc(users, email)).then(user => {
        if(!user.exists()){
            return res.json({ 'alert': 'Email does not exist' });
        }
        else{
            bcrypt.compare(password, user.data().password, (err, result) => {
                if(result){
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller,
                    })
                }
                else{
                    return res.json({ 'alert': 'Invalid Password' });
                }
            })
        }
    })
})

// seller route
app.get('/seller', (req, res) => {
    res.sendFile('seller.html', { root : "public" })
})

app.post('/seller', (req, res) => {
    let { name, address, about, number, email } = req.body;

    if(!name.length || !address.length || !about.length || number.length < 10 || !Number(number)){
        return res.json({ 'alert' : 'some information(s) is/are incorrect' });
    } else{
        // update the seller status
        const sellers = collection(db, "sellers");
        setDoc(doc(sellers, email), req.body)
        .then(data => {
            const users = collection(db, "users");
            updateDoc(doc(users, email), {
                seller: true
            })
            .then(data => {
                res.json({ 'seller' : true })
            })
        })
    }
})

//dashboard route
app.get('/dashboard', (req, res) => {
    res.sendFile("dashboard.html", { root: "public" })
})

//add product
app.get('/add-product', (req, res) => {
    res.sendFile("add-product.html", { root: "public" });
})

app.get('/add-product/:id', (req, res) => {
    res.sendFile("add-product.html", { root: "public" });
})


app.post('/add-product', (req, res) => {
    let { name, shortDes, detail, price, image, tags, email, draft, id } = req.body;

    if(!draft){
        if(!name.length){
            res.json({'alert' : 'should enter product name'});
        } else if(!shortDes.length){
            res.json({'alert' : 'short des must be 80 letters long'});
        } else if(!price.length || !Number(price)){
            res.json({'alert' : 'enter valid price'});
        } else if(!detail.length){
            res.json({'alert' : 'must enter the detail'});
        } else if(!tags.length){
            res.json({'alert' : 'enter tags'});
        }
    }

    // add-product

    let docName = `${name.toLowerCase()}-${Math.floor(Math.random() * 50000)}`;

    let products = collection(db, "products");
    setDoc(doc(products, docName), req.body)
    .then(data => {
        res.json({'product': name})
    })
    .catch(err => {
        res.json({'alert': 'some error occured.'})
    })
})

app.post('/get-products', (req, res) => {
    let { email, id } = req.body
    
    let products = collection(db, "products");
    let docRef;

    if(id){
        docRef = getDoc(doc(products, id));
    } else{
        docRef = getDocs(query(products, where("email", "==", email)))
    }

    docRef.then(products => {
        if(products.empty){
            return res.json('no products');
        }
        let productArr = [];
        
        if(id){
            return res.json(products.data());
        } else{
            products.forEach(item => {
                let data = item.data();
                data.id = item.id;
                productArr.push(data);
            })    
        }

        res.json(productArr);
    })
})

app.post('/delete-product', (req, res) => {
    let { id } = req.body;

    deleteDoc(doc(collection(db, "products"), id))
    .then(data => {
        res.json('success');
    }).catch(err => {
        res.json('err');
    })
})


//localhost:3000/register
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

