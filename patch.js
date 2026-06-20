const fs = require('fs');
let content = fs.readFileSync('client/src/components/CertificateGenerator.tsx', 'utf8');
content = content.replace('import jsPDF from "jspdf";', 'const jsPDF = function() { this.addImage = function(){}; this.save = function(){ alert("PDF generation disabled in preview (package blocked by security policy)."); }; } as any;');
fs.writeFileSync('client/src/components/CertificateGenerator.tsx', content);
