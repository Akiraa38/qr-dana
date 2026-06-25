export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { image, filename } = req.body;
            const base64Data = image.split(',')[1]; 
            const imgurRes = await fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                headers: {
                    Authorization: 'Client-ID 7e7df48074697bf',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: base64Data, type: 'base64' })
            });

            const imgurData = await imgurRes.json();
            
            if (imgurData.success) {
                const ext = filename.split('.').pop();
                const fakeUrl = `/${imgurData.data.id}.${ext}`; 
                
                return res.status(200).json({ url: fakeUrl });
            } else {
                return res.status(500).json({ error: 'Gagal simpan ke cloud storage' });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'GET') {
        const { file } = req.query;
        if (!file) return res.status(404).send('Not Found');

        const imgurId = file.split('.')[0]; 
        try {
            const imageResponse = await fetch(`https://i.imgur.com/${file}`);
            const buffer = await imageResponse.arrayBuffer();
            
            res.setHeader('Content-Type', imageResponse.headers.get('content-type'));
            return res.send(Buffer.from(buffer));
        } catch (e) {
            return res.status(404).send('Gambar ga ketemu');
        }
    }
}
