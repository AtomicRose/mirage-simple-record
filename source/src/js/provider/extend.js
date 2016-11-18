var extend = function (o, n, override) {
    for (var key in n) {
        o[key] = n[key];
    }
};

module.exports = extend;