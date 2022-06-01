import { DialogActions, DialogContent, Slider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Cropper from 'react-easy-crop'
import getCroppedImg from './utils/cropImage'

function CropEasy({ isCover, photoCoverURL, setPhotoCoverURL, handleSubmit, photoURL, setPhotoURL, setFile, setOpenCrop, show: showDialog }) {
  const [show, setShow] = useState(showDialog);
  const handleClose = () => setShow(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)

  const cropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const closeDialog = () => {
    setOpenCrop(false)
    handleClose()
  }

  const cropImage = async () => {
    try {
      if (isCover) {
        const { file, url } = await getCroppedImg(photoCoverURL, croppedAreaPixels, rotation)
        setFile(file)
        handleSubmit()
        setPhotoCoverURL(url)
      } else {
        const { file, url } = await getCroppedImg(photoURL, croppedAreaPixels, rotation)
        setFile(file)
        handleSubmit()
        setPhotoURL(url)
      }

      setOpenCrop(false)
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className={`custom-modal-wrap ${show ? 'show' : ''}`}>
        <div className={`custom-modal-body`}>
          <Cropper
            image={isCover ? photoCoverURL : photoURL}
            zoom={zoom}
            rotation={rotation}
            crop={crop}
            aspect={isCover ? 2 : 1}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropChange={setCrop}
            onCropComplete={cropComplete}
          />
        </div>
        <div className='custom-modal-footer'>
          <Box sx={{ width: "100%", mb: 1 }}>
            <Box>
              <Typography>Zoom: {zoomPercent(zoom)}</Typography>
              <Slider
                valueLabelDisplay='auto'
                valueLabelFormat={zoomPercent}
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e, zoom) => setZoom(zoom)}
              />
            </Box>
            <Box>
              <Typography>Rotation: {rotation}</Typography>
              <Slider
                valueLabelDisplay='auto'
                min={0}
                max={360}
                value={rotation}
                onChange={(e, rotation) => setRotation(rotation)}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant='outline-secondary' onClick={closeDialog}>Cancel</Button>
              <Button variant='primary' onClick={cropImage}>Crop and Save</Button>
            </Box>
          </Box>
        </div>
      </div>
    </>
  )
}

const zoomPercent = (value) => {
  return `${Math.round(value * 100)}%`
}

export default CropEasy