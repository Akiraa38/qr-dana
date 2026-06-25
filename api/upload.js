// GANTI PAKE DATA AKUN GITHUB LO SEBELUM DI-PUSH, BRE!
const GITHUB_TOKEN = "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"; 
const REPO_OWNER = "Akiraa38";          
const REPO_NAME = "nikaa";              
const BRANCH = "main"; // Isikan 'main' atau 'master' sesuai setingan repo lo

export default async function handler(req, res) {
    // 1. PROSES UPLOAD FILE (POST)
    if (req.method === 'POST') {
        try {
            const { image, filename } = req.body;
            if (!image) return res.status(400).json({ error: 'Data gambar kosong!' });

            const base64Data = image.split(',')[1]; // Potong header base64-nya
            const ext = filename.split('.').pop();
            
            // Bikin nama file acak unik pake timestamp biar ga duplikat di repo
            const uniqueName = `img_${Date.now()}.${ext}`;

            // URL API GitHub untuk membuat file di dalam folder 'uploads/'
            const githubUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/uploads/${uniqueName}`;
            
            const response = await fetch(githubUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Vercel-GitHub-Uploader'
                },
                body: JSON.stringify({
                    message: `Upload otomatis ${uniqueName} via Website`,
                    content: base64Data,
                    branch: BRANCH
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Kembalikan nama filenya (Nanti diredirect oleh vercel.json)
                return res.status(200).json({ url: `/${uniqueName}` });
            } else {
                return res.status(500).json({ error: data.message || 'Gagal mengirim file ke GitHub' });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 2. PROSES MEMBUKA & MENAMPILKAN GAMBAR (GET)
    if (req.method === 'GET') {
        const { file } = req.query;
        if (!file) return res.status(404).send('Not Found');

        try {
            // Ambil file mentah (raw) dari folder uploads di repo GitHub lo
            const rawGithubUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/uploads/${file}`;
            const imageResponse = await fetch(rawGithubUrl);
            
            if (!imageResponse.ok) return res.status(404).send('Gambar ga ada di GitHub, Bre!');

            const buffer = await imageResponse.arrayBuffer();
            
            // Atur Content-Type di browser biar langsung nampil murni sebagai gambar
            res.setHeader('Content-Type', imageResponse.headers.get('content-type'));
            return res.send(Buffer.from(buffer));
        } catch (e) {
            return res.status(500).send('Eror pas ngelewatin server');
        }
    }
}
