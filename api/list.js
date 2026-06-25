// GANTI PAKE DATA AKUN GITHUB LO, BRE!
const REPO_OWNER = "Akiraa38";          
const REPO_NAME = "qr-dana";              

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');

    try {
        // Panggil API publik GitHub buat ngelist isi folder 'image'
        const githubApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/image`;
        
        const response = await fetch(githubApiUrl, {
            headers: { 'User-Agent': 'Vercel-Gallery-List' }
        });

        if (!response.ok) return res.status(200).json([]); // kembalikan array kosong jika folder ga ada

        const data = await response.json();
        
        // Kirim data list filenya ke frontend
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
