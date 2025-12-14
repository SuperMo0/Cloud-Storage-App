import prismaClient from '../lib/prisma.js'

async function insertUser(user) {
    prismaClient.users.create({
        data: {
            name: user.email,
            email: user.email,
            password: user.password,
        }
    }).then().catch((e) => { throw e });
}

async function insertFile(file) {

    console.log(file.parent_id);

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

}

async function checkIfUserExist(email) {
    const res = await prismaClient.users.findFirst({
        where: {
            email: email
        }
    })
    if (res) return true;
    return false;
}

async function getUserByEmail(email) {
    const res = await prismaClient.users.findFirst({
        where: {
            email: email
        }
    })
    return res;
}

async function getUserByid(id) {
    const res = await prismaClient.users.findFirst({
        where: {
            id: id
        }
    })
    return res;
}

async function getUserFilesById(id, parent) {
    const res = await prismaClient.files.findMany({
        where: {
            AND: { usersId: id, parent_id: parent }
        }
    })
    return res;
}


async function getFileById(id, user_id) {
    const res = await prismaClient.files.findFirst({
        where: {
            AND: { id: id, usersId: user_id }
        }
    })
    return res;
}


export default { insertUser, checkIfUserExist, insertFile, getUserFilesById, getUserByEmail, getUserByid, getFileById }