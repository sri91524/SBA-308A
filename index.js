
const quotetd = document.getElementById("qtd");
const authorList = document.getElementById("ddlAuthor");
const pQuote = document.getElementById("quote");
const pAuthor = document.getElementById("author");
const qContainer = document.getElementById("quoteContainer");
const linkHome = document.getElementById("lnkhome");
const linkFavourite = document.getElementById("lnkfavorite");
const ddlCont = document.querySelector(".ddlContainer");
console.log(ddlCont);
let isFavourite = false;

linkHome.addEventListener("click",()=>{showContainer("home")});
linkFavourite.addEventListener("click", () => {showContainer("favorite")});
authorList.addEventListener("change",() => GenerateCard(false))

showContainer("home");

function showContainer(containter){
    if(containter === "home"){
        ddlCont.style.display = "block";
        qContainer.innerHTML = ""; 
        isFavourite = false;
        GetQuoteForDay();
        initialLoad();
        GenerateCard(isFavourite);
    }
    else{
        ddlCont.style.display = "none";
        qContainer.innerHTML = "";  
        isFavourite = true;
        GetQuoteForDay();
        GenerateCard(isFavourite);
    }
}


async function GetQuoteForDay() {
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

async function initialLoad(){
    try{        
        const res = await fetch("https://random-quotes-freeapi.vercel.app/api/quotes");
        const quotes = await res.json();
        
        const authors = new Set(quotes.map(quote => quote.author));     
        const distinctAuthors = [...authors].sort();
      
        authorList.innerHTML ="";

        let option = document.createElement('option');
        option.value = "select";
        option.text = " Select Author"; 
        authorList.appendChild(option); 
        
        //fetching qote details and populating dropdown
        distinctAuthors.forEach(author => { 
            let strAuthor = author;          
            option = document.createElement('option');

            //remove space n make it lower
            option.value = strAuthor.replace(/ /g, "").toLowerCase();
            option.text = strAuthor; 
            authorList.appendChild(option); 
        });         
    }
    catch(e){
            console.error(e);
    }
}

async function GenerateCard(bFavorite = false){
    try{

        const res = await fetch("https://random-quotes-freeapi.vercel.app/api/quotes");
        const quotes = await res.json();
        let selectedQuote ="";
        let favIds = "";
        
        if (bFavorite === null  || bFavorite === "") {
            bFavorite = false; // Default to false if null
        }        
            console.log(bFavorite);
            
        if(quotes && quotes.length > 0){
            if(authorList.value !== "" && authorList.value !== "select"){
                let sAuthor = String(authorList.value);                               
                selectedQuote = quotes.filter(quote => quote.author.replace(/ /g,"").toLowerCase() === sAuthor);                
            }   
            else{
                selectedQuote = quotes;
            }     

            if(bFavorite){
                favIds = JSON.parse(localStorage.getItem("favQuoteIds"));
            }
            console.log(favIds);
    
            let strCard ="";            
            selectedQuote.forEach(item => {                               
                if(bFavorite){
                
                    if(favIds.includes(String(item.id))){
                        console.log(favIds);
                        strCard += `
                            <div class="cardQuote"><p>${item.quote}</p>
                            <hr>
                                <div class="cardAuthor">
                                    <p id="author">${item.author}</p>
                                    <button class="favBtn" onclick="deleteFavourite('${item.id}')">
                                        <img src="images/delete-favorite.png" width="20px">
                                    </button>
                                </div>
                            </div>
                        `;
                    }
                }
                else{
                    strCard += `
                        <div class="cardQuote"><p>${item.quote}</p>
                        <hr>
                            <div class="cardAuthor">
                                <p id="author">${item.author}</p>
                                <button class="favBtn" onclick="addFavourite('${item.id}')">
                                    <img src="images/add-favorite.png" width="20px">
                                </button>
                            </div>
                        </div>
                    `;
                }
            });
            
            qContainer.innerHTML=strCard;
        }
        else
        {
            qContainer.innerHTML== `<p align="center" style="color:red;font-size:18px;">There is no quotes available.</p>`;
        }   
      
    }catch(e){
        console.error(e);
    }
}

function deleteFavourite(favQuoteId){
    let favQIds = JSON.parse(localStorage.getItem("favQuoteIds"))  || [];
    const pos = favQIds.indexOf(favQuoteId);
    if(pos != -1)
    {
        favQIds.splice(pos, 1);
        localStorage.setItem("favQuoteIds",JSON.stringify(favQIds));
        GenerateCard(true);
    }
}

function addFavourite(favQuoteId){

    try{
        let favQIds = JSON.parse(localStorage.getItem("favQuoteIds"));
        console.log(favQIds);
        if(!favQIds)
        {
            favQIds = [];
        }

        if(!favQIds.includes(favQuoteId))
        {
            favQIds.push(favQuoteId);
        }
      
        localStorage.setItem("favQuoteIds",JSON.stringify(favQIds));
        window.alert("Quote has been successfully added to favourite list!!")  
    }
    catch(e){
        console.error(e);
    }
     
    
}