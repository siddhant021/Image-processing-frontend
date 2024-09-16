import React, { useEffect, useState } from 'react'
import { server } from './constant/config'
import axios from 'axios'
import './style.css'

const App = () => {
  const [selectedValue, setSelectedValue] = useState("png");
  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };
  const [image, setImage] = useState();
  const [preview, setPreview] = useState()
  const [property, setProperty] = useState({
    brightness: "1",
    lightness:"1",
    rotation: "0",
    saturation: "1"
  });

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };


  const handlePreview = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('brightness', property.brightness);
    formData.append('lightness', property.lightness);
    formData.append('rotation', property.rotation);
    formData.append('saturation', property.saturation);

    const response = await axios.post(`${server}/process`, formData, {
      responseType: 'blob',
    });
    const previewBlob = new Blob([response.data], { type: 'image/jpeg' });
    setPreview(URL.createObjectURL(previewBlob));
  }


  const handleChange = async (e) => {
    setProperty({ ...property, [e.target.id]: e.target.value })
  };

  const handleDownload = async() => {
    if (!image) return;
    const format=selectedValue
    const formData = new FormData();
    formData.append('image',image);
    formData.append('brightness', property.brightness);
    formData.append('lightness', property.lightness);
    formData.append('rotation', property.rotation);
    formData.append('saturation', property.saturation);
    formData.append('format', format);

    const response = await axios.post(`${server}/download`, formData, {
      responseType: 'blob',
    });

    const downloadBlob = new Blob([response.data], { type: `image/${format}` });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(downloadBlob);
    link.download = `processed_image.${format}`;
    link.click();
  };

  return (
    <div className='main'>
      <h1>Image Processing</h1>
      <div className='grid'>
        <div className='grid1'>
          <div className='image-choose'>
            <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
          </div>
          {
            image && (
              <img src={preview} className='image-preview' />
            )
          }
        </div>
        <div className='grid2'>
          <div className='box'>
            <div className='text-area'>
              <label>Brightness</label>
              <input type='text' id='brightness' value={property.brightness} onChange={handleChange} />
            </div>
            <input type="range" min="0" max="2" step="0.1" id='brightness' className='slider' value={property.brightness} onChange={handleChange} />
          </div>

          <div className="box">
            <div className='text-area'>
              <label>Lightness</label>
              <input type="text" id='lightness' value={property.lightness} onChange={handleChange} />
            </div>
            <input type="range" min="0" max="100" step="0.1" id='lightness' className='slider' value={property.lightness} onChange={handleChange} />
          </div>

          <div className="box">
            <div className='text-area'>
              <label>Rotation</label>
              <input type="text" id='rotation' value={property.rotation} onChange={handleChange} />
            </div>
            <input type="range" min="0" max="360" id='rotation' className='slider' value={property.rotation} onChange={handleChange} />
          </div>

          <div className="box">
            <div className='text-area'>
              <label>Saturation</label>
              <input type="text" id='saturation' value={property.saturation} onChange={handleChange} />
            </div>
            <input type="range" min="0" max="2" step="0.1" id='saturation' className='slider' value={property.saturation} onChange={handleChange} />
          </div>
          <div className='radioGroup'>
            <div className='radioButton'>
              <input type="radio" checked={selectedValue === "png"} onChange={() => handleRadioChange("png")} />
              <label className='radioLabel'>png</label>
            </div>
            <div className='radioButton'>
              <input type="radio" checked={selectedValue === "jpeg"} onChange={() => handleRadioChange("jpeg")} />
              <label className='radioLabel'>jpeg</label>
            </div>
          </div>
           <div className="btn">
                 <button onClick={handlePreview}>Preview</button>
                 <button onClick={handleDownload}>Download</button> 
                
           </div>
         
        </div>
      </div>
    </div>
  )
}

export default App