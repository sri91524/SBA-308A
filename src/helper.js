import {GenerateCard} from "../index.js"

export function BuildHTMLCard(selectedQuote, bFavorite){
    let strCard ="";  
    let favIds = "";

    //If favourites link is clicked, favouritequotes will be displayed
    //favouriteid will be fetched from localstorage
    if(bFavorite){
        favIds = JSON.parse(localStorage.getItem("favQuoteIds"));
    } 

    selectedQuote.forEach(item => {                               
        if(bFavorite){            
            if(favIds.includes(String(item.id))){
                                       
                strCard += `
                    <div class="cardQuote"><p>${item.quote}</p>
                    <hr>
                        <div class="cardAuthor">
                            <p id="author">${item.author}</p>
                            <button class="favBtn" onclick="deleteFavourite('${item.id}')">
                                <img src="images/delete-favorite.png" width="30px">
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
                            <img src="images/add-favorite.png" width="30px">
                        </button>
                    </div>
                </div>
            `;
        }
    });

    return strCard;    
}

//Delete favourite from localstorage

const deleteFavourite = (favQuoteId) => {
    const confirmDelete = window.confirm("Are you sure want to delete the quote?");
    if(confirmDelete)
    {
        let favQIds = JSON.parse(localStorage.getItem("favQuoteIds"))  || [];
        const pos = favQIds.indexOf(favQuoteId);
        if(pos != -1)
        {
            favQIds.splice(pos, 1);
            localStorage.setItem("favQuoteIds",JSON.stringify(favQIds));
            GenerateCard(true);
        }
    }
};

//add favourite to local storge
const addFavourite = (favQuoteId) => {
    try{
        let favQIds = JSON.parse(localStorage.getItem("favQuoteIds"));
        
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
};

//these functions are added in inline html 
//it will not work if script having "type=module"
//it was added globally to windows object
window.addFavourite = addFavourite;
window.deleteFavourite = deleteFavourite;
