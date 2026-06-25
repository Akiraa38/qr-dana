// GANTI PAKE DATA AKUN GITHUB LO, BRE!
const REPO_OWNER = "Akiraa38";          
const REPO_NAME = "qr-dana";              
const BRANCH = "main"; // Isikan 'main' atau 'master' sesuai setingan repo lo

export default async function handler(req, res) {
    // Pastikan ini request GET (orang mau liat gambar)
    if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');

    const { file } = req.query;
    if (!file) return res.status(404).send('Nama file foto kosong, Bre!');

    try {
        // Alamat URL mentah foto lo di folder 'image' repository GitHub
        const rawGithubUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/image/${file}`;
        
        // Tarik fotonya dari GitHub
        const imageResponse = await fetch(rawGithubUrl);
        
        // Kalau nama foto salah atau ga ada di folder GitHub, kasih eror 404
        if (!imageResponse.ok) return res.status(404).send('Gambar ga ketemu di folder GitHub, Bre!');

        const buffer = await imageResponse.arrayBuffer();
        
        // Kasih tahu browser kalau ini file gambar asli (.jpg/.png)
        res.setHeader('Content-Type', imageResponse.headers.get('content-type'));
        
        // Tampilkan gambarnya murni!
        return res.send(Buffer.from(buffer));
    } catch (e) {
        return res.status(500).send('Ada masalah pas nyambung ke server GitHub');
    }
}
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
