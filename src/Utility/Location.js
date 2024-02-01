const GOOGLE_API_KEY = "AIzaSyAnAA0HBfHN8fzBCB-vmvT-oPHX16dkN4E";

export const getCoordsFromAddress = async (address) => {
  const urlAddress = encodeURI(address);
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${GOOGLE_API_KEY}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch coordinates. Please try again!");
  }
  const data = await response.json();
  if (data.error_message) {
    throw new Error(data.error_message);
  }

  const coordinates = data.result[0].geometry.location;
  return coordinates;
};
