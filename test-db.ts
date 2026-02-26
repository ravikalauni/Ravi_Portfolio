import db from './db';

async function testConn() {
    console.log('Testing connection...');
    try {
        const result = db.prepare('SELECT 1 as result').get();
        console.log('Connection successful:', result);
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
}

testConn();
