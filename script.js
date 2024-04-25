const API_KEY = "2a9ec7c5d6204b80a948eaf6c907c95b";
const url = "https://newsapi.org/v2/"

window.addEventListener("load", () => {
    
    fetchNewsData();
});

async function fetchNewsData(query = null) {
    
    fetchMainHeadline(query);
    fetchRecommendedNews(query);
}

async function fetchMainHeadline(query = null) {
    const mainHeadlineContainer = document.getElementById("main-headline");
    const mainContentContainer = document.getElementById("main-content");
    const mainImageContainer = document.getElementById("main-image");
    const mainSourceContainer = document.getElementById("main-source");

    try {
        let apiUrl = `${url}top-headlines?country=us&apiKey=${API_KEY}`;
        if (query) {
            apiUrl += `&q=${query}`;
        }
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);

        const mainArticle = data.articles[2]; // Assuming you want the first article
        if (!mainArticle) {
            console.error("No main article found.");
            return;
        }
        const dateString = mainArticle.publishedAt;
        const dateObject = new Date(dateString);
        const currentTime = new Date();

        const formattedDate = timeDifference(currentTime, dateObject);
        console.log(formattedDate);

          mainHeadlineContainer.innerText = mainArticle.title;
          mainContentContainer.innerText = mainArticle.description;
          mainImageContainer.src = mainArticle.urlToImage;
          mainSourceContainer.innerText = `${mainArticle.source.name} - ${formattedDate}`;
      } catch (error) {
          console.error("Error fetching main headline article:", error);
      }
  }

  async function fetchRecommendedNews(query = null) {
    const cardsContainer = document.getElementById("cards-container");

    try {
        let apiUrl = `${url}top-headlines?country=us&apiKey=${API_KEY}`;
        if (query) {
            apiUrl += `&q=${query}`;
        }
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.articles) {
            const newsCardTemplate = document.getElementById("template-news-card");

            cardsContainer.innerHTML = "";

            data.articles.slice(3).forEach((article) => {
                if (!article.urlToImage) return;
                const cardClone = newsCardTemplate.content.cloneNode(true);
                fillDataInCard(cardClone, article);
                cardsContainer.appendChild(cardClone);
            });
        }
    } catch (error) {
        console.error("Error fetching recommended news articles:", error);
    }
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    // const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    // newsDesc.innerHTML = article.description;

    const publishedAt = new Date(article.publishedAt)
    const currentTime = new Date()

    // const formattedDate = dateObject.toLocaleString("en-US", options);

    const formattedDate = timeDifference(currentTime,publishedAt)
    console.log(formattedDate);

    newsSource.innerHTML = `${article.source.name} • ${formattedDate}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNewsData(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    console.log(query);
    if (!query) return;
    fetchNewsData(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
