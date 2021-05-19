const prompt = require('prompt');
const { EOL } = require('os');
const { execSync } = require('child_process');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { randomInt } = require('crypto');

const supportedDrivers = {
    'pg': { name: 'PostgreSQL', defaultPort: 5432 },
    'mysql': { name: 'MySQL', defaultPort: 3306 }
};

start();

async function start() {

    try {

        prompt.message = '';
        prompt.colors = false;

        prompt.start();

        let db;
        let connParams;

        let reconfigure;
        do {
            reconfigure = false;

            console.log(`${EOL}*** DATABASE CONFIGURATION ***${EOL}`);

            connParams = await getConnectionParams();

            db = getDriverInterface(connParams.driver);

            do {
                try {
                    console.log('Trying to connect to the database...');

                    await db.connect(connParams);

                    break;
                } catch (e) {
                    const { option } = await prompt.get({
                        properties: {
                            option: {
                                description: 'Unable to connect to the database, retry?',
                                type: 'string',
                                message: 'Invalid option',
                                default: 'y',
                                required: true
                            }
                        }
                    });

                    if (option !== 'y') {
                        reconfigure = true;
                        break;
                    }
                }


            } while (true);
        } while (reconfigure);

        console.log('Connected');

        console.log(`${EOL}*** BOARD CONFIGURATION ***${EOL}`);

        const boardName = await getBoardName();
        const boardPort = await getBoardPort();
        const fUsername = await getFounderName();
        const fPassword = await getFounderPassword();
        const fEmail = await getFounderEmail();
        const secret = generateSecureString(64);

        console.log('Now the installation begins, before starting check that:');
        console.log(' - the selected database does not contain any tables');
        console.log(' - the selected user has full permissions in the database');
        console.log(' - there is no file called .env in the main folder');

        const { proceed } = await prompt.get({
            properties: {
                proceed: {
                    description: 'Proceed?',
                    type: 'string',
                    message: 'Invalid option',
                    default: 'y',
                    required: true
                }
            }
        });

        if (proceed !== 'y') {
            console.log('Aborting...');
            process.exit(0);
        }

        try {

            await db.begin();

            console.log('Creating the tables...');

            await db.createTables();

            console.log('Populating the tables...');

            await db.init(boardName, fUsername, fPassword, fEmail);

            console.log('Generating file .env...');

            fs.writeFileSync(path.join(__dirname, '..', '.env'), `BOARD_PORT=${boardPort}${EOL}DB_DRIVER=${connParams.driver}${EOL}DB_HOST=${connParams.host}${EOL}DB_PORT=${connParams.port}${EOL}DB_NAME=${connParams.name}${EOL}DB_USER=${connParams.user}${EOL}DB_PASSWORD=${connParams.pass}${EOL}SECRET=${secret}`, { encoding: 'utf-8' });

            await db.commit();
        } catch (e) {
            console.log('An error occurred, retry again');
            console.log('Aborting...');
            await db.rollback();
            process.exit(1);
        }

        console.log(`${EOL}*** INSTALLATION COMPLETED ***${EOL}`);

        console.log(`Now you can type 'npm start' to start the board on port ${boardPort}`);
        console.log('If you have chosen a reserved port, you may need to run the command as sudo');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

}

function generateSecureString(length) {
    const buffer = ['7', 'X', 'R', 'b', 'r', 't', 'l', 'f', 'q', 'Q', 'S', '8', 'v', 'h', 's', 'o', 'd', '5', 'K', 'R', 'y', 'g', 'A', 'S', 'H', 'G', '5', 'O', 'A', 'F', 'T', 'k', 'j', 'x', 'O', 'W', 'o', 'O', '6', 'V', 'B', 'R', 'S', '7', '4', 'a', '2', 'o', 'q', 'k', 'r', 'P', 'J', 'b', 'g', 'P', 'A', 'c', 'Z', 'T', '8', 'p', 'R', 'M', '0', 'z', 'C', 'c', '8', 'K', 'N', 'J', 'v', 'p', 'T', '8', '8', 'T', 'g', 'V', '1', 'd', 'E', 'a', 'I', 'O', 'H', '0', '1', 'B', 'a', 'z', '1', 'o', 'a', 'A', 'm', 'E', 'a', 'k'];
    let result = "";
    while (result.length < length) {
        result += buffer[randomInt(buffer.length)];
    }

    return result;
}

async function getBoardName() {
    const { name } = await prompt.get({
        properties: {
            name: {
                description: 'Board\'s name',
                type: 'string',
                message: 'Invalid name',
                required: true
            }
        }
    });

    return name;
}

async function getBoardPort() {

    const { port } = await prompt.get({
        properties: {
            port: {
                description: 'Enter the board port',
                type: 'integer',
                message: 'Invalid port',
                required: true,
                default: 80
            }
        }
    });

    return port;
}

async function getFounderEmail() {

    const { email } = await prompt.get({
        properties: {
            email: {
                description: 'Founder\'s email',
                type: 'string',
                message: 'Invalid email',
                conform: function (value) { return (value.length > 0 && value.length <= 128) },
                required: true
            }
        }
    });

    return email;
}

async function getFounderName() {

    const { name } = await prompt.get({
        properties: {
            name: {
                description: 'Founder\'s username',
                type: 'string',
                pattern: /^[\x41-\x5A\x5F\x61-\x7A][\x30-\x39\x41-\x5A\x5F\x61-\x7A]*$/,
                message: 'Invalid username. Can contain only ASCII letters and numbers. Must start with a letter.',
                conform: function (value) { return (value.length > 0 && value.length <= 32) },
                required: true
            }
        }
    });

    return name;
}

async function getFounderPassword() {

    const { pass } = await prompt.get({
        properties: {
            pass: {
                description: 'Founder\'s password',
                type: 'string',
                message: 'Invalid password',
                required: true,
                hidden: true,
                replace: '*'
            }
        }
    });

    const hash = bcrypt.hashSync(pass, 10);

    return hash;
}

function getDriverInterface(driver) {
    let db = null;
    switch (driver) {
        case 'pg':
            db = require('./interfaces/pg');
            break;
        case 'mysql':
            db = require('./interfaces/mysql');
            break;
        default:
            console.log('Unknown driver');
            process.exit(1);
    }

    return db;
}

async function getConnectionParams() {

    connParams = {};

    connParams.driver = await getDatabaseDriver();

    connParams.host = await getDatabaseHost();

    connParams.port = await getDatabasePort(supportedDrivers[connParams.driver].defaultPort);

    connParams.name = await getDatabaseName();

    connParams.user = await getDatabaseUser();

    connParams.pass = await getDatabasePassword();

    return connParams;
}

function getInstalledDrivers() {

    let cmd = 'npm ls --json ';
    Object.keys(supportedDrivers).forEach(e => { cmd += e + ' ' });

    let result = null;

    try{
        result = JSON.parse(execSync(cmd, { encoding: 'utf-8' }));
    }catch(e) {
        result = {};
    }

    const drivers = [];

    if (result.dependencies) {
        Object.keys(supportedDrivers).forEach(e => {
            if (result.dependencies[e])
                drivers.push(e);
        });
    }

    return drivers;
}

async function getDatabaseDriver() {

    const drivers = getInstalledDrivers();

    if (drivers.length < 1) {
        console.log('No drivers found');
        process.exit(1);
    }

    console.log('Found the following drivers:');
    drivers.forEach(e => { console.log(' - ' + e) });

    console.log();

    const { driver } = await prompt.get({
        properties: {
            driver: {
                description: 'Enter the name of the driver to use',
                type: 'string',
                pattern: '^(' + drivers.join('|') + ')$',
                message: 'This driver is not installed',
                required: true
            }
        }
    });

    return driver;
}

async function getDatabaseHost() {

    const { host } = await prompt.get({
        properties: {
            host: {
                description: 'Enter the address of the database',
                type: 'string',
                message: 'Invalid address',
                required: true,
                default: 'localhost'
            }
        }
    });

    return host;
}

async function getDatabasePort(defaultPort) {

    const { port } = await prompt.get({
        properties: {
            port: {
                description: 'Enter the database port',
                type: 'integer',
                message: 'Invalid port',
                required: true,
                default: defaultPort
            }
        }
    });

    return port;
}

async function getDatabaseName() {

    const { name } = await prompt.get({
        properties: {
            name: {
                description: 'Enter the name of the database',
                type: 'string',
                message: 'Invalid name',
                required: true
            }
        }
    });

    return name;
}

async function getDatabaseUser() {

    const { user } = await prompt.get({
        properties: {
            user: {
                description: 'Enter the name of the database user',
                type: 'string',
                message: 'Invalid username',
                required: true
            }
        }
    });

    return user;
}

async function getDatabasePassword() {

    const { pass } = await prompt.get({
        properties: {
            pass: {
                description: 'Enter the password of the database user',
                type: 'string',
                message: 'Invalid password',
                required: true,
                hidden: true,
                replace: '*'
            }
        }
    });

    return pass;
}