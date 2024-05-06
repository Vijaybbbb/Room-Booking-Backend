
//variable shadowing____________________________________________________________________
// let a  =  'Hello '

// if(true){
//        let a = 'Hi'
//        console.log(a);
// }
// console.log(a);



//illegal variable shadowing ____________________________________________________________________
// let a  =  'Hello '

// if(true){
//        var a = 'Hi'
//        console.log(a);
// }
// console.log(a);

// console.log(getName);

// var getName = () => {
//        console.log("Vijay");
// }


// IIFE_________________________________________________________________________________________

// (()=>{
//        console.log("kjhedkjhkjds")
// })()


// ((x)=>{
//  return ((y)=>{
//        console.log(x);
//  })(2)
// })(1)


// for(let i = 0 ;  i < 5 ; i++){
//        setTimeout(()=>{
//               console.log(i);
//        },0)
// }
// op ; 1,2,3,4,5


// for(var i = 0 ;  i < 5 ; i++){
//        setTimeout(()=>{
//               console.log(i);
//        },0)
// }
// op ; 5,5,5,5,5



//Hoisting ________________________________________________________________________________

// var a = 10

// function fun(){
//        console.log(a);
//        var a = 20
// }

// fun()


//--prefer current scope




//spred and rest _________________________________________________________________________________

// function get(a,b,...c){
// console.log(a,b,c);
// }

// get(...Object.values({
//        name:'vijay',
//        age:21,
//        place:'knr'
// }))



// let obj = {
// name:'vijay',
// age:21
// }

// const {age , name:kjfjfj}  = obj

// console.log(age,kjfjfj);







   