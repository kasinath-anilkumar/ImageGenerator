import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_img from '../assets/default_img.jpg';

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState("/");
  const [error, setError] = useState(null);

  let inputRef = useRef(null);

  const generateImage = async () => {
    if (inputRef.current.value === "") {
      setError("Please enter a description.");
      return;
    }

    try {
      const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; // Use Unsplash Access Key

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(inputRef.current.value)}&client_id=${accessKey}`
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data && data.results && data.results[0]?.urls?.regular) {
        setImageUrl(data.results[0].urls.regular); // Set the first image's URL
        setError(null); // Clear any previous errors
      } else {
        setError("No images found for the given description.");
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      setError("An error occurred while fetching the image.");
    }
  };

  return (
    <div className='ai-image-generator'>
      <div className='header text-light'>
      AestheticAI Image <span>Generator</span>
      </div>
      <div className='img-loading'>
        <div className="image">
          <img
            src={imageUrl === "/" ? default_img : imageUrl}
            style={{ width: '350px', height: '350px' }}
            alt="Generated Image"
          />
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
      <div className="search-box">
        <input
          ref={inputRef}
          type="text"
          className='search-input'
          placeholder='Describe the image you want...'
        />
        <div
          className="generate-btn"
          onClick={generateImage}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') generateImage(); }}
        >
          Generate
        </div>
      </div>
    </div>
  );
}

export default ImageGenerator;
