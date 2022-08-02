const myObj = {};

function d() {
    // Here we will store the current stack trace into myObj
    // This time we will hide all the frames after `b` and `b` itself
    Error.captureStackTrace(myObj, b);
}

function c() {
    d();
}

function b() {
    c();
}

function a() {
    b();
}

// First we will call these functions
a();

// Now let's see what is the stack trace stored into myObj.stack
console.log(myObj.stack);