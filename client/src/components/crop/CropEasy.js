import { DialogActions, DialogContent, Slider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Cropper from 'react-easy-crop'
import getCroppedImg from './utils/cropImage'

function CropEasy({handleSubmit, photoURL, setPhotoURL, setFile, setOpenCrop, show: showDialog }) {
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
      const {file, url} = await getCroppedImg(photoURL, croppedAreaPixels, rotation)
      setFile(file)
      handleSubmit()
      setPhotoURL(url)
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
            image={photoURL}
            zoom={zoom}
            rotation={rotation}
            crop={crop}
            aspect={1}
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

      {/* <Modal show={show} onHide={handleClose}> */}
      {/* <Modal.Body>
          </Modal.Body> */}
      {/* <Modal.Footer> */}
      {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        */}
      {/* <DialogActions sx={{ flexDirection: "column", mx: 3, my: 2 }}>
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

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap'
                }}
              >
                <Button
                  variant='outlined'
                  onClick={() => setOpenCrop(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  onClick={cropImage}
                >
                  Crop
                </Button>
              </Box>
            </Box>
          </DialogActions> */}
      {/* </Modal.Footer>
        </Modal> */}



      {/* <DialogContent dividers
        sx={{
          background: "#333",
          position: "relative",
          height: 400,
          width: "auto",
          minWidth: { sm: 500 }
        }}
      >
        <Cropper
          image={photoURL}
          zoom={zoom}
          rotation={rotation}
          crop={crop}
          aspect={1}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
        />

      </DialogContent>
      <DialogActions sx={{ flexDirection: "column", mx: 3, my: 2 }}>
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

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <Button
              variant='outlined'
              onClick={() => setOpenCrop(false)}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={cropImage}
            >
              Crop
            </Button>
          </Box>
        </Box>
      </DialogActions> */}
    </>
  )
}

const zoomPercent = (value) => {
  return `${Math.round(value * 100)}%`
}

export default CropEasy