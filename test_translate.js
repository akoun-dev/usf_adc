async function test() {
    try {
        const res = await fetch("http://localhost:5000/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: "Bonjour",
                source: "fr",
                target: "ar",
                format: "text"
            })
        });
        const data = await res.json();
        console.log("Result (FR to AR):", data);
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
