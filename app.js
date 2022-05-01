//SIZE VARIABLES
const NOTI_SIZE = [1024, 512];
const widthRatio = NOTI_SIZE[0] / NOTI_SIZE[1]
const heightRatio = NOTI_SIZE[1] / NOTI_SIZE[0]
const RangeDefaultValue = 100;
const CTAbtnSource = './images';

let isNotiActive = true;

let imageTray = []

let scalingType = undefined;

let canvasDefaultSize = [1024, 512]
const maxScale = 2048;


const cornerTextDetails = {
    fontName: 'gotham',
    fontSize: '23px',
    fontWeight: 'bold',
    fontColor: 'white',
    textAlign: 'right'
}

//Canvas Image
let imgData = [];


let TotalImage = 0;


let lastUsedScaleMethod = null; //scaletoFit OR scaletoFill

let savefileName = '';

//DOM-imgSet
const DOMImageSet = document.querySelectorAll(".DOM-imgSet img")

//NEVIGATION MENUS
const navMenu = document.querySelectorAll(".nav-menu")

//BUTTONS VARIABLE
const addImg = document.querySelector('.addImg');
const removeImg = document.querySelector('.removeImg');
const previewBtn = document.querySelector('.previewBtn')
const scaleToFitBtn = document.querySelector('#scaleToFit')
const restBTN = document.querySelector('#reset-btn')
const exportBtn = document.querySelector('#exportBtn')


//INPUTS
const imageSelect = document.querySelector('.imageSelect');
const ctaContainer = document.querySelector('.cta')
const ctaDrop = ctaContainer.querySelector("#cta");
const browseFile = document.querySelector('#browseFile')
const errorMsg = document.querySelector('.errorBrowse')
const copySelect = document.querySelector('#copySelect')
const cornerText = document.querySelector('#cornerText')

//INPUT RANGE
const xRange = document.querySelector("#x-range")
const yRange = document.querySelector("#y-range")
const scaleRange = document.querySelector("#scale-range")
const qualityRange = document.querySelector("#quality-range")
const canvasClr = document.querySelector("#canvasClr")
const fileSize = document.querySelector('.fileSize')


//INPUT RANGE INDICATOR
const xPointZERO = document.querySelector(".x-pointZERO")
const yPointZERO = document.querySelector(".y-pointZERO")
const scaleZERO = document.querySelector(".scaleZERO")
const quality = document.querySelector(".quality")

//CANVAS
const actualImg = document.querySelector('#actualImg')
const actualImgCTX = actualImg.getContext('2d')
const previewImg = document.querySelector('#previewImg')
const imageContainer = document.querySelector('.image-container')


//CANVAS SETUP
imageContainer.style.width = `${imageContainer.parentElement.offsetWidth}px`;
imageContainer.style.height = `${imageContainer.parentElement.offsetWidth * heightRatio}px`;

window.addEventListener('resize', () => {
    imageContainer.style.width = `${imageContainer.parentElement.offsetWidth}px`;
    imageContainer.style.height = `${imageContainer.parentElement.offsetWidth * heightRatio}px`;
})


let defaultScale = NOTI_SIZE[0] * 2;

actualImg.width = NOTI_SIZE[0]
actualImg.height = NOTI_SIZE[1]





//CTA Buttons
const CTA = [
    'Watch-Now.png',
    'Bengali.png',
    'Gujarati.png',
    'Hindi.png',
    'Kannada.png',
    'Live-Now.png',
    'Malayalam.png',
    'Marathi.png',
    'Play-Now.png',
    'Punjabi.png',
    'Read-Now.png',
    'Start-Watching.png',
    'Tamil.png',
    'Telugu.png',
    'Watch-Live-News-Updates.png',
    'Watch-Live.png',
    'Play.png'
]


//!Event Listner ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//!01 Handle CTA Copy (Right Bottom Corner)
copySelect.addEventListener('change', (e) => {
    if (e.target.value == 'only-gradient') {
        cornerText.classList.remove('hideImageInputs')
    } else {
        cornerText.classList.add('hideImageInputs')
    }
})


//!02 Change Canvas Background color
canvasClr.addEventListener('change', (e) => {
    actualImg.style.background = e.target.value;
    imageContainer.style.background = e.target.value;
})


//!03 Image Browse Event
browseFile.addEventListener('change', (e) => {
    if (e.target.files.length > 3) {
        alert('Please select files should be 3 max')
        window.location.reload()
    }
})



//!04 Preview Image Click
previewBtn.addEventListener('click', ()=>{
    if (browseFile.files.length > 0) {
        updateImageSelect()
        loadCanvas()
        
        scalingType = 'scaleToFill';
        // imgGenerator()
    } else {
        alert('Please select files should be 3 max')
    }
})

