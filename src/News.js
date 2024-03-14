import React, { useState } from 'react';
import './index.css';

const API_KEY = '737b89849df949ec93fca658f8257532';

function News() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [currentKeyword, setCurrentKeyword] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastArticleCount, setLastArticleCount] = useState(0);
    const [news, setNews] = useState([]);

    const fetchNews = (isSearching) => {
        if (isLoading) return;

        setIsLoading(true);
        let url;
        if (isSearching) {
            const keyword = currentKeyword;
            url = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${API_KEY}&page=${currentPage}`;
        } else {
            const category = currentCategory || 'us';
            url = `https://newsapi.org/v2/top-headlines?country=${category}&apiKey=${API_KEY}&page=${currentPage}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (currentPage === 1) {
                    setNews([]);
                }

                const articlesWithImage = data.articles.filter(article => article.urlToImage);

                if (articlesWithImage.length === 0 || articlesWithImage.length === lastArticleCount) {
                    displayNoMoreNews();
                    return;
                }

                setLastArticleCount(articlesWithImage.length);

                setNews(prevNews => [...prevNews, ...articlesWithImage]);

                setCurrentPage(prevPage => prevPage + 1);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the news:", error);
                setIsLoading(false);
            });
    };

    const displayNoMoreNews = () => {
        // Display "No more news to load" message
    };

    const handleInputChange = (event) => {
        setCurrentPage(1);
        setCurrentCategory(null);
        setCurrentKeyword(event.target.value);
    };

    const handleCategoryChange = () => {
        setCurrentPage(1);
        setCurrentKeyword(null);
        fetchNews(false);
    };

    return (
        <div className="container">
            <h1>News</h1>

            <div className="selectionContainer">
                <label htmlFor="category">Choose Category :</label>
                <select id="category" onChange={handleCategoryChange}>
                    <option value="business">Business</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="general">General</option>
                    <option value="health">Health</option>
                    <option value="science">Science</option>
                    <option value="sports">Sports</option>
                    <option value="technology">Technology</option>
                </select>
                <button id="fetchCategory" onClick={handleCategoryChange}>Fetch News</button>
            </div>

            <div className="searchContainer">
                <input type="text" id="searchKeyword" placeholder="Search for news..." onChange={handleInputChange} />
                <button onClick={() => fetchNews(true)}>Search Key</button>
            </div>

            <div id="newsContainer">
                {news.map((article, index) => (
                    <div key={index} className="newsItem">
                        <div className="newsImage">
                            <img src={article.urlToImage} alt={article.title} />
                        </div>
                        <div className="newsContent">
                            <div className="info">
                                <h5>{article.source.name}</h5>
                                <span>|</span>
                                <h5>{article.publishedAt}</h5>
                            </div>
                            <h2>{article.title}</h2>
                            <p>{article.description}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default News;
