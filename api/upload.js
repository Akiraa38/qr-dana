const GITHUB_TOKEN = process.env.GH_TOKEN; 
const REPO_OWNER = "Akiraa38";          
const REPO_NAME = "qr-dana";              

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(455).send('Method Not Allowed');
    try {
        const { image, filename } = req.body;
        if (!image) return res.status(400).json({ error: 'Gambar kosong' });

        const base64Data = image.split(',')[1];
        const ext = filename.split('.').pop();
        const uniqueName = `img_${Date.now()}.${ext}`;

        const githubUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/image/${uniqueName}`;
        
        const response = await fetch(githubUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Web-Uploader'
            },
            body: JSON.stringify({ message: `Upload web ${uniqueName}`, content: base64Data, branch: "main" })
        });

        if (response.ok) return res.status(200).json({ url: `/image/${uniqueName}` });
        const errData = await response.json();
        return res.status(500).json({ error: errData.message });
    } catch (e) { return res.status(500).json({ error: e.message }); }
}
