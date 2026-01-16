module.exports = {
    single: function() {
        return "Hello from single function export!";
    },
    multi: {
        add: (a, b) => a + b,
        sub: (a, b) => a - b
    },
    sayHi: () => "Hi from exports shortcut!"
};