//!05 Scale to Fit
scaleToFitBtn.addEventListener('click', ()=>{
    if (browseFile.files.length > 0) {
        updateImageSelect()
        loadCanvas()
        
        scalingType = 'scaleToFit';
        // imgGenerator()
    } else {
        alert('Please select files should be 3 max')
    }
})

//!06. Input Range Update
xRange.addEventListener('change', updateCanvas)
yRange.addEventListener('change', updateCanvas)
scaleRange.addEventListener('change', updateCanvas)
qualityRange.addEventListener('change', updateCanvas)


//!07 Export Image
exportBtn.addEventListener('click', () => {
    if(imageTray.length === 0) return
    exportImg(Number(qualityRange.value))
})



//!Functions ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function activeMenu() {
    navMenu.forEach(menu => {
        if (Array.from(menu.classList).includes('active-menu')) {
            ctaContainer.classList.remove('hideImageInputs')
            ctaDrop.innerHTML = ""
            CTA.forEach((ctaBtn) => {
                ctaDrop.innerHTML += `<option value='${ctaBtn}'>${ctaBtn.replace(/.png/g, '').replace(/-/g, ' ')}</option>`
            })
        }
    })
}



function updateImageSelect() {
    imageSelect.innerHTML = '';
    Array.from(browseFile.files).forEach((_, index) => {
        imageSelect.innerHTML += `<option value="IMG-${index + 1}" data-img="img${index + 1}">IMG ${index + 1}</option>`
    })

}

//!1. Check Onload Event
window.onload = function () {
    activeMenu()
}


function imgGenerator() {


    const loadImage1 = new Promise((resolve, reject) => {
        if (browseFile.files[0]) {
            let read = new FileReader()
            read.onload = function () {
                imageTray.push(new Image())
                imageTray[0].crossOrigin = "Anonymous";
                imageTray[0].src = read.result;
                resolve(true)
            }
            read.readAsDataURL(browseFile.files[0])
        }
    })

    const loadImage2 = new Promise((resolve, reject) => {
        if (browseFile.files[1]) {
            let read = new FileReader()
            read.onload = function () {
                imageTray.push(new Image())
                imageTray[1].crossOrigin = "Anonymous";
                imageTray[1].src = read.result;
                resolve(true)
            }
            read.readAsDataURL(browseFile.files[1])
        } else if (browseFile.files.length < 2) {
            resolve(true)
        }


    })

    const loadImage3 = new Promise((resolve, reject) => {
        if (browseFile.files[2]) {
            let read = new FileReader()
            read.onload = function () {
                imageTray.push(new Image())
                imageTray[2].crossOrigin = "Anonymous";
                imageTray[2].src = read.result;
                resolve(true)
            }
            read.readAsDataURL(browseFile.files[2])
        } else if (browseFile.files.length < 3) {
            resolve(true)
        }

    })


    return Promise.all([loadImage1, loadImage2, loadImage3])




}


function loadImages() {


    const loadImage1 = new Promise((resolve, reject) => {
        imageTray[0].onload = function () {
            resolve(true)
        }
    })


    const loadImage2 = new Promise((resolve, reject) => {
        if (imageTray.length == 2) {
            imageTray[1].onload = function () {
                resolve(true)
            }
        } else {
            resolve(true)
        }

    })

    const loadImage3 = new Promise((resolve, reject) => {
        if (imageTray.length == 3) {
            imageTray[2].onload = function () {
                resolve(true)
            }
        } else {
            resolve(true)
        }

    })

    
    return Promise.all([loadImage1, loadImage2, loadImage3])

}

function loadCTAButton(){
    return new Promise ((resolve, reject) => {
        const grabCTA = new Image()
    grabCTA.src = CTAbtnSource + '/' + ctaDrop.value;
    const ctx = actualImg.getContext('2d')
    grabCTA.onload = function(){
        ctx.drawImage(grabCTA, 0, 0, grabCTA.width, grabCTA.height)
        resolve()
    }
    })
}

