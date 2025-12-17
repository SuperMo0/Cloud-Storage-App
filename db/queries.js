import prismaClient from '../lib/prisma.js'

async function insertUser(user) {
    try {
        let response = await prismaClient.users.create({
            data: {
                name: user.email,
                email: user.email,
                password: user.password,
            },
        })
        return response;
    }
    catch (e) {
        throw e;
    }
}

async function insertFolder(folder) {

    try {
        await prismaClient.folders.create({
            data: {
                name: folder.name,
                parent_id: folder.parent_id,
                usersId: folder.user_id,
            }
        })
    } catch (error) {
        throw error
    }
}

async function createRootFolder(user_id) {

    try {
        await prismaClient.folders.create({
            data: {
                id: "0",
                name: "root",
                parent_id: '0',
                usersId: user_id,
            }
        })
    } catch (error) {
        throw error
    }
}




/*async function insertFile(file) {

    prismaClient.files.create({
        data: {
            name: file.name,
            link: file.link,
            size: file.size,
            type: file.type,
            parent_id: file.parent_id,
            extension: file.extension,
            usersId: file.user_id,
        }
    }).catch((err) => {
        console.log('err');
    })

}*/

async function checkIfUserExist(email) {
    const res = await prismaClient.users.findFirst({
        where: {
            email: email
        }
    })
    if (res) return true;
    return false;
}


async function getUserByid(id) {
    const res = await prismaClient.users.findFirst({
        where: {
            id: id
        }
    })
    return res;
}

async function getUserByEmail(email) {
    const res = await prismaClient.users.findFirst({
        where: {
            email: email
        }
    })
    return res;
}

/*async function getUserFilesById(id, parent) {
    const res = await prismaClient.files.findMany({
        where: {
            AND: { usersId: id, parent_id: parent }
        }
    })
    return res;
}*/

async function getAllUserFolders(id) {

    try {
        const res = await prismaClient.folders.findMany({
            where: {
                usersId: id
            }
        })
        return res;

    } catch (error) {
        throw error
    }
}

async function getAllUserFiles(id) {
    try {
        const res = await prismaClient.files.findMany({
            where: {
                usersId: id
            }
        })
        return res;

    } catch (error) {

    }
}


/*async function getFileById(id, user_id) {
    const res = await prismaClient.files.findFirst({
        where: {
            AND: { id: id, usersId: user_id }
        }
    })
    return res;
}*/


export default { insertUser, checkIfUserExist, getAllUserFiles, getAllUserFolders, getUserByid, insertFolder, createRootFolder, getUserByEmail }