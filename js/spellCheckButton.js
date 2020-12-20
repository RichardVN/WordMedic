// load dictionary into js var
let js_dict;
let wordCount = 100;




fetch("./dictionary.json")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        js_dict = data;
        console.log("Dictionary successfully loaded!");
    });

let buttonPress = () => {
    let button = document.getElementById('spell-button');
    button.disabled = true;
    // console.log("Button pressed!");
    checkSpelling();

    button.disabled = false;

};

let checkSpelling = () => {
    // console.log("checking spelling ... ");
    let wordNode = document.getElementById("word");
    let word = wordNode.value;
    word = word.toLowerCase().trim();
    if (word == "") {
        wordNode.classList.add('is-invalid');
        return;
    }
    wordNode.classList.remove('is-invalid');
    // word is nonempty reset suggestions
    window.location.href = "#suggestion-card"
    deleteSuggestions();
    document.getElementById("suggestion-card").hidden = false;
    if (js_dict.hasOwnProperty(word)) {
        document.getElementById("correct-message").hidden = false;
        document.getElementById("incorrect-message").hidden = true;
        document.getElementById("suggested-words").hidden = true;
    } else {
        document.getElementById("correct-message").hidden = true;
        document.getElementById("incorrect-message").hidden = false;
        document.getElementById("suggested-words").hidden = false;

        // get suggestions for incorrect word
        getSuggestionList(word);
    }
};

// calculate levenshtein distance (minimum edit distance) between two strings
let levenshteinDistance = (a, b) => {
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    let matrix = [];

    // increment along the first column of each row
    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1
                    )
                ); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
};

// return a list of suggested words
let getSuggestionList = (userWord) => {
    let suggestedWords = [];
    let suggestedDistances = [];
    wordCount = document.getElementById('num-suggestions').value;
    for(let word in js_dict){
        if (word.length - userWord.length <= 1 && userWord.length - word.length <= 1) {
            let wordDistance = levenshteinDistance(userWord, word);
            // 5 suggested words
            if (suggestedDistances.length < wordCount) {
                suggestedDistances.push(wordDistance);
                suggestedWords.push(word);
            }else{
                
                for (let i = 0; i < wordCount; i++) {
                    if (wordDistance < suggestedDistances[i]) {
                        suggestedDistances[i] = wordDistance;
                        suggestedWords[i] = word;
                        break;
                    }
                    
                }
            }
            
        }
    }
    // append suggested word nodes
    for(suggestedWord of suggestedWords){
        appendWord(suggestedWord);
    }
}

// append word HTML element to suggestion container
let appendWord = (word) => {
    let wordsContainer = document.getElementById("suggested-words");

    let wordNode = createSuggestion(word);
    wordsContainer.appendChild(wordNode);
};

// create a word HTML element
let createSuggestion = (word) => {
    let colDiv = document.createElement("div");
    colDiv.setAttribute("class", "word col-md-6");

    let wordDiv = document.createElement("div");
    wordDiv.setAttribute("class", "p-3 border bg-light");
    wordDiv.textContent = word;

    colDiv.appendChild(wordDiv);

    return colDiv;
};

// delete suggested word nodes
let deleteSuggestions = () => {
    // console.log("deleting suggestions ...");
    let wordsContainer = document.getElementById("suggested-words");
    let words = wordsContainer.querySelectorAll(".word");
    let wordsArr = Array.from(words);
    for (let word of wordsArr) {
        word.remove();
    }
};

document.getElementById('word').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        buttonPress();
    }
});
document.getElementById('spell-button').addEventListener('click', buttonPress)