import formidable from "formidable";
import fs from "fs/promises"
import path from "path";
import { pgPool } from "../../../../utils/database";

export const config = {
    api: {
        bodyParser: false,
    },
};
//Funciones que manejan el cambio de foto de perfil
const updatePicture = async (fileName, id) =>{
    const image = fileName
    await pgPool.query('UPDATE usuarios SET pictureuser = $1 WHERE id = $2 RETURNING *',[image, id],(error, results) =>{
        if (error) {
            throw error
        };
        res.json({
            error: false, 
            message: 'Image Updated',
        });
    })
}


const readFile = async (req, saveLocally) =>{
    const query = req.query;
    const {id} = query
    const options = {};
    var fileName = ''
    if(saveLocally){
        options.uploadDir = path.join(process.cwd(), "/public/images");
        
        options.filename = (name, ext, path, form) => {
            fileName = Date.now().toString() + "_" + path.originalFilename
            updatePicture(fileName, id)
            return fileName;
        }
    }

    const form = formidable(options)
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if(err) reject(err);
            resolve({fields, files})
        })
    })
}

export default async (req, res) =>{
    try{
        await fs.readdir(path.join(process.cwd() + "/public", "/images"));
    }catch(error){
        await fs.mkdir(path.join(process.cwd() + "/public", "/images"))
    }
    await readFile(req, true)
    res.status(200).json({message: "Image updated"})
}