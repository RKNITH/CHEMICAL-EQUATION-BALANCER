import {pthh} from './service/pthh.js';

document.addEventListener('DOMContentLoaded', function() {
    const inputString = document.getElementById('inputString');
    const outputPthh = document.getElementById('outputPthh');
    const outpoutElement = document.getElementById('element');


    inputString.addEventListener('keyup', handleInputEvent);
    inputString.addEventListener('mouseup', handleInputEvent);
    inputString.addEventListener('change', handleInputEvent);

    //get storage
    chrome.storage.sync.get(['selectionText'], function(result) {
      if (result['selectionText'])
        inputString.value = result['selectionText'];
      handleInputEvent();
    })


    function handleInputEvent(event) {
      let inputValue = inputString.value;
      const result = pthh(inputValue)
      const resultText = result['text'];
      const resultSuccess = result['success'];
      outputPthh.textContent = resultText;
      if (resultSuccess) {
        outputPthh.style.color = 'green';
        // An luu y
        var noteDiv = document.getElementById("noteDiv");
        noteDiv.classList.add("hidden");
        chrome.storage.sync.set({'selectionText': inputValue})
      } else {
        outputPthh.style.color = 'red';
        var noteDiv = document.getElementById("noteDiv");
        //Hien luu y
        noteDiv.classList.remove("hidden");
      }

      outpoutElement.innerHTML = '';
      let table = document.createElement('table');

      if (resultSuccess) {
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        th.textContent = 'Element';
        tr.appendChild(th);
        let th2 = document.createElement('th');
        th2.textContent = 'Quantity';
        tr.appendChild(th2);
        table.appendChild(tr);

        for (let el in result['element']) {
          let tr = document.createElement('tr');
          let td = document.createElement('td');
          td.textContent = el;
          tr.appendChild(td);
          let td2 = document.createElement('td');
          td2.textContent = result['element'][el];
          tr.appendChild(td2);
          table.appendChild(tr);
        }
      }

      outpoutElement.appendChild(table);


      // Chu cang nhieu thi cang nho
      let newSize = 17 * 30 / inputValue.length;
      newSize = (newSize > 30) ? 30 : newSize;
      newSize = (newSize < 10) ? 10 : newSize;
      inputString.style.fontSize = newSize + 'px';
    }
});