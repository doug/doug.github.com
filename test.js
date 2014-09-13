// if/else/for/while/try always have spaces, braces and span multiple lines
// this encourages readability

// 2.A.1.1
// Examples of really cramped syntax

if ( condition ) {
    doSomething();
}

while ( condition ) {
    iterating++;
}

for ( var i = 0; i < 100; i++ ) {
    someIterativeFn();
}

// 2.A.1.1
// Use whitespace to promote readability

if ( condition ) {
    // statements
}

while ( condition ) {
    // statements
}

for ( var i = 0; i < 100; i++ ) {
    // statements
}

// Even better:

var i,
    length = 100;

for ( i = 0; i < length; i++ ) {
    // statements
}

// Or...

var i = 0,
    length = 100;

for ( ; i < length; i++ ) {
    // statements
}

var prop;

for ( prop in object ) {
    // statements
}

if ( true ) {
    // statements
} else {
    // statements
}
