/**
 * Utility functions for handling 3D models
 */

/**
 * Checks if a file is a valid GLB model
 * @param {File} file - The file to check
 * @returns {boolean} - Whether the file is a valid GLB model
 */
export const isValidGlbFile = (file) => {
  return file && file.name.toLowerCase().endsWith('.glb');
};

/**
 * Creates a download link for a GLB model
 * @param {string} url - The URL of the model
 * @param {string} filename - The filename to save as
 */
export const downloadModel = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.glb') ? filename : `${filename}.glb`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Calculates the size of a 3D model
 * @param {Object} model - The 3D model object from Three.js
 * @returns {Object} - The dimensions of the model (width, height, depth)
 */
export const calculateModelSize = (model) => {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  
  return {
    width: size.x,
    height: size.y,
    depth: size.z
  };
};

/**
 * Centers a model at the origin
 * @param {Object} model - The 3D model object from Three.js
 */
export const centerModel = (model) => {
  const box = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();
  box.getCenter(center);
  
  model.position.sub(center);
};

/**
 * Converts a base64 string to a Blob
 * @param {string} base64 - The base64 string
 * @param {string} contentType - The content type of the blob
 * @returns {Blob} - The resulting blob
 */
export const base64ToBlob = (base64, contentType = '') => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}; 