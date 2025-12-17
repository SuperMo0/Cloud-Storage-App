

(function handleDropdown() {
    const newFolderDropdown = document.querySelector('.new-folder-dropdown');

    const newFolderForm = document.querySelector('.new-folder-form');

    newFolderDropdown.addEventListener("click", (e) => {
        newFolderForm.classList.toggle('hide');
    })
})();



let folders = [];
let files = [];
let foldersMap = new Map();
let root = 0;
let currentLocation = root;
let pathList = ['My Drive'];

(function populate() {
    let mainContent = document.querySelector('.main-content');

    folders = JSON.parse(mainContent.dataset.folders);

    files = JSON.parse(mainContent.dataset.files);

    currentLocation = mainContent.dataset.currentlocation;

    for (let folder of folders) {
        foldersMap.set(folder.id, { name: folder.name, id: folder.id, parent_id: folder.parent_id, folders: [], files: [] });
    }

    for (let folder of folders) {
        if (folder.parent_id == folder.id) continue;
        foldersMap.get(folder.parent_id).folders.push(folder);
    }

    for (let file of files) {
        foldersMap.get(file.parent_id).files.push(file);
    }

})();



(function buildTree() {

    let builder = function (currentLocation, parent) {

        currentLocation.parent = parent;
        for (let i = 0; i < currentLocation.folders.length; i++) {
            let child = currentLocation.folders[i];
            child = foldersMap.get(child.id);
            currentLocation.folders[i] = builder(child, currentLocation);

        }
        return currentLocation;
    }

    root = builder(foldersMap.get('0'), foldersMap.get('0'));
})();


(function handleNavigation() {

    currentLocation = foldersMap.get(currentLocation);
    let crnt = currentLocation;
    while (crnt.id != 0) {
        pathList.push(crnt.name);
        crnt = crnt.parent;
    }
    foldersMap.clear();
    let foldersContainer = document.querySelector('.folders-container');

    let folderTemplate = document.querySelector('.folder-container').cloneNode(true);

    folderTemplate.classList.remove('hide');


    let filesContainer = document.querySelector('.files-container');

    let mediaFileTemplate = document.querySelector('.file-container.media').cloneNode(true);
    mediaFileTemplate.classList.remove('hide');

    let pdfFileTemplate = document.querySelector('.file-container.pdf').cloneNode(true);
    pdfFileTemplate.classList.remove('hide');

    let generalFileTemplate = document.querySelector('.file-container.general').cloneNode(true);
    generalFileTemplate.classList.remove('hide');

    let showDirecotory = function (folder) {
        filesContainer.replaceChildren();
        foldersContainer.replaceChildren();

        for (let f of folder.folders) {
            let newFolder = folderTemplate.cloneNode(true);
            newFolder.querySelector('.folder-name').textContent = f.name;
            newFolder.onclick = () => { pathList.push(f.name); showDirecotory(f); currentLocation = f }
            foldersContainer.appendChild(newFolder);
        }

        for (let f of folder.files) {
            let newFile;

            if (f.type.startsWith('image') || f.type.startsWith('video')) newFile = mediaFileTemplate.cloneNode(true);
            else if (f.type === 'Application/pdf') newFile = pdfFileTemplate.cloneNode(true);
            else newFile = generalFileTemplate.cloneNode(true);

            newFile.querySelector('.file-name').textContent = f.name;
            newFile.querySelector('.file-size').textContent = (f.size / 1000000) + "MB";
            newFile.querySelector('.file-creation-time').textContent = f.created_at;
            filesContainer.appendChild(newFile);
        }
        let path = document.querySelector('.path');
        path.textContent = pathList.join(' > ');
    }

    let backButton = document.querySelector('.go-back');
    function navigateBack() {
        if (currentLocation === root) return;
        pathList.pop();
        currentLocation = currentLocation.parent;
        showDirecotory(currentLocation);
    }
    backButton.onclick = navigateBack;


    showDirecotory(currentLocation);
    // showPath()

})();


(function handlePostNewFolder() {

    let newFolderForm = document.querySelector('.new-folder-form');
    let location = newFolderForm.querySelector('#location');
    newFolderForm.addEventListener('submit', (e) => {
        location.value = currentLocation.id;
    })

})();






/*let folders = document.querySelectorAll('.folder-container');
folders.forEach((f) => {
    console.log(f.dataset.id);
    f.addEventListener('click', () => {
        window.location.replace('/folder/' + f.dataset.id);
    })
})

let goBack = document.querySelector('.go-back');
goBack.addEventListener('click', () => {
    let parent = goBack.dataset.id;
    if (parent == '')
        window.location.replace('/');
    else window.location.replace('/folder/' + parent);
})*/












/*let uploadedFileName = document.querySelector('.file-name');

let fileInput = document.querySelector('#file');
let fileform = document.getElementById('file-form');
let progressBar = document.querySelector('.progress-bar')

fileInput.addEventListener("change", async (e) => {

    let file = e.target.files[0];
    let sizemb = file.size / 1000000;
    if (sizemb > 5) {
        alert('file too big!');
        fileInput.files = null;
        return;
    }
    let allowed = ['application/pdf', 'text/plain',]
    if (!file.type.startsWith('image') && !file.type.startsWith('video') && !allowed.includes(file.type)) {
        fileInput.files = null;
        alert('unknown file type')
        return
    }
    uploadedFileName.textContent = file.name;
    let data = new FormData(fileform);

    let xhr = new XMLHttpRequest()

    progressBar.classList.remove('hide');
    xhr.upload.addEventListener('progress', (e) => {
        let current = e.loaded / e.total;
        progressBar.value = Math.floor(current * 100);
    })

    xhr.upload.addEventListener('loadend', (e) => {
        progressBar.classList.add('hide');
        fileInput.files = null;
    })

    xhr.addEventListener("loadend", (e) => {
        window.location.reload();
    })

    data.append('path', window.location.pathname);
    xhr.open('post', '/upload');
    xhr.send(data);

})



let files = document.querySelectorAll('.file-container');

let imagePreviewContainer = document.querySelector('.image-preview-container');
let imagePreview = document.querySelector('.image-preview');
let videoPreview = document.querySelector('.video-preview');
let download = document.querySelector('.download-media');
files.forEach((f) => {
    if (!f.dataset.type.startsWith('image') && !f.dataset.type.startsWith('video')) {
        f.addEventListener('click', (e) => {
            let link = document.createElement('a');
            link.href = f.dataset.link + '?download';
            console.log(link.href);
            link.download = f.dataset.name;
            link.click();
        })
    }
    else if (f.dataset.type.startsWith('image')) {
        f.addEventListener('click', (e) => {
            videoPreview.classList.add('hide');
            imagePreview.classList.remove('hide');
            imagePreview.src = f.dataset.link;
            download.href = f.dataset.link + '?download';
            download.classList.remove('hide');

        })
    }
    else if (f.dataset.type.startsWith('video')) {
        f.addEventListener('click', (e) => {
            imagePreview.classList.add('hide');
            videoPreview.classList.remove('hide');
            videoPreview.src = f.dataset.link;
            videoPreview.play();
            download.href = f.dataset.link + '?download';
            download.classList.remove('hide');
        })
    }

})
*/