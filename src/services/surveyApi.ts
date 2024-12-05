export const saveSurveyProgress = async (responses: any) => {
  console.log('Saving survey responses:', responses);
  
  // Simulating an API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};