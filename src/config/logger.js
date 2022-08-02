"use strict";

const {createLogger,transports,format} = require("winston");
const {combine,colorize,timestamp,printf,label,simple} = format;
const winstonDaily = require("winston-daily-rotate-file");

// 출력할 포맷터
const printFormat = printf(({timestamp,label,level,message}) => {
    return `${timestamp} [${label}] ${level} : ${message}`;
});

const printLogFormat = {
    file :combine(
        label({
            label: "codiary"
        }), // 프로젝트 이름
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }), // 날짜 포맷
        printFormat, // 출력할 포맷터 지정
    ),
    console: combine(
        colorize(), // info,error 등 색을 바꿔줌
        simple(), // 심플 포맷터 
    ),
};

const opts = {
    file: new winstonDaily({
        filename: "%DATE%.access.log",
        dirname: "./logs",
        level:"info",
        maxFiles:30,
        zippedArchive:true,
        format: printLogFormat.file, // 포맷 방식
    }),
    fileErr :new winstonDaily({
        filename: "%DATE%.error.log", // 파일 이름
        dirname: "./logs/error", // 파일 디렉토리 위치
        level:"error", // 로그 레벨
        maxFiles:30, // 파일 저장 날짜 
        zippedArchive:true,
        format: printLogFormat.file, // 포맷 방식 
    }),
    console: new transports.Console({
        level:"debug",
        format: printLogFormat.console,
    })
}

const logger = createLogger({
    transports:[opts.file,opts.fileErr], // 출력 옵션 선택
});

if (process.env.NODE_ENV !== "production"){
    logger.add(opts.console); // dev 레벨이면 console에 찍음
}

logger.stream = {
    write:(message) => logger.info(message),
};

module.exports = logger;