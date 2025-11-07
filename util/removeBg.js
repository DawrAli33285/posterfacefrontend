// const REPLICATE_API_TOKEN = 'r8_4xcx7obXMErD7B1eodyXjaKyAs1NCsx3MbuPL';

// export const removeBgFromImage = async (imageDataUrl) => {
//   try {
//     // The API expects a URL, so we need to use the data URL directly
//     // or upload to a temporary hosting service
//     const response = await fetch('https://api.replicate.com/v1/predictions', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
//         'Content-Type': 'application/json',
//         'Prefer': 'wait'
//       },
//       body: JSON.stringify({
//         version: 'fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003',
//         input: {
//           image: imageDataUrl
//         }
//       })
//     });

//     if (!response.ok) {
//       throw new Error(`API request failed: ${response.statusText}`);
//     }

//     const result = await response.json();
    
//     // The output is typically a URL to the processed image
//     if (result.output) {
//       return result.output;
//     } else if (result.status === 'processing') {
//       // If still processing, we need to poll
//       return await pollForResult(result.id);
//     }
    
//     throw new Error('No output received from API');
//   } catch (error) {
//     console.error('Error removing background:', error);
//     throw error;
//   }
// };

// const pollForResult = async (predictionId) => {
//   const maxAttempts = 30;
//   let attempts = 0;
  
//   while (attempts < maxAttempts) {
//     const response = await fetch(
//       `https://api.replicate.com/v1/predictions/${predictionId}`,
//       {
//         headers: {
//           'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
//         }
//       }
//     );
    
//     const prediction = await response.json();
//     console.log("PREDICTION")
//     console.log(prediction.data)
//     if (prediction.status === 'succeeded') {
//       return prediction.output;
//     } else if (prediction.status === 'failed') {
//       throw new Error('Background removal failed');
//     }
    
//     // Wait 1 second before polling again
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     attempts++;
//   }
  
//   throw new Error('Background removal timed out');
// };




const REPLICATE_API_TOKEN = 'r8_4xcx7obXMErD7B1eodyXjaKyAs1NCsx3MbuPL';

export const removeBgFromImage = async (file) => {
  console.log('Starting background removal...');
  
  const formData = new FormData();
  formData.append('image_file', file);
  formData.append('size', 'auto');

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": "Rn1PbjhV5MbZvVahFJ7jfzoh",
    },
    body: formData,
  });

  console.log('Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error(`Failed: ${response.statusText}`);
  }

  // Remove.bg returns the image as a blob
  const blob = await response.blob();
  
  // Convert blob to base64 data URL
  const base64Image = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
  
  console.log('Background removed successfully');
  
  return { output: base64Image };
};
