const customError = require('./Error/customError');
const errorCode = require('./Error/errorCode');

class Paging {
    // 디폴트 페이지 가져올 사이즈
    DEFAULT_START_PAGE = 1;
    DEFAULT_PAGE_SIZE = 5;
    constructor() { }
    pageResult(curpage, limit) {
        // 페이지가 숫자가 아니면 에러
        if (typeof curpage !== 'number') throw new customError(errorCode.CURPAGE_MUST_BE_NUMBER)
        // 페이지가 0보다 작으면 기본 페이지 적용
        if (curpage <= 0) curpage = this.DEFAULT_START_PAGE
        return {
            offset: (curpage - 1) * (limit || this.DEFAULT_PAGE_SIZE),
            limit: limit || this.DEFAULT_PAGE_SIZE
        };
    }
}

module.exports = Paging;