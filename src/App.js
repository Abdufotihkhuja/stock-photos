import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchImages = async () => {
        setLoading(true);
        let url;
        const urlPage = `&page=${page}`;
        const urlSearch = `&query=${search}`;

        if (search) {
            url = `${searchUrl}${clientID}${urlPage}${urlSearch}`;
        } else {
            url = `${mainUrl}${clientID}${urlPage}`;
        }

        try {
            const res = await fetch(url);
            const data = await res.json();

            setPhotos((oldPhotos) => {
                if (search && page === 1) {
                    return data.results;
                }
                if (search) {
                    return [...oldPhotos, ...data.results];
                } else {
                    return [...oldPhotos, ...data];
                }
            });

            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log("Error", e);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchImages();
    };

    useEffect(() => {
        fetchImages();
        // eslint-disable-next-line
    }, [page]);

    useEffect(() => {
        const event = window.addEventListener("scroll", () => {
            // console.log(`innerHeight ${window.innerHeight}`);
            // console.log(`scroll y  ${window.scrollY}`);
            // console.log(`body height ${document.body.scrollHeight}`);

            if (
                !loading &&
                window.innerHeight + window.scrollY >=
                    document.body.scrollHeight - 3
            ) {

                setPage((oldValue) => {
                    return oldValue + 1;
                });
            }
        });

        return () => window.removeEventListener("scroll", event);
        // eslint-disable-next-line
    }, []);

    return (
        <main>
            <section className="search">
                <form className="search-form">
                    <input
                        type="text"
                        placeholder="Search"
                        className="form-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="submit-btn" onClick={handleSubmit}>
                        <FaSearch />
                    </button>
                </form>
            </section>
            <section className="photos">
                <div className="photos-center">
                    {photos.map((image) => {
                        return <Photo key={image.id} {...image} />;
                    })}
                </div>
                {loading && <h2 className="loading">Loading...</h2>}
            </section>
        </main>
    );
}

export default App;
