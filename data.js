import {faker} from "@faker-js/faker"

import * as sqlite3 from "sqlite3"



function createRandomUser(){
  return {
    _id: faker.datatype.uuid(),
    avatar: faker.image.avatar(),
    birthday: faker.date.birthdate(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    sex: faker.name.sexType(),
    subscriptionTier: faker.helpers.arrayElement(['basic', 'pro', 'enterprise']),
  };
}






export function fakedata(size){

const subs = []



 for (let i = 0; i < size; i++){

	subs.push(createRandomUser())
    
 }

	return subs
}








