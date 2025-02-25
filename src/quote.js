const quotetd = document.getElementById("qtd");

export async function GetQuoteForDay() {
    const todayDate = new Date();
    try{      
        const resp = await fetch("https://random-quotes-freeapi.vercel.app/api/random")
        const quoteToday = await resp.json();
        quotetd.textContent = `"${quoteToday.quote} - ${quoteToday.author}`;
    }
    catch(e){
        console.error(e);
    }
}