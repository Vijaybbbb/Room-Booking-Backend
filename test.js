
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




//imp 

// function getName(){
//        console.log(arguments);
// }

// getName(1,2,3,4)




//this _______________________________________________________________________

// var a = 5 
// function getName (){
//        console.log(this.a);
// }
// getName()



// let obj  ={
//        name:'vijay',
//        f1:()=>{
//               console.log(this.name);
//        },
//        f2:function(){
//               console.log(this.name);
//        }
// }

// obj.f1()
// obj.f2()




// let obj  = {
//        name :'vijay',
//        fun:function (){
//               const inside = () =>{console.log(this.name);}
//               inside();
//        }
// }
// obj.fun()


//this takes value from  parent function




// const array = [1,2,3,34,4,4,45,5,342,2,2,3,4,45,54]

// console.log(array.filter((num,index,array)=>{
//       return array.indexOf(num) != index ? num : ''
// }));

//map polyfils-------------------------------------------------------

// Array.prototype.myMap = function(cb){
//        let newArray = []
//        for(i = 0 ; i< this.length ; i++){
//         newArray.push(cb(this[i],i,this))     
//        }
//        return newArray
// }

// const array = [1,2,3,4,4]

// const result  = array.myMap((n,i,array)=>{
//     return n *2 
// })

// console.log(result);





//filter poly fil-------------------------------------------

// Array.prototype.myFilter = function(cb){

//        let newArray = []
//        for (i = 0 ;i < this.length ; i++){
//               if(cb(this[i],i,this)){
//                      newArray.push(this[i])
//               }
//        }
//        return newArray
// }

// const array = [1,2,2,3,4]

// const data  = array.myFilter((n,i,array)=>{
//            return n%2 == 0       
// })

// console.log(data);





//reducerc polyfill-----------------------------------------------------

// Array.prototype.myReduce = function(cb,initialvalue){
//        let acc =initialvalue;
//        for(i = 0;i<this.length;i++){
//            acc =  acc ? cb(acc,this[i],i,this) : this[i]  
//        }
// }



// const array = [1,2,3,4]

// const result  = array.reduce((acc,cur,index,array)=>{
//        return acc+cur
// })
// console.log(result);




//map fileter reduce question 

// const array = [
//        {name:'vijay',age:21},
//        {name:'john',age:22},
//        {name:'max',age:20},
//        {name:'aman',age:25},
// ]

// const result  = array.map((n,index,array)=>{
//        return n.name.toUpperCase()
// })
// console.log(result);

// const result  = array.reduce((acc,cur,index,array)=>{
//        return acc + cur.age
// },0)
// console.log(result);

//closure scope chaining

// var x= 10
// function myFunction(a){
//        return function (b){
//               return function (c){
//                      return function (d){      
//                           console.log(a+b+c+d+x);  
//                      }
//               }
//        }

// }


// myFunction(2)(2)(2)(2)



//infinit currying

// function myFun(x){
//   return function (y){
//        if(y) return myFun(x+y)
//        return x
//   }
// }


// console.log(myFun(1)(2)(1)(2)(3)(2)());



