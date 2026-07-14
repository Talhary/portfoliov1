const fs = require('fs');
const path = require('path');

async function downloadInstagramMedia(videoUrl) {
  try {
    const res = await fetch("https://services.ufone-claim.site/api/media/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: videoUrl })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Download failed (${res.status}): ${errText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `instagram_${Date.now()}.mp4`;
    const filePath = path.join(__dirname, fileName);
    
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved file to ${filePath}`);
    return filePath;
  } catch (err) {
    console.error(err);
  }
}

downloadInstagramMedia("https://www.instagram.com/reels/Davcp52BJZN/").then(res => console.log(res))