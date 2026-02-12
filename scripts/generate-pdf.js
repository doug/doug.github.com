
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import handler from 'serve-handler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

async function generatePDF() {
    console.log('Starting PDF generation with Playwright...');

    // 1. Start a local server to serve the built files
    const server = http.createServer((request, response) => {
        return handler(request, response, {
            public: distDir,
            rewrites: [
                { source: '/resume-print', destination: '/resume-print/index.html' }
            ]
        });
    });

    const PORT = 3000;
    
    await new Promise((resolve) => {
        server.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
            resolve();
        });
    });

    try {
        // 2. Launch Playwright
        const browser = await chromium.launch();
        const page = await browser.newPage();

        // 3. Navigate to the print page
        const url = `http://localhost:${PORT}/resume-print`;
        console.log(`Navigating to ${url}...`);
        
        await page.goto(url, { waitUntil: 'networkidle' });

        // 4. Generate PDF
        const pdfPath = path.join(distDir, 'resume.pdf');
        
        await page.pdf({
            path: pdfPath,
            format: 'Letter',
            printBackground: true,
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            }
        });

        console.log(`PDF generated successfully at: ${pdfPath}`);
        
        // Also copy to public so it's available in dev if needed (optional)
        // const publicPath = path.resolve(__dirname, '../public/resume.pdf');
        // fs.copyFileSync(pdfPath, publicPath);

        await browser.close();

    } catch (error) {
        console.error('Error generating PDF:', error);
        process.exit(1);
    } finally {
        server.close();
    }
}

generatePDF();
