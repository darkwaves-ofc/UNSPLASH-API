const axios = require("axios");
const fs = require("fs");

const apiKey = "wECxvTQK_GCjppbMv8DthL6p0eYg5vVR9hAxZd1Ws9U"; // Replace with your API key
const jsonFile = "./zyvlon_products.json"; // Path to your JSON file

async function fetchImages(query) {
  try {
    console.log(`Fetching images for ${query}`);
    // return
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query: query,
        per_page: 5, // Fetch 5 images
      },
      headers: {
        Authorization: `Client-ID ${apiKey}`,
      },
    });

    return response.data.results.map((img) => img.urls.small); // Return array of image URLs
  } catch (error) {
    console.error(`Error fetching images for ${query}:`, error.message);
    return [];
  }
}

async function updateProductImages() {
  try {
    const data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

    for (const category of data) {
      for (const product of category.products) {
        if (product.images.length <= 0) {
          console.log(`Fetching images for product: ${product.name}`);
          const newImages = await fetchImages(product.name);
          if (newImages.length > 0) {
            product.images = newImages; // Update images with fetched URLs
            console.log(`Updated images for ${product.name}`);
          } else {
            console.log(`No images found for ${product.name}`);
          }

          for  (const variant of product.variants) {
            // console.log(variants);
          console.log(`Fetching images for variant: ${variant.name}`);

            const newImages = await fetchImages(product.name + " " + variant.name);
          if (newImages.length > 0) {
            variant.images = newImages; // Update images with fetched URLs
            console.log(`Updated images for ${product.name}`);
          } else {
            console.log(`No images found for ${product.name}`);
          }
          }
        }
      }
    }

    // Save updated JSON back to file
    fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2), "utf8");
    console.log("JSON file updated successfully!");
  } catch (error) {
    console.error("Error updating JSON file:", error.message);
  }
}

updateProductImages();