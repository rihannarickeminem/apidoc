Shopping Together site
Before starting any actions create .env file in root directory with following parameters:
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
MAILGUN_PASSWORD=
MAILGUN_USER=
***************************************************************
It's practice application, build on top of express 4 module and uses babel as es6 compiler.
During mocha test, it uses local mongodb 'mongodb://localhost/st'

To run specific test execute in terminal ./node_modules/mocha/bin/mocha -g 'sigg'  --compilers  js:babel-core/register
**** Note that this greps across the names of all describe(name, fn) and it(name, fn) invocations.
To run all tests use » ./node_modules/mocha/bin/mocha -g 'sigg'  --compilers  js:babel-core/register 


issues used:
 https://github.com/mochajs/mocha/issues/2177 
