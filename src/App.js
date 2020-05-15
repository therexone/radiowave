import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player'
import './App.css';
import { config } from '../config';

function App() {

  const [src, setSrc] = useState('./static/1.gif')
  const [urls, setUrls] = useState([])

  const urlsRef = useRef();
  urlsRef.current = urls;

  useEffect(() => {
    if (urlsRef.current.length === 0) {
      const getGifSrc = async () => {
        let response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${config.API_KEY}&q=synthwave&limit=50&offset=0&rating=G&lang=en`)
        let data = await response.json()
        let srcList = data.data
        let urls = srcList.map((src) => src.images.original.url)
        console.log('api call')
        return urls
      }
      getGifSrc().then((urls) => {
        console.log(urls);
        setUrls(urls)
        localStorage.setItem('urls', JSON.stringify(urls))
      });
    }
  }, [])

  useEffect(() => {
    const urls = JSON.parse(localStorage.getItem('urls'))
    if (urls) {
      setUrls(urls)
    }
  }, [])


  useEffect(() => {
    setInterval(() => {
      let randInt = Math.ceil(Math.random() * 50)
      setSrc(urlsRef.current[randInt])
      console.log(urlsRef.current[randInt])
    }
      , 120000);
  }, [])

  return (
    <div className="gif" style={{ backgroundImage: `url(${src})` }}>
      <div className="title">
        <h1>【ｒａｄｉｏｗａｖｅ】</h1>
        <ReactPlayer controls={true} id="player" playing url='http://air.radiorecord.ru:805/synth_320' height="40px" width="100%"/>

      </div>
    </div>
  );
}

export default App;
