import {fakedata} from "./data.js"
import {faker} from "@faker-js/faker"
import {shuffle} from "underscore"

const ACTIONS = ['UNSUB', 'DOWN/UPGRADE', 'ADD']
const tiers = ['basic', 'pro', 'enterprise']
let subs = []
const unsub = []
const down_or_upgrade = []

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function simulate(action){
   
	if(subs.length === 0){
		
		subs = [...subs,...fakedata(1000)]
		
     return 
   }

 if(action === "ADD"){
	 if(subs.length >= 20_000){
         ACTIONS.pop()
         return 
		}
		// NEVER DO THIS IN A PRODUCTION CODE, THIS IS EXPENSIVE AS HELL, COPYING EVERYTHING, IT'S HORRIBLE
	 subs = [...subs,...fakedata(randomNumber(100, 1000))]
 }else if(action === "UNSUB"){
	
    
	 if(subs.length > 50){
        
        let copy = shuffle(subs)
		let un_ = copy.splice(subs.length - 11).map((person)=> {person.subscriptionTier = null; return person})

		 un_.forEach((u, i) => {
           down_or_upgrade.forEach((d, j)=> {
			   if(u._id === d._id){
                   down_or_upgrade.splice(j, 1)

				}
                 
			})

		})
		 
         unsub.push(...un_)
	     subs = copy;
		 copy = []; // force release memory
         
	 }


 }else{
    if(subs.length > 50){
        let copy = shuffle(subs)
		down_or_upgrade.push(...copy.splice(subs.length - 17).map((person)=> {
			person.subscriptionTier = faker.helpers.arrayElement(tiers.filter(e => e != person.subscriptionTier))
			return person
            }))
	   copy = [];  
	 }
    
 }



	 
	
}



export function startSimulation(connection){

	const l = setInterval(() => {

		simulate(faker.helpers.arrayElement(ACTIONS))
		connection.send(JSON.stringify({type: "realtime", data: {subscriptions: subs, unsubs:unsub, down_or_upgrade}}))
			//console.log("subs :" + subs.length + " unsub: " +  unsub.length + " down_or_upgrade: " + down_or_upgrade.length)
		  if(subs.length <= 50){
			  connection.send(JSON.stringify({type: "closing", msg: "closing connection"}))
              clearInterval(l);
		  }
         }
		,100)
          
}


