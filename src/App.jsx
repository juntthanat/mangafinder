import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [searchTitleInput, setSearchTitleInput] = useState();
  const [mangaTitle, setMangaTitle] = useState();
  const [coverImage, setCoverImage] = useState([]);

  const [mangaTitleList, setMangaTitleList] = useState();
  const [mangaCoverList, setMangaCoverList] = useState();
  const [showMangaList, setShowMangeList] = useState();

  const [addingHTML, setAddingHTML] = useState();

  // const title = "Isekai wa Smartphone to Tomo ni";
  const baseUrl = "https://api.mangadex.org";
  const baseUrlCoverImage = "https://uploads.mangadex.org/covers"; //https://uploads.mangadex.org/covers/:manga-id/:cover-filename

  useEffect(() => {
    if (searchTitleInput != undefined) {
      getMangaTitle();
      getMangaCoverImage();
      getMangaList();
    }
  }, [searchTitleInput]);

  const getManga = async () => {
    return await fetch(
      `${baseUrl}/manga?title=${encodeURIComponent(searchTitleInput)}`
    ).then((e) => e.json());
  };
  const getCoverImageFileName = async (coverImageId) => {
    return await fetch(`${baseUrl}/cover/${coverImageId}`).then((e) =>
      e.json()
    );
  };
  const getCoverImage = async (mangaId, coverImageFileName) => {
    return await fetch(`${baseUrlCoverImage}/${mangaId}/${coverImageFileName}`);
  };
  const getMangaCoverImage = async () => {
    const res = await getManga();
    const mangaId = res.data[0].id;
    console.log(res.data[0].relationships);
    const coverImageId = res.data[0].relationships.find(
      (relationship) => relationship.type === "cover_art"
    ).id;
    const coverImageFileName = (await getCoverImageFileName(coverImageId)).data
      .attributes.fileName;
    setCoverImage((await getCoverImage(mangaId, coverImageFileName)).url);
  };
  const getMangaTitle = async () => {
    setMangaTitle(
      (
        await fetch(
          `${baseUrl}/manga?title=${encodeURIComponent(searchTitleInput)}`
        ).then((e) => e.json())
      ).data[0].attributes.title.en
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setSearchTitleInput(event.target.value);
    }
  };

  const getMangaList = async () => {
    const res = await getManga();
    const mangaCoverList = [];
    setMangaTitleList(res);
    console.log(res.data.length);
    // for(let resIndex = 0; resIndex < res.data.length; resIndex++){
    for (let resIndex = 0; resIndex < res.data.length; resIndex++) {
      mangaCoverList.push(
        (
          await getCoverImage(
            res.data[resIndex].id,
            (
              await getCoverImageFileName(
                res.data[resIndex].relationships.find(
                  (relationship) => relationship.type === "cover_art"
                ).id
              )
            ).data.attributes.fileName
          )
        ).url
      );
    }

    setShowMangeList(
      <div>
        <img alt="Manga Cover" className="cover" src={mangaCoverList[0]} />
        <img alt="Manga Cover" className="cover" src={mangaCoverList[1]} />
        <img alt="Manga Cover" className="cover" src={mangaCoverList[2]} />
        <img alt="Manga Cover" className="cover" src={mangaCoverList[3]} />
        <img alt="Manga Cover" className="cover" src={mangaCoverList[4]} />
        <img alt="Manga Cover" className="cover" src={mangaCoverList[5]} />
      </div>
    );
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search Manga"
        onKeyDown={handleKeyDown}
      ></input>
      <div>
        <img alt="Manga Cover" className="cover" src={coverImage} />
        <div>{mangaTitle}</div>
        <div>
          {addingHTML}
          {showMangaList}
        </div>
      </div>
    </>
  );
}

export default App;