function loadCopyText(){
    return new Promise((resolve, reject) => {
        if(copySelect.value == 'select'){
            resolve()
        }else if(copySelect.value == 'BCCI-Courtsey'){
            const ctx = actualImg.getContext('2d')
            const image = new Image();
            image.src = CTAbtnSource + '/' + copySelect.value + '.png';
            image.onload = function(){
                ctx.drawImage(image, 0, 0, image.width, image.height)
                resolve()
            }

        }else{
            const ctx = actualImg.getContext('2d')
            const image = new Image();
            image.src = CTAbtnSource + '/' + copySelect.value + '.png';
            image.onload = function(){
                ctx.drawImage(image, 0, 0, image.width, image.height)
                ctx.font = `${cornerTextDetails.fontWeight} ${cornerTextDetails.fontSize} ${cornerTextDetails.fontName}`;
                ctx.fillStyle = `${cornerTextDetails.fontColor}`;
                ctx.textAlign = `${cornerTextDetails.textAlign}`;
                ctx.fillText(cornerText.value, actualImg.width-25, actualImg.height-25);
                resolve()
            }
        }
    })
}


function scale(stat){

    if(!stat){
        function scaleType(canvas, image){
            imgData = [];
            const ctx = canvas.getContext('2d')
            const scale = scalingType == 'scaleToFill' ? Math.max(canvas.width / image.width, canvas.height / image.height) : Math.min(canvas.width / image.width, canvas.height / image.height);
            const x = (canvas.width / 2) - (image.width / 2) * scale;
            const y = (canvas.height / 2) - (image.height / 2) * scale;
            ctx.drawImage(image, x, y, image.width * scale, image.height * scale)
    
            //Update Image Data
            imgData.push({canvas:canvas, image:image, x:Math.round(x), y: Math.round(y), imgWidth: Math.round(image.width * scale), imgHeight: Math.round(image.height * scale)})
        }   
    
        for(let i = 0; i < imageTray.length; i++){
            if(imageTray.length === 1){
                
                scaleType(actualImg, imageTray[0])
            }
        }
    }else{
        if(imageSelect.value == 'IMG-1'){
            actualImgCTX.drawImage(imageTray[0], imgData[0].x, imgData[0].y, imgData[0].imgWidth, imgData[0].imgHeight)
        }
    }
    
    
}



function checkFileSize(){
    actualImg.toBlob(function(blob) {
        fileSize.innerHTML = `(${(blob.size / actualImg.width).toFixed(2)}kb)`;
    }, "image/jpeg", (Number(qualityRange.value) / 100));
}

function updateInputs(){
    function updates(data){
        xRange.value = (data.x / actualImg.width) * 100 + 100;
        xPointZERO.innerHTML = `${xRange.value-100}%`

        yRange.value = (data.y / actualImg.height) * 100 + 100;
        yPointZERO.innerHTML = `${yRange.value-100}%`

        scaleRange.value = Math.round((data.imgWidth / maxScale)* 100)
        scaleZERO.innerHTML = `${Math.round((data.imgWidth / maxScale)* 100)}%`

        
    }

    checkFileSize()

    if(imageSelect.value == 'IMG-1'){
        updates(imgData[0])
    }
}

function updateCanvas(){
    if(imageTray.length === 0) return
    if(imageSelect.value == 'IMG-1'){
        imgData[0].x = Math.round(((Number(xRange.value) - 100) / 100) * actualImg.width);
        imgData[0].y = Math.round(((Number(yRange.value) - 100) / 100) * actualImg.height);
        const ratio = imgData[0].imgHeight / imgData[0].imgWidth;
        imgData[0].imgWidth = Math.round((Number(scaleRange.value) / 100) * maxScale);
        imgData[0].imgHeight = imgData[0].imgWidth * ratio;
        drawcanvas('update')
    }
}


async function drawcanvas(stat){
    
    actualImgCTX.clearRect(0,0,actualImg.width, actualImg.height);
        scale(stat)
    await loadCopyText()
    await loadCTAButton()
    await loadPreviwImage()
    updateInputs()
}

async function loadPreviwImage(){
    return new Promise((resolve,reject) => {
        previewImg.style.display = 'block'
        const prwCTX = previewImg.getContext('2d');
        prwCTX.clearRect(0,0,previewImg.width, previewImg.height)
        const prwImage = new Image();
        prwImage.crossOrigin = 'anonymous';
        prwImage.src = actualImg.toDataURL().toString();
        prwImage.onload = function(){
            
            prwCTX.drawImage(prwImage, 0,0, previewImg.width, previewImg.height)
            resolve();
        }
        
    })
}


async function loadCanvas() {
    
    imageTray = [] //reset tray
    await imgGenerator()
    await loadImages()
    
    drawcanvas(null)
    
    
    
    
}


function exportImg(quality = 50){
    //CHROME ONLY
        let link = document.createElement("a");
        
        link.download = browseFile.files[0].name.replace('.jpg','');
        
        
        actualImg.toBlob(function(blob) {
        
        link.href = URL.createObjectURL(blob);
        link.click();
        }, "image/jpeg", (quality / 100));


      
}