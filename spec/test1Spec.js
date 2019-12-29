var bigger = require('../www/js/testing.js');


describe("test1", function(){
    it("should print a > b", function(){
        var a = 5;
        var b = 2;
        var expectedResult = "A is bigger than B";
        var result = bigger(a, b);
        expect(result).toBe(expectedResult);
    });

    it("should print b > a", function(){
        var b = 10;
        var a = 2;
        var expectedResult = "B is bigger than A";
        var result = bigger(a, b);
        expect(result).toBe(expectedResult);
    });
});

