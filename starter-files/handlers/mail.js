const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')
const promisify = require('es6-promisify')

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

transport.sendMail({
    from: 'Ewerton <ewerton.azevedo@live.co.uk>',
    to: 'randy@example.com',
    subject:'Trying Email',
    html:'Hey <strong>This is a test</strong>',
    text:'Hey **This is a test**'
})

console.log(`${process.env.MAIL_HOST}:${process.env.MAIL_PORT}`)
console.log(`${process.env.MAIL_USER}:${process.env.MAIL_PASS}`)