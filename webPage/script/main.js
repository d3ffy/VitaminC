function createVegCard(vegName, lastCheck, checkFrequency, imgUrl){

    var vegCardDiv = document.createElement('div');
    vegCardDiv.className = 'veg-card';

    var imgElement = document.createElement('img');
    imgElement.src = imgUrl;
    imgElement.alt = '';

    var vegCardContentDiv = document.createElement('div');
    vegCardContentDiv.className = 'veg-card-content';

    var nameDiv = document.createElement('div');
    nameDiv.textContent = vegName;

    var lastCheckDiv = document.createElement('div')
    lastCheckDiv.textContent = 'ตรวจสอบล่าสุด: ' + lastCheck;

    var frequencyDiv = document.createElement('div')
    frequencyDiv.textContent = 'every ' + checkFrequency + ' day';

    var cardContainer = document.querySelector('.card-container');
    cardContainer.appendChild(vegCardDiv);

    vegCardDiv.appendChild(imgElement);
    vegCardDiv.appendChild(vegCardContentDiv);

    vegCardContentDiv.appendChild(nameDiv);
    vegCardContentDiv.appendChild(lastCheckDiv);
    vegCardContentDiv.appendChild(frequencyDiv);

}
//createVegCard('กวางตุ้ง', '2024-01-24', '3', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ673V92kDN4gI8c1INUMAHZAYwBYoxp4zPgQ&usqp=CAU');


var dataEntryForm = document.getElementById('dataEntryForm');
var AddCardBtn = document.getElementById('add-card-bottom');

AddCardBtn.addEventListener('click', function() {
    dataEntryForm.classList.toggle('hide');
});

// ตรวจสอบว่าคลิกนอก dataEntryForm หรือไม่
document.addEventListener('click', function(event) {
    if (!dataEntryForm.contains(event.target) && !AddCardBtn.contains(event.target)) {
        dataEntryForm.classList.add('hide');
    }
});



