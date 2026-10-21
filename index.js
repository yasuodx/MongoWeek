const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/Week8';

const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: Number,
    gender: String,
    salary: Number,
    city: String
});

const Person = mongoose.model(
    'modelname',
    PersonSchema,
    'personCollection'
);
async function insertOne() {
    const doc1 = new Person({
        name: 'Stefan',
        age: 20,
        gender: 'Male',
        salary: 50000
    });

    const savedDoc = await doc1.save();

    console.log('One document inserted');
    console.log(savedDoc);
}

async function findFemalesOver30() {
    const givenAge = 30;

    const docs = await Person.find({
        gender: 'Female',
        age: { $gte: givenAge }
    })
        .sort({ salary: 1 })
        .select('name salary age')
        .limit(10);

    console.log(`Females aged ${givenAge} or above:`);

    docs.forEach(doc => {
        console.log(doc.age, doc.name, doc.salary);
    });
}

async function insertMany() {
    const manypersons = [
        { name: 'SimonNHQ', age: 42, gender: 'Male', salary: 3456 },
        { name: 'NeeshaNN', age: 53, gender: 'Female', salary: 1000 },
        { name: 'MaryNHQ', age: 27, gender: 'Female', salary: 5402 },
        { name: 'MikeNJQ', age: 40, gender: 'Male', salary: 4519 }
    ];

    const result = await Person.insertMany(manypersons);

    console.log('Many documents inserted');
    console.log(result);
}

async function findAll() {
    const docs = await Person.find({})
        .sort({ salary: 1 })
        .select('name salary age')
        .limit(5);

    console.log('Five people sorted by salary:');

    docs.forEach(doc => {
        console.log(doc.age, doc.name, doc.salary);
    });
}

async function countDocuments() {
    const count = await Person.countDocuments();

    console.log('Total Documents Count:', count);
}

async function deleteManyPersons() {
    const result = await Person.deleteMany({
        age: { $gte: 45 }
    });

    console.log('Deleted documents:', result.deletedCount);
}

async function updateManyPersons() {
    const result = await Person.updateMany(
        { gender: 'Female' },
        { $set: { salary: 5555 } }
    );

    console.log('Matched documents:', result.matchedCount);
    console.log('Updated documents:', result.modifiedCount);
}

async function insertPeopleWithCities() {
    const people = [
        { name: 'Alex', age: 24, gender: 'Male', salary: 3000, city: 'London' },
        { name: 'Sara', age: 31, gender: 'Female', salary: 4200, city: 'Birmingham' },
        { name: 'James', age: 28, gender: 'Male', salary: 3500, city: 'Manchester' }
    ];

    const result = await Person.insertMany(people);

    console.log('People inserted with cities:', result.length);
}

async function findPeopleByCity() {
    const city = 'London';

    const docs = await Person.find({ city })
        .select('name age salary city -_id');

    console.log(`People from ${city}:`);

    docs.forEach(doc => {
        console.log(doc.name, doc.age, doc.salary, doc.city);
    });
}

async function main() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        await findPeopleByCity();
        
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.connection.close();
        console.log('Connection closed');
    }
}

main();