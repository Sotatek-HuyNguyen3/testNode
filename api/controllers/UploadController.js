const fs = require("fs");
const formidable = require("formidable");
const path = require('path')

module.exports = {
    upload: async (req, res) => {
        const form = formidable({multiples: true});
        var dir = "./api/uploads/";

        form.parse(req, async function (err, fields, file) {
            var oldPath = file.files.path;
            var ext = await path.extname(file.files.name);

            await (async () => {
                if (ext === '.jpg' || ext === '.png' || ext === '.jpeg') {
                    dir = "./api/uploads/images/";
                }
                form.uploadDir = dir
                if (!fs.existsSync(dir)) {
                    await fs.mkdirSync(dir, {recursive: true});
                }
            })();
            var newPath = dir + Math.random().toString(36).substring(7) + Date.now() + ext;

            await fs.copyFile(oldPath, newPath, function (err) {
                if (err) throw err;
                return res.json({message: "upload success!", dir: newPath})
            })
        })
    },

    getFile: async (req, res) => {
        var filePath = req.body.path;
        if (fs.existsSync(filePath)) {
            await fs.readFile(filePath,
                function (err, content) {
                    if (err) throw  err;
                    return res.end(content);
                });
        }
        return res.json('cannot load file');
    },

    download: (req, res) => {
        var fileName = req.params.image;
        var filePath = "./api/uploads/images/" + fileName
        if (fs.existsSync(filePath)) {
            return res.download(filePath, function (err) {
                res.json(err)
            });
        }
        return res.json('error');
    }
}
