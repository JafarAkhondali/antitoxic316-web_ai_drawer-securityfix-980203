require('buffer')

class Gallery{
    constructor(container){
        this.container = container;

        this.img_size = 200

        this.numberContainers = []

        this.exitBtn = document.getElementById("exitNumBoxButton")
        this.exitBtn.style.visibility = "hidden"

        this.#showGroupedGallery()
        
    }

    #createNumberContainers(){
        let table_cont = document.createElement("table")
        table_cont.id = "numberBoxes"
        let row = document.createElement("tr")
        for(let i = 0; i < 10; i++){
            let numberContainer = document.createElement("td")
            numberContainer.className = "numberContainer"
            numberContainer.id = i
            numberContainer.innerHTML = i
            numberContainer.addEventListener("click", this.showOpenedNumBox)
            row.append(numberContainer)
            if((i+1)%3 == 0 || i == 9){
                table_cont.append(row)
                row = document.createElement("tr")
            }

            this.numberContainers.push(numberContainer)
        }

        this.container.append(table_cont)
    }

    #showGroupedGallery(){
        this.#createNumberContainers()
    }

    showOpenedNumBox = (e) => {
        this.exitBtn.style.visibility = "visible"

        fetch('http://localhost:3000/data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return response.json();
        })
        .then(data => {
            this.container.innerHTML = ""

            let boxContainer = document.createElement("table")
            let counter = 0
            let row = document.createElement("tr")
            row.className = "gallery-tr"

            for(let img of data){
                if (Number(img.label) !== Number(e.target.id)) continue;
            
                let canvas = document.createElement("canvas")
                canvas.width=this.img_size;
                canvas.height=this.img_size;
                canvas.style=`
                    background-color:white;
                    box-shadow: 0px 0px 10px 2px black;
                `;

                let ctx = canvas.getContext("2d");

                let url = URL.createObjectURL(new Blob([Buffer.from(img.img_data.data)], {type: "image/png"}))

                let image = new Image();
                image.onload = () => {
                    let scale_factor = Math.min(canvas.width / image.width, canvas.height / image.height);
    
                    let newWidth = image.width * scale_factor;
                    let newHeight = image.height * scale_factor;
            
                    let x = (canvas.width / 2) - (newWidth / 2);
                    let y = (canvas.height / 2) - (newHeight / 2);

                    ctx.drawImage(image, Math.round(x), Math.round(y), Math.round(newWidth), Math.round(newHeight));
                    
                    URL.revokeObjectURL(url);
                };
                image.onerror = function(err) {
                    console.error("Error loading image", err);
                };
            
                image.src = url
                
                let cell = document.createElement("td")
                cell.className = "gallery-td"

                cell.append(canvas)
                row.append(cell)
                counter++
                if (counter%5 == 0){
                    boxContainer.append(row)
                    row = document.createElement("tr")
                }
            }
            if (counter%5 !== 0)
                boxContainer.append(row)

            this.container.append(boxContainer)
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    }

    #showUnorganizedGallery(){
        
    }

    loadData(){
        let fetched_data = null
        fetch('http://localhost:3000/data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return response.json();
        })
        .then(data => {
            fetched_data = data;
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
        return fetched_data
    }
}

module.exports = {"Gallery": Gallery}