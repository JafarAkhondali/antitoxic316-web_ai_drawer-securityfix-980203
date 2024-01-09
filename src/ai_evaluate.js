class numLabelsPossibilities{
    constructor(container){
        this.container = container

        this.possibilities = []
        this.#generateEmptyNumLabels()
    }

    #generateEmptyNumLabels(){
        for(let i = 0; i < 10; i++){
            let labelContainer = document.createElement("div")
            labelContainer.class = "labelContainer"
            
            let label = document.createElement("p")
            label.class = "labelNum"
            label.innerHTML = i + ": "

            let possibility = document.createElement("p")
            possibility.class = "possibility"
            possibility.id = i
            possibility.innerHTML = "0.0000"

            labelContainer.append(label)
            labelContainer.append(possibility)

            this.possibilities.push(possibility)
            this.container.append(labelContainer)
        }
    }

    updateNumLabels(model_output){
        let predictedNums = model_output //ai eval 10d vector

        for(let i = 0; i < 10; i++){
            this.possibilities[i].innerHTML = predictedNums[i].toFixed(4)
        }
    }
}