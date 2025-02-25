import {BuildHTMLCard} from "./src/helper.js";
import {GetQuoteForDay} from "./src/quote.js"

const authorList = document.getElementById("ddlAuthor");
const pQuote = document.getElementById("quote");
const pAuthor = document.getElementById("author");
const qContainer = document.getElementById("quoteContainer");
const linkHome = document.getElementById("lnkhome");
const linkFavourite = document.getElementById("lnkfavorite");
const ddlCont = document.querySelector(".ddlContainer");

let isFavourite = false;

linkHome.addEventListener("click",()=>{showContainer("home")});
linkFavourite.addEventListener("click", () => {showContainer("favorite")});
authorList.addEventListener("change",() => GenerateCard(false))

//ToDo -- Based on Home or Favourite Link clicked, quotes wiil be displayed
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

GetQuoteForDay();

//To populate dropdownlist for authors
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

//ToDo -- to display quotes 
export async function GenerateCard(bFavorite = false){
    try{

        const res = await fetch("https://random-quotes-freeapi.vercel.app/api/quotes");
        const quotes = await res.json();
        let selectedQuote ="";        
        
        if (bFavorite === null  || bFavorite === "") {
            bFavorite = false; // Default to false if null
        }
        
        //Based on author dropdown selection, quotes need to be displayed
        //On initial load or page refresh, all quotes need to be displayed
        if(quotes && quotes.length > 0 ){
            if(authorList.value !== "" && authorList.value !== "select" && !bFavorite){
                let sAuthor = authorList.value;                               
                selectedQuote = quotes.filter(quote => quote.author.replace(/ /g,"").toLowerCase() === sAuthor);                
            }   
            else{
                selectedQuote = quotes;
            }     
            
            //Building all cards for quotes and binding to card container
            qContainer.innerHTML = BuildHTMLCard(selectedQuote, bFavorite);;         
        }
        else
        {
            qContainer.innerHTML== `<p align="center" style="color:red;font-size:18px;">There is no quotes available.</p>`;
        }   
      
    }catch(e){
        console.error(e);
    }
}