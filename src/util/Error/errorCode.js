"use strict";

const errorCode = {
    SERVER_ERROR: { status: 500, message: 'Server Error' },
    CURPAGE_MUST_BE_NUMBER: { status: 400, message: 'curpage is must be a number' },
};

module.exports = errorCode;


