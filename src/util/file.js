const multer = require('multer'); // multer모듈 적용 (for 파일업로드)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})

const upload = multer({ storage: storage })

module.exports = {
  upload
};