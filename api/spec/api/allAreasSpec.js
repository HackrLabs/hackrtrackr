var Area = require('../../libs/areas');

describe("A suite", function(){
    it("contains spec with an expection", function(){
        expect(true).toBe(true);
    })
});

describe("Gets All of the Areas", function(){
    var allAreas = new Area.Areas()
    var areas;
    var error;

    beforeEach(function(){
        allAreas
            .fetch()
            .then(function(area){
                areas = area;
            })
            .otherwise(function(err){
                error = err
            })
    })
    
    it("Should Create a collection", function(){
        expect(typeof areas).toBe("object")
    })
    it("Should not thow an error", function(){
        expect(err).not.toBeDefined()
    })
    it("Has a total count greater than 0", function(){
        expect(areas.length).toBeGreaterThan(0)
    });
})
