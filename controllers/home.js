import queries from "../db/queries.js";
import supbase from '../lib/supbase.js'


export function handleAuthorization(req, res, next) {
    if (!req.user) return res.redirect('/login');
    next();
}

export async function renderHome(req, res) {

    let currentLocation = req.session.location || '0';
    req.session.location = null;

    try {
        let folders = await queries.getAllUserFolders();
        folders = JSON.stringify(folders);

        let files = await queries.getAllUserFiles();
        files = JSON.stringify(files);

        res.render('home', { folders, files, currentLocation });
    } catch (error) {
        next(error);
    }

}

export async function handleNewFolder(req, res, next) {

    let folder_name = req.body.name;
    let location = req.body.location;
    try {
        await queries.insertFolder({
            name: folder_name,
            parent_id: location,
            user_id: req.user.id,
        })

    } catch (error) {
        return next(error)
    }

    req.session.location = location;
    res.redirect('/home');
}


/*export async function handleViewFolder(req, res) {
    let folder_id = req.params.id;
    let content = await queries.getUserFilesById(req.user.id, folder_id);
    let folder = await queries.getFileById(folder_id, req.user.id);
    let parent = folder.parent_id;
    res.render('home', { content, parent });
}

*/




/*export async function handleUploadFile(req, res) {

    let path = req.body.path.split('/');
    let parent = path[path.length - 1];

    if (!parent.trim()) parent = null;

    try {
        let url = await supbase.uploadSingleFile(req.file);
        let file = {};
        file.name = req.file.originalname;
        file.size = req.file.size;
        file.link = url;
        file.extension = req.file.mimetype;
        file.user_id = req.user.id
        file.parent_id = parent;
        file.type = 'file';
        await queries.insertFile(file)
        res.send('ok');
    }
    catch (e) {
        res.send('error uploading file');
        return;
    }
}*/