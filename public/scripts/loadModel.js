const MODEL_URL = './models/weights';

window.onload = () => {

    const input = document.getElementById('detectedImage');
    const canvas = document.getElementById('overlay');

  loadModel = async () => {
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
  };

  detectFace = async () => {
    let fullFaceDescriptions;
    await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors().then((facesDetail) => {
      fullFaceDescriptions = facesDetail;
      console.log(facesDetail);

      const displaySize = { width: input.width, height: input.height }
// resize the overlay canvas to the input dimensions
      const canvas = document.getElementById('overlay');
      let a = faceapi.matchDimensions(canvas, displaySize);
      console.log(a);

      const resizedDetections = faceapi.resizeResults(fullFaceDescriptions, displaySize);
// draw detections into the canvas
      faceapi.draw.drawDetections(canvas, resizedDetections);


      // fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions, canvas);
      // faceapi.draw.drawDetections(canvas, fullFaceDescriptions);
      // faceapi.draw.drawFaceLandmarks(canvas, fullFaceDescriptions)
    });

    // faceapi.draw.drawDetections(canvas, fullFaceDescriptions);
    // faceapi.draw.drawLandmarks(canvas, fullFaceDescriptions)
  };

  drawBox = async () => {

  };

  loadModel().then(detectFace);
};
