// EDIT PRODUCTS & PRICES HERE. Prices are EXAMPLE placeholders in Naira.
// [name, category, colour, priceNaira, photo in assets/ (or null)]
window.P=[
["Jet-Set Jumpsuit","Jumpsuits","black",30000,"tg-06.jpg"],
["Contour Bodysuit","Bodysuits","black",24000,"tg-08.jpg"],
["Reformer Set","Sets","pink",28000,"tg-09.jpg"],
["Periwinkle Zip Set","Sets","blue",30000,"tg-10.jpg"],
["Ribbed Romper","Rompers","white",22000,"tg-02.jpg"],
["Dusty Pink Set","Sets","pink",27000,"tg-05.jpg"],
["Hot Pink Top","Tops","pink",12000,"tg-07.jpg"],
["Off-Duty Hoodie Set","Sets","cream",32000,"tg-12.jpg"],
// Separates (used by Shop the look, Build your set and the quiz). Example prices.
["Snatched Crop Top","Tops","white",11000,"tg-04.jpg"],
["Sculpt Crop Top","Tops","pink",11000,"tg-09.jpg"],
["Sleek Crop Top","Tops","black",11000,"tg-08.jpg"],
["Turquoise Flare Leggings","Leggings","blue",17000,"tg-04.jpg"],
["Sculpt Leggings","Leggings","black",15000,"tg-06.jpg"],
["Sculpt Leggings","Leggings","pink",15000,"tg-05.jpg"],
["Sculpt Leggings","Leggings","red",15000,"tg-12.jpg"],
["Hot Pink Zip Jacket","Layers","pink",18000,"tg-07.jpg"],
["Periwinkle Zip Jacket","Layers","blue",18000,"tg-10.jpg"],
["Cropped Teddy Hoodie","Layers","cream",20000,"tg-12.jpg"],
// NEW IN (from @t.gangwears). EXAMPLE prices to confirm. Extra fields: [5] second photo (or null), [6] short description.
["Hot Pink Zip Romper","Rompers","pink",24000,"tg-hot-pink-zip-romper-1.jpg","tg-hot-pink-zip-romper-2.jpg","A sleek zip-front romper in hot pink. Sleeveless, sculpting and made to move."],
["White Open-Back Romper","Rompers","white",24000,"tg-white-open-back-romper-1.jpg","tg-white-open-back-romper-2.jpg","Fitted and sleeveless in clean white, with a daring open back."],
["Sunny Side Set","Sets","cream",34000,"tg-sunny-side-set-1.jpg","tg-sunny-side-set-2.jpg","A soft pale-yellow cropped zip jacket and leggings, finished with a white bralette."],
["Kim Set","Sets","red",30000,"tg-kim-set-1.jpg","tg-kim-set-2.jpg","A long-sleeve V-neck top and matching capri leggings in bold red."],
["Milly Play Suit","Rompers","cream",25000,"tg-milly-play-suit-1.jpg","tg-milly-play-suit-2.jpg","A short-sleeve zip-front playsuit in warm beige. Easy, polished, everyday."],
["BB Set","Sets","black",28000,"tg-bb-set-1.jpg",null,"A sleeveless black crop top with a pleated mini skirt. Back in store."],
["5 in 1 Vency Set","Sets","black",38000,"tg-vency-set-1.jpg",null,"A black crop top and capri leggings with red side stripes, part of a five-piece set."],
["Zip Jacket Set","Sets","black",34000,"tg-zip-jacket-set-1.jpg",null,"A cropped zip jacket, crop top and wide-leg pants in black."]
];
// Pieces tagged "New" on cards and in the product popup.
window.NEW=["Hot Pink Zip Romper","White Open-Back Romper","Sunny Side Set","Kim Set","Milly Play Suit","BB Set","5 in 1 Vency Set","Zip Jacket Set"];
window.isNew=p=>(window.NEW||[]).includes(p[0]);
// Example only: pieces shown as sold out so the "Notify me" flow can be demoed.
window.SOLD_OUT=["Contour Bodysuit"];
// THE SALE (example). Percent off per piece, keyed "name|colour". Pieces not listed stay full price.
// The current price above stays as the ORIGINAL; the sale price is computed and used everywhere (bag, sets, checkout).
window.SALE_PCT={"Jet-Set Jumpsuit|black":20,"Reformer Set|pink":25,"Periwinkle Zip Set|blue":30,"Ribbed Romper|white":20,"Dusty Pink Set|pink":15,"Off-Duty Hoodie Set|cream":25,
"Snatched Crop Top|white":20,"Sculpt Crop Top|pink":15,"Sleek Crop Top|black":20,"Turquoise Flare Leggings|blue":30,"Sculpt Leggings|black":20,"Sculpt Leggings|pink":20,"Sculpt Leggings|red":15,"Hot Pink Zip Jacket|pink":25,"Periwinkle Zip Jacket|blue":20};
window.WAS={};P.forEach(p=>{const k=p[0]+'|'+p[2],o=SALE_PCT[k];if(o&&!(window.SOLD_OUT||[]).includes(p[0])){WAS[k]=p[3];p[3]=Math.round(p[3]*(1-o/100)/500)*500}});
window.wasOf=p=>WAS[p[0]+'|'+p[2]];
window.offOf=p=>{const w=wasOf(p);return w?Math.round((1-p[3]/w)*100):0};
window.priceHTML=p=>{const w=wasOf(p),n=x=>TGM.fmt(x);return w?`<s class="was">${n(w)}</s> <span class="now">${n(p[3])}</span>`:n(p[3])};
// COLLECTIONS (shop filters + "Shop by mood" tiles). One per piece; the type above (p[1]) stays for Build your set and shipping weights.
window.COLL={"Active Wear":["Reformer Set","Periwinkle Zip Set","Dusty Pink Set","Sunny Side Set","Kim Set","5 in 1 Vency Set","Snatched Crop Top","Sculpt Crop Top","Sleek Crop Top","Turquoise Flare Leggings","Sculpt Leggings","Hot Pink Zip Jacket","Periwinkle Zip Jacket","Hot Pink Zip Romper"],"Lounge Outfits":["Off-Duty Hoodie Set","Cropped Teddy Hoodie","Milly Play Suit","Ribbed Romper","Zip Jacket Set"]};
window.collOf=p=>Object.keys(COLL).find(k=>COLL[k].includes(p[0]));
// PARCEL WEIGHTS (EXAMPLES, kg per piece incl. packaging) by category. Used for DHL / FedEx shipping quotes.
window.WEIGHT_KG={Jumpsuits:0.6,Bodysuits:0.35,Sets:0.7,Rompers:0.45,Tops:0.25,Leggings:0.35,Layers:0.6};
window.weightOf=p=>WEIGHT_KG[p[1]]||0.5;
