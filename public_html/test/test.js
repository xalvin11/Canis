
// CANIS.debounce Test
window.addEventListener('resize', CANIS.debounce(function () {
    console.log('RESIZED');
}, 250));

// CANIS.poll Test
CANIS.poll(function () {
    return CANIS.get('https://jsonplaceholder.typicode.com/posts', {
        name: 'test 1',
        value: 1
    });
}, 1000, 100).then(function (response) {
    console.log('GET', response);
});
CANIS.poll(function () {
    return CANIS.post('https://jsonplaceholder.typicode.com/posts', {
        name: 'test 2',
        value: 2
    });
}, 2000, 200).then(function (response) {
    console.log('POST', response);
});
CANIS.poll(function () {
    return CANIS.put('https://jsonplaceholder.typicode.com/posts/1', {
        name: 'test 3',
        value: 3
    });
}, 3000, 300).then(function (response) {
    console.log('PUT', response);
});
CANIS.poll(function () {
    return CANIS.delete('https://jsonplaceholder.typicode.com/posts/1', {
        name: 'test 4',
        value: 4
    });
}, 4000, 400).then(function (response) {
    console.log('DELETE', response);
});

// CANIS.once Test
var fireOnce = CANIS.once(function () {
    console.log('Fired');
});
fireOnce();
fireOnce();

// CANIS.getAbsoluteUrl Test
console.log('URL /', CANIS.getAbsoluteUrl('/test'));
console.log('URL ./', CANIS.getAbsoluteUrl('./test'));
console.log('URL ../', CANIS.getAbsoluteUrl('../test'));

// CANIS.insertStyle Test
CANIS.insertStyle("body { color: red; }");

// CANIS.matchesSelector Test
console.log('#text is :text', CANIS.matchesSelector(document.getElementById("text"), "input[type=text]"));
console.log('#text is :radio', CANIS.matchesSelector(document.getElementById("text"), "input[type=radio]"));
console.log('#radio is :text', CANIS.matchesSelector(document.getElementById("radio"), "input[type=text]"));
console.log('#radio is :radio', CANIS.matchesSelector(document.getElementById("radio"), "input[type=radio]"));

// Speed Test agains jQuery
var start = +new Date();
CANIS.get('https://jsonplaceholder.typicode.com/posts').then(function () {
    var endCANIS = +new Date();
    console.log('CANIS GET speed', endCANIS - start);
});
$.get('https://jsonplaceholder.typicode.com/posts', function () {
    var endJQUERY = +new Date();
    console.log('JQUERY GET speed', endJQUERY - start);
});

