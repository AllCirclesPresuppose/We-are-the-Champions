// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsements-d87d4-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements/text")
const fromInDB = ref(database, "endorsements/from")
const toInDB = ref(database, "endorsements/to")

const txtInpt = document.getElementById("txt-inpt")
const fromInpt = document.getElementById("from-inpt")
const toInput = document.getElementById("to-inpt")
const btn = document.getElementById("btn")
const endorsements = document.getElementById("endorsements")

btn.addEventListener('click', function () {
    let input = txtInpt.value
    let frm = fromInpt.value
    let to = toInput.value

    if (input === "" || frm === "" || to === "") {
        endorsements.innerHTML += "<p>Please enter an endorsement, who it's from, and who its to!</p>"
    }
    else {

        push(endorsementsInDB, input)
        push(fromInDB, frm)
        push(toInDB, to)
        clearTxtInpt()
    }
})

function clearTxtInpt() {
    txtInpt.value = ""
    fromInpt.value = ""
    toInput.value = ""
}

onValue(endorsementsInDB, function (snapshot) {
    if (snapshot.exists()) {
        let endArray = Object.entries(snapshot.val())
        onValue(fromInDB, function (snapshot) {
            if (snapshot.exists()) {
                let fromArray = Object.entries(snapshot.val())
                onValue(toInDB, function (snapshot) {
                    if (snapshot.exists()) {
                        let toArray = Object.entries(snapshot.val())

                        clearEndorsements()

                        for (let i = 0; i < endArray.length; i++) {
                            let endItem = endArray[i]
                            let fromItem = fromArray[i]
                            let toItem = toArray[i]
                            appendEndItem(endItem, fromItem, toItem)
                        }

                    }
                })

            }
        })






    } else {
        endorsements.innerHTML = "<p>No endorsements yet, type one up!</p>"
    }
})

// function returnDBArray(DB) {
//     onValue(DB, function(snapshot) {
//             if(snapshot.exists()) {
//             let testArray = Object.entries(snapshot.val())
//             return testArray
//         }
//     }
// }

function clearEndorsements() {
    endorsements.innerHTML = ""
}

function appendEndItem(endItem, fromItem, toItem) {
    let endItemID = endItem[0]
    let endItemValue = endItem[1]
    let fromItemID = fromItem[0]
    let fromItemValue = fromItem[1]
    let toItemID = toItem[0]
    let toItemValue = toItem[1]


    let newEl = document.createElement("li")


    newEl.innerHTML = `<h3>From ${fromItemValue}</h3>`
    newEl.innerHTML += `<p>${endItemValue}</p>`
    newEl.innerHTML += `<div class="to-heart"> <h3>To ${toItemValue}</h3> <h3>❤️ <span id="like${endItemID}">0</span></h3></div>`



    newEl.addEventListener("click", function () {
        const like = document.getElementById(`like${endItemID}`)
        console.log(Number(like.textContent) + 1)
        like.innerHTML = Number(like.textContent) + 1
        //let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`)
        //remove(exactLocationOfItemInDB)
    })

    endorsements.append(newEl)
}
