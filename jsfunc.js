//setInterval()
//setTimeout()

let mycolor = (name, ...favoriteColor) => {
let colorString = favoriteColor.join(", ");
console.log(`My name is ${name} and my favorite colors are ${
colorString}`)
};

let sub = (name, ...subjects) => {
    let subj = subjects.join(", ")
    console.log(`${name} best subject are ${subj}`)
}

sub("tom", "green", "red", "yellow");
mycolor("sam", "math", "spain", "economics");

let sum = (...num) => {
    let t = 0
    for (let n of num){
        t += n
    }
    console.log(t)
}

sum(3,5, 6,7);

function saHello(){
    console.log("Hello Monica");
}

let say = saHello()

say;
let sa = saHello

sa();
