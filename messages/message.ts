'use strict';

const messages = [
    { 
        MSG000: 'Service unavailable. Please try again later.',
        status:502
    },
    { 
        MSG000: 'Registration link has already been sent to this email id.',
        status:200
    },
    { 
        MSG000: 'The username or password you entered is incorrect.',
        status:200
    },
    { 
        MSG000: 'You have tried more than 3 times. Your account is locked for 20 minutes.',
        status:200
    },
    { 
        MSG000: 'Your account has been deactivated',
        status:200
    }
];


module.exports = messages;
