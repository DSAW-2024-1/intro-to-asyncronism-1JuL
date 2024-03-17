const quoteContainer = document.getElementById("quoteContainer");
const loadMoreButton = document.getElementById("loadMoreButton");
const randomQuoteButton = document.getElementById("randomQuoteButton");
const characterInput = document.getElementById("characterInput");
const numQuotesInput = document.getElementById("numQuotesInput");
let charactersLoaded = [];

/* These functions are used to fetch a random quote from the API */
randomQuoteButton.addEventListener("click", () => {
  charactersLoaded = [];
  quoteContainer.innerHTML = "";
  characterInput.value = "";
  loadMoreButton.style.display = "flex";
  fetchQuote();
});

// This function fetches a single random quote
async function fetchQuote() {
  try {
    const data = await fetch("https://thesimpsonsquoteapi.glitch.me/quotes");
    const quote = await data.json();
    const currentCharacter = quote[quote.length - 1].character;
    if (!charactersLoaded.includes(currentCharacter)) {
      charactersLoaded.push(currentCharacter);
    }
    displayQuotes(quote);
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
}

/* These functions are used to get 4 initial quotes from the API. Clicking the "load more" button will load 4 more quotes from different characters.
   until a quote from all the 23 different characters is displayed */

let isLoading = false;

loadMoreButton.addEventListener("click", () => {
  if (!isLoading) {
    isLoading = true;
    fetchMoreCharacters();
    setTimeout(() => {
      isLoading = false;
    }, 5000);
  }
});

async function fetchMoreCharacters() {
  try {
    const remainingCharacters = [
      "Abe Simpson",
      "Apu Nahasapeemapetilon",
      "Bart Simpson",
      "Chief Wiggum",
      "Comic Book Guy",
      "Dr. Nick",
      "Duffman",
      "Frank Grimes",
      "Groundskeeper Willie",
      "Homer Simpson",
      "Lisa Simpson",
      "Marge Simpson",
      "Mayor Quimby",
      "Milhouse Van Houten",
      "Moe Szyslak",
      "Mr. Burns",
      "Nelson Muntz",
      "Otto",
      "Principal Skinner",
      "Rainier Wolfcastle",
      "Ralph Wiggum",
      "Troy McClure",
      "Waylon Smithers",
    ].filter((character) => !charactersLoaded.includes(character));

    if (remainingCharacters.length === 0) {
      loadMoreButton.style.display = "none"; // Hide the button if all characters are loaded
      return;
    }

    const randomCharacters = getRandomCharacters(remainingCharacters, 4);

    await fetchQuotes(randomCharacters);
    charactersLoaded = charactersLoaded.concat(randomCharacters);
    console.log(randomCharacters);
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

function getRandomCharacters(array, n) {
  const result = new Array(n);
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * array.length);
    result[i] = array[randomIndex];
    array.splice(randomIndex, 1);
  }
  return result;
}

// This function fetches a single quote from each character
async function fetchQuotes(characters) {
  try {
    for (const character of characters) {
      const url = `https://thesimpsonsquoteapi.glitch.me/quotes?count=1&character=${character}`;
      const data = await fetch(url);
      const quotes = await data.json();
      displayQuotes(quotes);
    }
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

/* These functions fetch an specified amount of quotes by the name of the character written on the input text field and the quantity written on the input field */

characterInput.addEventListener("input", () => {
  const characterName = characterInput.value.trim();
  const numQuotes = numQuotesInput.value;
  if (characterName || (numQuotes && characterInput.value)) {
    charactersLoaded = [];
    fetchQuotesByCharachterAndQtty(characterName, numQuotes);
  } else {
    quoteContainer.innerHTML = "Por favor escriba el nombre de un personaje !!";
    quoteContainer.style.fontSize = "24px";
    quoteContainer.style.textAlign = "center";
  }
});

numQuotesInput.addEventListener("input", () => {
  const characterName = characterInput.value.trim();
  const numQuotes = numQuotesInput.value;
  if (characterName || (numQuotes && characterInput.value)) {
    charactersLoaded = [];
    fetchQuotesByCharachterAndQtty(characterName, numQuotes);
  } else {
    quoteContainer.innerHTML = "Por favor escriba el nombre de un personaje !!";
    quoteContainer.style.fontSize = "24px";
    quoteContainer.style.textAlign = "center";
  }
});

async function fetchQuotesByCharachterAndQtty(characterName, numQuotes = null) {
  try {
    let url = "https://thesimpsonsquoteapi.glitch.me/quotes";
    if (characterName) {
      url += `?character=${characterName}`;
    }
    if (numQuotes) {
      url += `&count=${numQuotes}`;
    }
    const data = await fetch(url);
    const quotes = await data.json();

    if (quotes.length === 0) {
      quoteContainer.innerHTML = "No characters found with that name.";
    } else {
      quoteContainer.innerHTML = "";
      quotes.forEach((quote) => {
        displayQuotes([quote]);
      });
    }
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

// This function is used to display each quote that is obtained from the API and is used by all other functions that fetch a quote.

function displayQuotes(quotes) {
  quotes.forEach((quote) => {
    const quoteElement = document.createElement("div");
    quoteElement.classList.add("cube-container");
    const imageElement = document.createElement("img");
    imageElement.src = quote.image;
    imageElement.alt = quote.character;
    imageElement.title = quote.character;
    const quoteTextElement = document.createElement("p");
    quoteTextElement.textContent = `"${quote.quote}" - ${quote.character}`;
    quoteElement.appendChild(imageElement);
    quoteElement.appendChild(quoteTextElement);
    quoteContainer.appendChild(quoteElement);
    console.log(charactersLoaded);
  });
}

// Functions to show the loader and hide it after 5 seconds, this is done to give time for the web application to fetch 4 innital quotes to display

function loader() {
  setTimeout(showPage, 5000);
  document.body.style.background =
    "linear-gradient(to right, #f9ebb2, #ffd8a8, #ffc4a0)";
}

function showPage() {
  document.getElementById("load-animation").style.display = "none";
  document.getElementById("loaded-page").style.display = "block";
  document.getElementById("loader-container").style.display = "none";
  document.body.style.background = "linear-gradient(to left, #ffe259, #ffa751)";
}
