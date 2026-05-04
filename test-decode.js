const fs = require('fs');

function testDecode() {
    const content = fs.readFileSync('supabase/seed.sql', 'utf8');
    const snippet = content.substring(content.indexOf('RÃƒÂ©publique'), content.indexOf('RÃƒÂ©publique') + 100);
    console.log("Original:", snippet);

    try {
        const decoded1 = Buffer.from(snippet, 'utf8').toString('binary');
        const decoded2 = Buffer.from(decoded1, 'utf8').toString('binary');
        console.log("Decoded 2 levels (binary):", decoded2);
    } catch(e) { console.log(e); }

    try {
        const decoded1 = Buffer.from(snippet, 'utf8').toString('latin1');
        const decoded2 = Buffer.from(decoded1, 'utf8').toString('latin1');
        console.log("Decoded 2 levels (latin1):", decoded2);
    } catch(e) { console.log(e); }
    
    // What if it's just 1 level of corruption? (UTF-8 bytes read as Windows-1252, then saved as UTF-8)
    // Then the file has UTF-8 encoding of (Windows-1252 decoding of (UTF-8 of (text))).
    // Let's reverse:
    try {
        // Let's use an external library like iconv-lite if necessary, or just replace.
    } catch(e) {}
}

testDecode();
