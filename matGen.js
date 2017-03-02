var MatGen = (function () {
    function MatGen() {
    }
    MatGen.getInstance = function () {
        if (!MatGen.instance) {
            MatGen.instance = new MatGen();
        }
        return MatGen.instance;
    };
    return MatGen;
}());
//# sourceMappingURL=matGen.js.map