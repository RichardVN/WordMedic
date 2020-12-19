

let checkSpelling = () => {
    let wordsContainer = document.getElementById('suggested-words')
    console.log('checking spelling ... ');
    let wordNode = createSuggestion('new word');
    wordsContainer.appendChild(wordNode)
}

let createSuggestion = (word) => {
    console.log('making word node for ', word)
    let colDiv = document.createElement('div');
    colDiv.setAttribute('class', 'word col-md-6');

    let wordDiv = document.createElement('div');
    wordDiv.setAttribute('class', 'p-3 border bg-light');
    wordDiv.textContent = word;

    colDiv.appendChild(wordDiv);

    return colDiv;

}

let deleteSuggestions = () => {
    console.log('deleting suggestions ...')
    let wordsContainer = document.getElementById('suggested-words');
    let words = wordsContainer.querySelectorAll('.word');
    let wordsArr = Array.from(words);
    for (let word of wordsArr){
        word.remove();
    }
    
    console.log(words);
}