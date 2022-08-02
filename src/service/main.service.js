const { contents } = require("../models/index");
const Paging = require('../util/paging');

class MainService{    
    constructor() {
        this.paging = new Paging();
    }

}

module.exports = MainService;
