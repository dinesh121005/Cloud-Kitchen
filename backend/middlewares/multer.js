import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
       cb(null, "./public")
   },
   filename: (req, file, cb) => {
       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6)
       const ext = path.extname(file.originalname) || ".jpg"
       cb(null, `upload-${uniqueSuffix}${ext}`)
   }
})

export const upload = multer({ storage })