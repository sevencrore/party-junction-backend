const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');



// Function to generate PDF from HTML
const generatePDF = (htmlContent, res ,bookingId) => {
    const options = {
        format: 'A4',
        printBackground: true, // Print background images/styles
        border: '10mm'
    };
    const outputPath = path.join(__dirname, '../../uploads/pdfs', `bill_${bookingId}.pdf`);
    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
        if (err) {
            console.error('Error generating PDF:', err);
            return res.status(500).json({ message: 'Error generating PDF', error: err });
        }
        fs.writeFile(outputPath, buffer, (writeErr) => {
            if (writeErr) {
                console.error('Error saving PDF to local file:', writeErr);
                return res.status(206).json({ message: 'PDF generated but failed to save locally', error: writeErr.message });
            }
            console.log('PDF successfully saved locally at:', outputPath);

        });

        // Set response headers for downloading the PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="bill.pdf"');

        // Send the PDF buffer as response
        res.status(200).send(buffer);
    });
};

module.exports = { generatePDF };
